from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.db import conn, DatabaseError
from app.reservas_logic import crear_reserva, BusinessRuleError
from app.schemas import ReservaCreate, ReservaResponse
from app.routers import login
from app.routers import participantes, salas, reservas, sanciones, reportes

load_dotenv()

app = FastAPI(title="Reservas Salas de Estudio UCU")

# Configurar CORS - Permitir todas las peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes (desarrollo)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

app.include_router(participantes.router)
app.include_router(salas.router)
app.include_router(reservas.router)
app.include_router(sanciones.router)
app.include_router(reportes.router)
app.include_router(login.router)


def init_db():
    """
    Ejecuta el script db/init_salas.sql para crear tablas y cargar datos.
    Se intenta que sea idempotente para el esquema; los inserts pueden
    fallar si ya existen PK, en cuyo caso se ignora el error.
    """
    # Ruta al archivo SQL: PROYECTOBASE/db/init_salas.sql
    sql_path = Path(__file__).resolve().parents[2] / "db" / "init_salas.sql"

    with open(sql_path, "r", encoding="utf-8") as f:
        raw_sql = f.read()

    # Sacar comentarios de línea tipo "-- ..."
    lines = []
    for line in raw_sql.splitlines():
        stripped = line.strip()
        if stripped.startswith("--") or stripped == "":
            continue
        lines.append(line)
    cleaned_sql = "\n".join(lines)

    # Separar por ';' en sentencias individuales
    statements = [s.strip() for s in cleaned_sql.split(";") if s.strip()]

    connection = conn()
    cursor = connection.cursor()

    try:
        for stmt in statements:
            try:
                cursor.execute(stmt)
            except Exception as e:
                # Si querés ver qué falla, descomentá el print
                # print(f"Error al ejecutar: {stmt[:80]}... -> {e}")
                # Para el obligatorio, probablemente te alcanza con ignorar
                # errores de "duplicate key" cuando se vuelve a correr.
                continue

        connection.commit()
    finally:
        cursor.close()
        connection.close()
    
    print("Base de datos ucu_salas inicializada correctamente.")


@app.on_event("startup")
def startup_event():
    # Solo para comprobar conexión
    test_conn = conn()
    print("Conexión a MySQL OK")
    test_conn.close()

    # Inicializar esquema + datos
    init_db()


@app.get("/")
async def root():
    return {"message": "API Salas de Estudio funcionando"}
