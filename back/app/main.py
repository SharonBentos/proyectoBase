from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.db import DatabaseError, get_connection
from app.reservas_logic import crear_reserva, BusinessRuleError
from app.schemas import ReservaCreate, ReservaResponse
from app.routers import login
from app.routers import participantes, salas, reservas, sanciones, metrics

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
app.include_router(metrics.router)
app.include_router(login.router)


@app.on_event("startup")
def startup_event():
    # Abro la conexión cuando empiezo la aplicación
    _ = get_connection()

@app.get("/")
async def root():
    return {"message": "API Salas de Estudio funcionando"}
