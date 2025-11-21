from typing import List

from fastapi import APIRouter, HTTPException, status, Query
from app.db import query_all, query_one, DatabaseError
from app.schemas import ReservaCreate, ReservaResponse
from app.reservas_logic import (
    crear_reserva, cancelar_reserva, marcar_asistencia, BusinessRuleError
)

router = APIRouter(prefix="/reservas", tags=["Reservas"])


@router.post("/", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def crear_reserva_endpoint(payload: ReservaCreate):
    try:
        id_reserva = crear_reserva(
            nombre_sala=payload.nombre_sala,
            edificio=payload.edificio,
            fecha=payload.fecha,
            id_turno=payload.id_turno,
            participantes_ci=payload.participantes_ci,
        )
        return ReservaResponse(
            id_reserva=id_reserva,
            mensaje="Reserva creada correctamente",
        )

    except BusinessRuleError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{id_reserva}/cancelar", status_code=status.HTTP_200_OK)
def cancelar_reserva_endpoint(id_reserva: int):
    try:
        cancelar_reserva(id_reserva)
        return {"mensaje": "Reserva cancelada correctamente"}
    except BusinessRuleError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{id_reserva}/asistencia", status_code=status.HTTP_200_OK)
def marcar_asistencia_endpoint(id_reserva: int, ci_participante: str = Query(...), asistencia: bool = Query(...)):
    try:
        marcar_asistencia(id_reserva, ci_participante, asistencia)
        return {"mensaje": "Asistencia actualizada"}
    except BusinessRuleError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[dict]) 
def listar_reservas(ci: str = Query(None)):
    try:
        sql = """
            SELECT r.id_reserva, r.nombre_sala, r.edificio, r.fecha, r.id_turno, r.estado
            FROM reserva r
        """
        params = []
        if ci:
            sql += """
                JOIN reserva_participante rp ON r.id_reserva = rp.id_reserva
                WHERE rp.ci_participante = %s
            """
            params.append(ci)
        
        sql += " ORDER BY r.fecha DESC, r.id_turno DESC"
        
        return query_all(sql, tuple(params))
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
