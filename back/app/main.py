from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from app.db import DatabaseError
from app.reservas_logic import crear_reserva, BusinessRuleError
from app.schemas import ReservaCreate, ReservaResponse

load_dotenv()

from app.routers import participantes, salas, reservas, sanciones, reportes

app = FastAPI(title="Reservas Salas de Estudio UCU")

app.include_router(participantes.router)
app.include_router(salas.router)
app.include_router(reservas.router)
app.include_router(sanciones.router)
app.include_router(reportes.router)


@app.on_event("startup")
def startup_event():
    _ = conn()
    print("Conexión a MySQL OK")


@app.get("/")
async def root():
    return {"message": "API Salas de Estudio funcionando"}
