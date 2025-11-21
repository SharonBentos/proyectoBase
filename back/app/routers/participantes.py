from typing import List

from fastapi import APIRouter, HTTPException, status
from pymysql.err import IntegrityError

from app.db import query_all, query_one, execute, DatabaseError
from app.schemas import ParticipanteCreate, ParticipanteResponse, ParticipanteUpdate

router = APIRouter(prefix="/participantes", tags=["Participantes"])


@router.get("/", response_model=List[ParticipanteResponse])
def listar_participantes():
    try:
        sql = "SELECT ci, nombre, apellido, email FROM participante"
        rows = query_all(sql)
        return rows
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{ci}", response_model=ParticipanteResponse)
def obtener_participante(ci: str):
    try:
        sql = "SELECT ci, nombre, apellido, email FROM participante WHERE ci = %s"
        row = query_one(sql, (ci,))
        if not row:
            raise HTTPException(status_code=404, detail="Participante no encontrado")
        return row
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=ParticipanteResponse, status_code=status.HTTP_201_CREATED)
def crear_participante(participante: ParticipanteCreate):
    try:
        sql = """
            INSERT INTO participante (ci, nombre, apellido, email)
            VALUES (%s, %s, %s, %s)
        """
        execute(sql, (participante.ci, participante.nombre, participante.apellido, participante.email))
        return participante
    except IntegrityError:
        raise HTTPException(status_code=409, detail="El participante con esa CI ya existe")
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{ci}", response_model=ParticipanteResponse)
def actualizar_participante(ci: str, datos: ParticipanteUpdate):
    try:
        # Verificar existencia
        check_sql = "SELECT ci FROM participante WHERE ci = %s"
        if not query_one(check_sql, (ci,)):
            raise HTTPException(status_code=404, detail="Participante no encontrado")

        campos = []
        valores = []
        if datos.nombre:
            campos.append("nombre = %s")
            valores.append(datos.nombre)
        if datos.apellido:
            campos.append("apellido = %s")
            valores.append(datos.apellido)
        if datos.email:
            campos.append("email = %s")
            valores.append(datos.email)

        if not campos:
            raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar")

        valores.append(ci)
        sql = f"UPDATE participante SET {', '.join(campos)} WHERE ci = %s"
        execute(sql, tuple(valores))

        # Retornar actualizado
        return query_one("SELECT ci, nombre, apellido, email FROM participante WHERE ci = %s", (ci,))

    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{ci}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_participante(ci: str):
    try:
        # Verificar existencia
        check_sql = "SELECT ci FROM participante WHERE ci = %s"
        if not query_one(check_sql, (ci,)):
            raise HTTPException(status_code=404, detail="Participante no encontrado")

        # Verificar dependencias (opcional, pero recomendado para evitar errores de FK)
        # Por ahora dejamos que la BD lance error si hay FKs
        
        sql = "DELETE FROM participante WHERE ci = %s"
        try:
            execute(sql, (ci,))
        except IntegrityError:
             raise HTTPException(status_code=409, detail="No se puede eliminar el participante porque tiene registros asociados (reservas, sanciones, etc.)")

    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
