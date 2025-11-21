from datetime import date, timedelta
from typing import Optional, List

from app.db import query_one, insert_and_get_id, execute, DatabaseError


class BusinessRuleError(Exception):
    pass


def es_posgrado_o_docente(ci: str) -> bool:

    sql = """
        SELECT pa.tipo, ppa.rol
        FROM participante_programa_academico ppa
        JOIN programa_academico pa
          ON ppa.nombre_programa = pa.nombre_programa
        WHERE ppa.ci_participante = %s
        LIMIT 1
    """
    row = query_one(sql, (ci,))
    if not row:
        return False

    return row["tipo"] == "posgrado" or row["rol"] == "docente"


def tiene_sancion_activa(ci: str, fecha: date) -> bool:
    sql = """
        SELECT 1
        FROM sancion_participante
        WHERE ci_participante = %s
          AND fecha_inicio <= %s
          AND fecha_fin >= %s
        LIMIT 1
    """
    row = query_one(sql, (ci, fecha, fecha))
    return row is not None


def horas_reservadas_dia(ci: str, fecha: date) -> int:

    sql = """
        SELECT COUNT(*) AS total
        FROM reserva_participante rp
        JOIN reserva r
          ON rp.id_reserva = r.id_reserva
        JOIN sala s
          ON r.nombre_sala = s.nombre_sala
         AND r.edificio   = s.edificio
        WHERE rp.ci_participante = %s
          AND r.fecha = %s
          AND s.tipo_sala = 'libre'
          AND r.estado IN ('activa', 'finalizada', 'sin asistencia')
    """
    row = query_one(sql, (ci, fecha))
    return int(row["total"]) if row else 0


def reservas_activas_semana(ci: str, fecha: date) -> int:

    lunes = fecha - timedelta(days=fecha.weekday())
    domingo = lunes + timedelta(days=6)

    sql = """
        SELECT COUNT(*) AS total
        FROM reserva_participante rp
        JOIN reserva r
          ON rp.id_reserva = r.id_reserva
        WHERE rp.ci_participante = %s
          AND r.fecha BETWEEN %s AND %s
          AND r.estado = 'activa'
    """
    row = query_one(sql, (ci, lunes, domingo))
    return int(row["total"]) if row else 0


def obtener_tipo_sala(nombre_sala: str, edificio: str) -> Optional[str]:
    sql = """
        SELECT tipo_sala
        FROM sala
        WHERE nombre_sala = %s AND edificio = %s
    """
    row = query_one(sql, (nombre_sala, edificio))
    return row["tipo_sala"] if row else None


def hay_reserva_en_mismo_turno(nombre_sala: str, edificio: str,
                               fecha: date, id_turno: int) -> bool:
  
    sql = """
        SELECT 1
        FROM reserva
        WHERE nombre_sala = %s
          AND edificio     = %s
          AND fecha        = %s
          AND id_turno     = %s
          AND estado IN ('activa', 'finalizada', 'sin asistencia')
        LIMIT 1
    """
    row = query_one(sql, (nombre_sala, edificio, fecha, id_turno))
    return row is not None


def verificar_reglas_reserva(ci: str,
                             nombre_sala: str,
                             edificio: str,
                             fecha: date,
                             id_turno: int,
                             cantidad_personas: int) -> None:

    tipo_sala = obtener_tipo_sala(nombre_sala, edificio)
    if tipo_sala is None:
        raise BusinessRuleError("La sala seleccionada no existe.")

    if hay_reserva_en_mismo_turno(nombre_sala, edificio, fecha, id_turno):
        raise BusinessRuleError("La sala ya está reservada en ese horario.")

    if tiene_sancion_activa(ci, fecha):
        raise BusinessRuleError(
            "No puede reservar porque tiene una sanción activa en esa fecha."
        )

    if not es_posgrado_o_docente(ci):

        if tipo_sala == "libre":
            horas_dia = horas_reservadas_dia(ci, fecha)
            if horas_dia >= 2:
                raise BusinessRuleError(
                    "Ya tiene el máximo de 2 horas reservadas para ese día en salas libres."
                )

        reservas_semana = reservas_activas_semana(ci, fecha)
        if reservas_semana >= 3:
            raise BusinessRuleError(
                "Ya tiene el máximo de 3 reservas activas para esa semana."
            )

    sql_cap = """
        SELECT capacidad
        FROM sala
        WHERE nombre_sala = %s AND edificio = %s
    """
    row_cap = query_one(sql_cap, (nombre_sala, edificio))
    capacidad = int(row_cap["capacidad"]) if row_cap else 0

    if cantidad_personas > capacidad:
        raise BusinessRuleError(
            f"La sala tiene capacidad para {capacidad} personas; "
            f"no puede reservarla para {cantidad_personas}."
        )


