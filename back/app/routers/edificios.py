from typing import List

from fastapi import APIRouter, HTTPException
from app.db import query_all, DatabaseError

router = APIRouter(prefix="/edificios", tags=["Edificios"])


@router.get("/", response_model=List[str])
def listar_edificios():
    try:
        sql = "SELECT nombre_edificio FROM edificio"
        rows = query_all(sql)
        return [row["nombre_edificio"] for row in rows]
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
