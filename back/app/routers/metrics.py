from fastapi import APIRouter, HTTPException
from app.db import query_all, DatabaseError

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.get("/salas-mas-reservadas")
def get_salas_mas_reservadas():
    try:
        sql = """
            SELECT
                nombre_sala,
                edificio,
                COUNT(*) AS reservas
            FROM reserva
            GROUP BY nombre_sala, edificio
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
                t.hora_inicio,
                t.hora_fin,
                COUNT(*) AS reservas
            FROM reserva r
            JOIN turno t ON r.id_turno = t.id_turno
            GROUP BY t.id_turno, t.hora_inicio, t.hora_fin
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
                r.nombre_sala,
                r.edificio,
                CAST(AVG(sub.cantidad) AS DECIMAL(10, 2)) AS promedio
            FROM reserva r
            JOIN (
                SELECT id_reserva, COUNT(*) AS cantidad
                FROM reserva_participante
                GROUP BY id_reserva
            ) sub ON r.id_reserva = sub.id_reserva
            GROUP BY r.nombre_sala, r.edificio
            ORDER BY promedio DESC;
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
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/porcentaje-ocupacion-por-edificio")
def get_porcentaje_ocupacion_por_edificio():
    try:
        sql = """
            SELECT
                edificio,
                (COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM reserva), 0)) AS porcentaje
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
        sql = """
            SELECT
                estado,
                (COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM reserva), 0)) AS porcentaje
            FROM reserva
            GROUP BY estado;
        """
        result = query_all(sql)

        data = {
            "efectivas": 0.0,
            "canceladas": 0.0,
            "noAsistidas": 0.0,
        }

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
        return {row['tipo_sala']: row['reservas'] for row in result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasa-no-asistencia-por-carrera")
def get_tasa_no_asistencia_por_carrera():
    try:
        sql = """
            SELECT
                pa.nombre_programa,
                COALESCE(
                    SUM(CASE WHEN r.estado = 'sin asistencia' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(r.id_reserva), 0),
                    0
                ) AS tasa_no_asistencia
            FROM reserva r
            JOIN reserva_participante rp ON r.id_reserva = rp.id_reserva
            JOIN participante_programa_academico ppa ON rp.ci_participante = ppa.ci_participante
            JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            GROUP BY pa.nombre_programa
            ORDER BY tasa_no_asistencia DESC;
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
        return {row['participantes']: row['cantidad_reservas'] for row in result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
