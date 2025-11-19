from datetime import date
from typing import List

from pydantic import BaseModel, Field, conint


class ReservaCreate(BaseModel):
    fecha: date
    id_turno: conint(ge=1, le=15)
    nombre_sala: str = Field(min_length=1)
    edificio: str = Field(min_length=1)
    participantes_ci: List[str] = Field(
        min_length=1,
        description="Lista de CIs de participantes que usarán la sala",
    )


class ReservaResponse(BaseModel):
    id_reserva: int
    mensaje: str
