from fastapi import APIRouter, HTTPException
from app.db import query_one, DatabaseError
from app.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/", response_model=LoginResponse)
def login(data: LoginRequest):
    try:
        sql = "SELECT correo, es_administrador FROM login WHERE correo = %s AND password = %s"
        row = query_one(sql, (data.correo, data.password))
        
        if not row:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        return {"correo": row["correo"], "es_administrador": bool(row["es_administrador"])}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))