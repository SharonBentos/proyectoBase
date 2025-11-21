from typing import List, Optional

from fastapi import APIRouter, HTTPException, status, Query
from pymysql.err import IntegrityError

from app.db import query_all, query_one, execute, DatabaseError
from app.schemas import SalaCreate, SalaResponse, SalaUpdate

router = APIRouter(prefix="/salas", tags=["Salas"])


@router.get("/", response_model=List[SalaResponse])
def listar_salas(
    edificio: Optional[str] = Query(None, description="Filtrar por edificio"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo de sala"),
    min_capacidad: Optional[int] = Query(None, description="Capacidad mínima"),
):
    try:
        sql = "SELECT nombre_sala, edificio, capacidad, tipo_sala FROM sala WHERE 1=1"
        params = []

        if edificio:
            sql += " AND edificio = %s"
            params.append(edificio)
        if tipo:
            sql += " AND tipo_sala = %s"
            params.append(tipo)
        if min_capacidad:
            sql += " AND capacidad >= %s"
            params.append(min_capacidad)

        rows = query_all(sql, tuple(params))
        return rows
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{nombre}/{edificio}", response_model=SalaResponse)
def obtener_sala(nombre: str, edificio: str):
    try:
        sql = """
            SELECT nombre_sala, edificio, capacidad, tipo_sala
            FROM sala
            WHERE nombre_sala = %s AND edificio = %s
        """
        row = query_one(sql, (nombre, edificio))
        if not row:
            raise HTTPException(status_code=404, detail="Sala no encontrada")
        return row
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=SalaResponse, status_code=status.HTTP_201_CREATED)
def crear_sala(sala: SalaCreate):
    try:
        # Verificar que el edificio existe
        check_edificio = "SELECT 1 FROM edificio WHERE nombre_edificio = %s"
        if not query_one(check_edificio, (sala.edificio,)):
             raise HTTPException(status_code=400, detail=f"El edificio '{sala.edificio}' no existe")

        sql = """
            INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala)
            VALUES (%s, %s, %s, %s)
        """
        execute(sql, (sala.nombre_sala, sala.edificio, sala.capacidad, sala.tipo_sala))
        return sala
    except IntegrityError:
        raise HTTPException(status_code=409, detail="La sala ya existe en ese edificio")
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{nombre}/{edificio}", response_model=SalaResponse)
def actualizar_sala(nombre: str, edificio: str, datos: SalaUpdate):
    try:
        # Verificar existencia
        check_sql = "SELECT nombre_sala FROM sala WHERE nombre_sala = %s AND edificio = %s"
        if not query_one(check_sql, (nombre, edificio)):
            raise HTTPException(status_code=404, detail="Sala no encontrada")

        campos = []
        valores = []
        if datos.capacidad:
            campos.append("capacidad = %s")
            valores.append(datos.capacidad)
        if datos.tipo_sala:
            campos.append("tipo_sala = %s")
            valores.append(datos.tipo_sala)

        if not campos:
            raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar")

        valores.append(nombre)
        valores.append(edificio)
        
        sql = f"UPDATE sala SET {', '.join(campos)} WHERE nombre_sala = %s AND edificio = %s"
        execute(sql, tuple(valores))

        return query_one(
            "SELECT nombre_sala, edificio, capacidad, tipo_sala FROM sala WHERE nombre_sala = %s AND edificio = %s",
            (nombre, edificio)
        )

    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{nombre}/{edificio}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_sala(nombre: str, edificio: str):
    try:
        # Verificar existencia
        check_sql = "SELECT nombre_sala FROM sala WHERE nombre_sala = %s AND edificio = %s"
        if not query_one(check_sql, (nombre, edificio)):
            raise HTTPException(status_code=404, detail="Sala no encontrada")

        sql = "DELETE FROM sala WHERE nombre_sala = %s AND edificio = %s"
        try:
            execute(sql, (nombre, edificio))
        except IntegrityError:
             raise HTTPException(status_code=409, detail="No se puede eliminar la sala porque tiene reservas asociadas")

    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
