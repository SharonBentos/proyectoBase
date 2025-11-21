from fastapi import APIRouter, HTTPException
from app.db import query_one, DatabaseError
from app.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/", response_model=LoginResponse)
def login(data: LoginRequest):
    try:
        # Primero verificar credenciales en tabla login
        sql_login = "SELECT correo, es_administrador FROM login WHERE correo = %s AND password = %s"
        row_login = query_one(sql_login, (data.correo, data.password))
        
        if not row_login:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        # Obtener datos adicionales del participante
        sql_participante = """
            SELECT p.ci, p.nombre, p.apellido, p.email,
                   ppa.rol, pa.tipo
            FROM participante p
            LEFT JOIN participante_programa_academico ppa ON p.ci = ppa.ci_participante
            LEFT JOIN programa_academico pa ON ppa.nombre_programa = pa.nombre_programa
            WHERE p.email = %s
            LIMIT 1
        """
        row_participante = query_one(sql_participante, (data.correo,))
        
        if not row_participante:
            # Si no existe en participante, crear respuesta básica solo con login
            return {
                "correo": row_login["correo"],
                "es_administrador": bool(row_login["es_administrador"]),
                "ci": "000",
                "nombre": "Usuario",
                "apellido": "Sistema",
                "rol": "alumno",
                "tipo_programa": "grado"
            }
        
        return {
            "correo": row_login["correo"],
            "es_administrador": bool(row_login["es_administrador"]),
            "ci": row_participante["ci"],
            "nombre": row_participante["nombre"],
            "apellido": row_participante["apellido"],
            "rol": row_participante.get("rol", "alumno"),
            "tipo_programa": row_participante.get("tipo", "grado")
        }
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))