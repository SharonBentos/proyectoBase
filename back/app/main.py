from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from app.db import DatabaseError
from app.reservas_logic import crear_reserva, BusinessRuleError
from app.schemas import ReservaCreate, ReservaResponse

load_dotenv()

from app.db import conn

app = FastAPI(title="Reservas Salas de Estudio UCU")


@app.on_event("startup")
def startup_event():
    _ = conn()
    print("Conexión a MySQL OK")


@app.get("/")
async def root():
    return {"message": "API Salas de Estudio funcionando"}


@app.post("/reservas", response_model=ReservaResponse)
async def crear_reserva_endpoint(payload: ReservaCreate):
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

    except DatabaseError:
        raise HTTPException(
            status_code=500,
            detail="Error en la base de datos al crear la reserva.",
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error inesperado al crear la reserva.",
        )
