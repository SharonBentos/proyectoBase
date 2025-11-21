from typing import List

from fastapi import APIRouter, HTTPException, status
from app.db import query_all, execute, DatabaseError
from app.schemas import SancionCreate, SancionResponse
from app.reservas_logic import procesar_inasistencias

router = APIRouter(prefix="/sanciones", tags=["Sanciones"])


@router.get("/", response_model=List[SancionResponse])
def listar_sanciones():
    try:
        sql = "SELECT id_sancion, ci_participante, fecha_inicio, fecha_fin FROM sancion_participante"
        return query_all(sql)
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=SancionResponse, status_code=status.HTTP_201_CREATED)
def crear_sancion(sancion: SancionCreate):
    try:
        sql = """
            INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin)
            VALUES (%s, %s, %s)
        """
        execute(sql, (sancion.ci_participante, sancion.fecha_inicio, sancion.fecha_fin))
        
        from app.db import insert_and_get_id
        id_sancion = insert_and_get_id(sql, (sancion.ci_participante, sancion.fecha_inicio, sancion.fecha_fin))
        
        return SancionResponse(
            id_sancion=id_sancion,
            ci_participante=sancion.ci_participante,
            fecha_inicio=sancion.fecha_inicio,
            fecha_fin=sancion.fecha_fin
        )
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/procesar-inasistencias", status_code=status.HTTP_200_OK)
def trigger_procesar_inasistencias():
    try:
        resultado = procesar_inasistencias()
        return {
            "mensaje": "Proceso completado",
            "detalle": resultado
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