def crear_reserva(nombre_sala: str,
                  edificio: str,
                  fecha: date,
                  id_turno: int,
                  participantes_ci: List[str]) -> int:


    if not participantes_ci:
        raise BusinessRuleError("Debe indicar al menos un participante para la reserva.")

    cantidad_personas = len(participantes_ci)

    for ci in participantes_ci:
        verificar_reglas_reserva(
            ci=ci,
            nombre_sala=nombre_sala,
            edificio=edificio,
            fecha=fecha,
            id_turno=id_turno,
            cantidad_personas=cantidad_personas,
        )


    sql_reserva = """
        INSERT INTO reserva (nombre_sala, edificio, fecha, id_turno, estado)
        VALUES (%s, %s, %s, %s, 'activa')
    """
    id_reserva = insert_and_get_id(
        sql_reserva, (nombre_sala, edificio, fecha, id_turno)
    )


    sql_part = """
        INSERT INTO reserva_participante
            (ci_participante, id_reserva, fecha_solicitud_reserva, asistencia)
        VALUES (%s, %s, NOW(), 0)
    """
    for ci in participantes_ci:
        execute(sql_part, (ci, id_reserva))

    return id_reserva


def cancelar_reserva(id_reserva: int) -> None:
    # Solo se puede cancelar si está activa
    sql_check = "SELECT estado FROM reserva WHERE id_reserva = %s"
    row = query_one(sql_check, (id_reserva,))
    if not row:
        raise BusinessRuleError("Reserva no encontrada")
    
    if row["estado"] != "activa":
        raise BusinessRuleError("Solo se pueden cancelar reservas activas")

    execute("UPDATE reserva SET estado = 'cancelada' WHERE id_reserva = %s", (id_reserva,))


def marcar_asistencia(id_reserva: int, ci_participante: str, asistencia: bool) -> None:
    # Verificar que la reserva exista y esté activa (o finalizada recientemente? asumimos activa)
    # Permitimos marcar asistencia incluso si ya pasó el turno, siempre que no esté cancelada
    sql_check = "SELECT estado FROM reserva WHERE id_reserva = %s"
    row = query_one(sql_check, (id_reserva,))
    if not row:
        raise BusinessRuleError("Reserva no encontrada")
    
    if row["estado"] == "cancelada":
        raise BusinessRuleError("No se puede marcar asistencia en una reserva cancelada")

    # Verificar que el participante esté en la reserva
    sql_part = "SELECT 1 FROM reserva_participante WHERE id_reserva = %s AND ci_participante = %s"
    if not query_one(sql_part, (id_reserva, ci_participante)):
        raise BusinessRuleError("El participante no corresponde a esta reserva")

    val = 1 if asistencia else 0
    execute(
        "UPDATE reserva_participante SET asistencia = %s WHERE id_reserva = %s AND ci_participante = %s",
        (val, id_reserva, ci_participante)
    )


def procesar_inasistencias() -> dict:
    """
    Busca reservas pasadas que sigan 'activas'.
    Si asistencia = 0 -> Sanción (2 meses).
    Actualiza estado reserva a 'finalizada' o 'sin asistencia'.
    """
    # 1. Buscar reservas 'activas' cuya fecha < HOY (o fecha=HOY y hora_fin < NOW, simplificamos a fecha < HOY para el job diario)
    # Para demo, usaremos fecha <= HOY para que procese todo lo pendiente
    
    today = date.today()
    
    sql_reservas = """
        SELECT id_reserva, fecha
        FROM reserva
        WHERE estado = 'activa' AND fecha < %s
    """
    reservas = query_all(sql_reservas, (today,))
    
    sanciones_creadas = 0
    reservas_procesadas = 0

    for res in reservas:
        id_reserva = res["id_reserva"]
        fecha_reserva = res["fecha"]
        
        # Obtener participantes
        sql_parts = """
            SELECT ci_participante, asistencia
            FROM reserva_participante
            WHERE id_reserva = %s
        """
        participantes = query_all(sql_parts, (id_reserva,))
        
        asistieron_todos = True
        ninguno_asistio = True
        
        for p in participantes:
            if p["asistencia"] == 0:
                asistieron_todos = False
                # Crear sanción
                # 2 meses de sanción
                fecha_inicio = today
                fecha_fin = today + timedelta(days=60)
                
                # Verificar si ya tiene sanción por esta reserva? 
                # Simplificación: Insertar sanción directa
                sql_sancion = """
                    INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin)
                    VALUES (%s, %s, %s)
                """
                execute(sql_sancion, (p["ci_participante"], fecha_inicio, fecha_fin))
                sanciones_creadas += 1
            else:
                ninguno_asistio = False

        # Actualizar estado reserva
        nuevo_estado = "finalizada"
        if ninguno_asistio:
            nuevo_estado = "sin asistencia"
        
        execute("UPDATE reserva SET estado = %s WHERE id_reserva = %s", (nuevo_estado, id_reserva))
        reservas_procesadas += 1

    return {"reservas_procesadas": reservas_procesadas, "sanciones_creadas": sanciones_creadas}
