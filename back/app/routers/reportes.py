from fastapi import APIRouter, HTTPException
from app.db import query_all, DatabaseError

router = APIRouter(prefix="/reportes", tags=["Reportes"])


@router.get("/salas-mas-reservadas")
def salas_mas_reservadas():
    try:
        sql = """
            SELECT nombre_sala, edificio, COUNT(*) AS cantidad_reservas
            FROM reserva
            GROUP BY nombre_sala, edificio
            ORDER BY cantidad_reservas DESC
            LIMIT 10
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/turnos-mas-demandados")
def turnos_mas_demandados():
    try:
        sql = """
            SELECT t.hora_inicio, t.hora_fin, COUNT(*) AS cantidad_reservas
            FROM reserva r
            JOIN turno t ON r.id_turno = t.id_turno
            GROUP BY t.id_turno, t.hora_inicio, t.hora_fin
            ORDER BY cantidad_reservas DESC
            LIMIT 10
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/promedio-participantes")
def promedio_participantes():
    try:
        sql = """
            SELECT r.nombre_sala, r.edificio, AVG(sub.cantidad) AS promedio
            FROM reserva r
            JOIN (
                SELECT id_reserva, COUNT(*) AS cantidad
                FROM reserva_participante
                GROUP BY id_reserva
            ) sub ON r.id_reserva = sub.id_reserva
            GROUP BY r.nombre_sala, r.edificio
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reservas-por-carrera")
def reservas_por_carrera():
    try:
        sql = """
            SELECT pa.nombre_programa, f.nombre AS facultad, COUNT(*) AS cantidad_reservas
            FROM reserva_participante rp
            JOIN participante_programa_academico ppa ON rp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            JOIN facultad f ON pa.id_facultad = f.id_facultad
            GROUP BY pa.nombre_programa, f.nombre
            ORDER BY cantidad_reservas DESC
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ocupacion-por-edificio")
def ocupacion_por_edificio():
    try:

        sql = """
            SELECT edificio, 
                   COUNT(*) AS reservas_edificio,
                   (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reserva)) AS porcentaje
            FROM reserva
            GROUP BY edificio
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reservas-vs-asistencia")
def reservas_vs_asistencia():
    try:

        sql = """
            SELECT 
                ppa.rol,
                pa.tipo AS tipo_programa,
                COUNT(*) AS total_reservas,
                SUM(rp.asistencia) AS total_asistencias
            FROM reserva_participante rp
            JOIN participante_programa_academico ppa ON rp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            GROUP BY ppa.rol, pa.tipo
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cantidad-sanciones")
def cantidad_sanciones():
    try:
        sql = """
            SELECT 
                ppa.rol,
                pa.tipo AS tipo_programa,
                COUNT(*) AS cantidad_sanciones
            FROM sancion_participante sp
            JOIN participante_programa_academico ppa ON sp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            GROUP BY ppa.rol, pa.tipo
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/efectividad-reservas")
def efectividad_reservas():
    try:
        
        sql = """
            SELECT 
                estado,
                COUNT(*) AS cantidad,
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reserva)) AS porcentaje
            FROM reserva
            GROUP BY estado
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/top-usuarios-frecuentes")
def top_usuarios_frecuentes():
    try:
        sql = """
            SELECT p.nombre, p.apellido, COUNT(*) AS cantidad_reservas
            FROM reserva_participante rp
            JOIN participante p ON rp.ci_participante = p.ci
            GROUP BY p.ci, p.nombre, p.apellido
            ORDER BY cantidad_reservas DESC
            LIMIT 5
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/horas-pico")
def horas_pico():
    try:
        sql = """
            SELECT t.hora_inicio, COUNT(*) AS total
            FROM reserva r
            JOIN turno t ON r.id_turno = t.id_turno
            GROUP BY t.hora_inicio
            ORDER BY total DESC
            LIMIT 5
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/salas-sin-uso")
def salas_sin_uso():
    try:
        sql = """
            SELECT s.nombre_sala, s.edificio
            FROM sala s
            LEFT JOIN reserva r ON s.nombre_sala = r.nombre_sala AND s.edificio = r.edificio
            WHERE r.id_reserva IS NULL
        """
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
