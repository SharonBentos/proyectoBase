from fastapi import APIRouter, HTTPException
from app.db import query_all, DatabaseError

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("/salas-mas-reservadas")
def get_salas_mas_reservadas():
    try:
        sql = """
            SELECT
                CONCAT(nombre_sala, ' (', edificio, ')') AS sala,
                COUNT(*) AS reservas
            FROM reserva
            GROUP BY sala
            ORDER BY reservas DESC
            LIMIT 10;
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/turnos-mas-demandados")
def get_turnos_mas_demandados():
    try:
        sql = """
            SELECT
                CONCAT(t.hora_inicio, ' - ', t.hora_fin) AS turno,
                COUNT(*) AS reservas
            FROM reserva r
            JOIN turno t ON r.id_turno = t.id_turno
            GROUP BY turno
            ORDER BY reservas DESC
            LIMIT 10;
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/promedio-participantes-por-sala")
def get_promedio_participantes_por_sala():
    try:
        sql = """
            SELECT
                CONCAT(r.nombre_sala, ' (', r.edificio, ')') AS sala,
                CAST(AVG(sub.cantidad) AS DECIMAL(10, 2)) AS promedio
            FROM reserva r
            JOIN (
                SELECT id_reserva, COUNT(*) AS cantidad
                FROM reserva_participante
                GROUP BY id_reserva
            ) sub ON r.id_reserva = sub.id_reserva
            GROUP BY sala;
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reservas-por-carrera-y-facultad")
def get_reservas_por_carrera_y_facultad():
    try:
        sql = """
            SELECT
                pa.nombre_programa,
                f.nombre AS facultad,
                COUNT(DISTINCT r.id_reserva) AS cantidad_reservas
            FROM reserva_participante rp
            JOIN reserva r ON rp.id_reserva = r.id_reserva
            JOIN participante_programa_academico ppa ON rp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            JOIN facultad f ON pa.id_facultad = f.id_facultad
            GROUP BY pa.nombre_programa, f.nombre
            ORDER BY cantidad_reservas DESC;
        """
        result = query_all(sql)
        # The frontend expects a dictionary
        return {f"{row['nombre_programa']} ({row['facultad']})": row['cantidad_reservas'] for row in result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/porcentaje-ocupacion-por-edificio")
def get_porcentaje_ocupacion_por_edificio():
    try:
        sql = """
            SELECT
                edificio,
                CONCAT(CAST((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM reserva), 0)) AS DECIMAL(10, 2)), '%%') AS porcentaje
            FROM reserva
            GROUP BY edificio;
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reservas-asistencias-por-rol")
def get_reservas_asistencias_por_rol():
    try:
        sql = """
            SELECT
                ppa.rol,
                pa.tipo AS tipo_programa,
                COUNT(DISTINCT rp.id_reserva) AS reservas,
                COUNT(CASE WHEN rp.asistencia = 1 THEN rp.id_reserva ELSE NULL END) AS asistencias
            FROM reserva_participante rp
            JOIN participante_programa_academico ppa ON rp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            GROUP BY ppa.rol, pa.tipo;
        """
        result = query_all(sql)

        # The frontend expects a specific dictionary format
        data = {
            "alumnos_grado": {"reservas": 0, "asistencias": 0},
            "alumnos_posgrado": {"reservas": 0, "asistencias": 0},
            "profesores": {"reservas": 0, "asistencias": 0},
        }

        for row in result:
            if row['rol'] == 'alumno' and row['tipo_programa'] == 'grado':
                data['alumnos_grado'] = {"reservas": row['reservas'], "asistencias": row['asistencias']}
            elif row['rol'] == 'alumno' and row['tipo_programa'] == 'posgrado':
                data['alumnos_posgrado'] = {"reservas": row['reservas'], "asistencias": row['asistencias']}
            elif row['rol'] == 'docente':
                data['profesores']['reservas'] += row['reservas']
                data['profesores']['asistencias'] += row['asistencias']

        return data
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sanciones-por-rol")
def get_sanciones_por_rol():
    try:
        sql = """
            SELECT
                ppa.rol,
                pa.tipo AS tipo_programa,
                COUNT(*) AS cantidad_sanciones
            FROM sancion_participante sp
            JOIN participante_programa_academico ppa ON sp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            GROUP BY ppa.rol, pa.tipo;
        """
        result = query_all(sql)

        data = {
            "alumnos_grado": 0,
            "alumnos_posgrado": 0,
            "profesores": 0,
        }

        for row in result:
            if row['rol'] == 'alumno' and row['tipo_programa'] == 'grado':
                data['alumnos_grado'] = row['cantidad_sanciones']
            elif row['rol'] == 'alumno' and row['tipo_programa'] == 'posgrado':
                data['alumnos_posgrado'] = row['cantidad_sanciones']
            elif row['rol'] == 'docente':
                data['profesores'] += row['cantidad_sanciones']

        return data
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/comparativa-uso-reservas")
def get_comparativa_uso():
    try:
        total_reservas_query = "SELECT COUNT(*) as total FROM reserva"
        total_reservas_result = query_all(total_reservas_query)
        total_reservas = total_reservas_result[0]['total'] if total_reservas_result else 0

        data = {
            "efectivas": "0.00%",
            "canceladas": "0.00%",
            "noAsistidas": "0.00%",
        }

        if total_reservas == 0:
            return data

        sql = f"""
            SELECT
                estado,
                CONCAT(CAST((COUNT(*) * 100.0 / {total_reservas}) AS DECIMAL(10, 2)), '%%') AS porcentaje
            FROM reserva
            GROUP BY estado;
        """

        result = query_all(sql)

        for row in result:
            if row['estado'] == 'finalizada':
                data['efectivas'] = row['porcentaje']
            elif row['estado'] == 'cancelada':
                data['canceladas'] = row['porcentaje']
            elif row['estado'] == 'sin asistencia':
                data['noAsistidas'] = row['porcentaje']

        return data
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/uso-salas-por-tipo")
def get_uso_salas_por_tipo():
    try:
        sql = """
            SELECT
                s.tipo_sala,
                COUNT(r.id_reserva) AS reservas
            FROM sala s
            JOIN reserva r ON s.nombre_sala = r.nombre_sala AND s.edificio = r.edificio
            GROUP BY s.tipo_sala;
        """
        result = query_all(sql)

        # Mapping database values to frontend expected keys
        tipo_map = {
            "libre": "Uso libre",
            "posgrado": "Exclusiva de posgrado",
            "docente": "Exclusiva de docentes"
        }

        return {tipo_map.get(row['tipo_sala'], row['tipo_sala']): row['reservas'] for row in result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasa-no-asistencia-por-carrera")
def get_tasa_no_asistencia_por_carrera():
    try:
        sql = """
            SELECT
                pa.nombre_programa,
                CONCAT(
                    CAST(
                        COALESCE(
                            SUM(CASE WHEN r.estado = 'sin asistencia' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(r.id_reserva), 0),
                            0
                        )
                        AS DECIMAL(10, 2)
                    ),
                '%%') AS tasa_no_asistencia
            FROM reserva r
            JOIN reserva_participante rp ON r.id_reserva = rp.id_reserva
            JOIN participante_programa_academico ppa ON rp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            GROUP BY pa.nombre_programa;
        """
        result = query_all(sql)
        return {row['nombre_programa']: row['tasa_no_asistencia'] for row in result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/distribucion-tamanio-grupos")
def get_distribucion_grupos():
    try:
        sql = """
            SELECT
                participantes,
                COUNT(id_reserva) AS cantidad_reservas
            FROM (
                SELECT
                    r.id_reserva,
                    COUNT(rp.ci_participante) AS participantes
                FROM reserva r
                JOIN reserva_participante rp ON r.id_reserva = rp.id_reserva
                GROUP BY r.id_reserva
            ) AS subquery
            GROUP BY participantes
            ORDER BY participantes;
        """
        result = query_all(sql)
        return {f"{row['participantes']} participantes": row['cantidad_reservas'] for row in result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
