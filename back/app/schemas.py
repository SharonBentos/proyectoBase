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


class ParticipanteBase(BaseModel):
    nombre: str = Field(min_length=1)
    apellido: str = Field(min_length=1)
    email: str = Field(min_length=1)


class ParticipanteCreate(ParticipanteBase):
    ci: str = Field(min_length=1)


class ParticipanteUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1)
    apellido: str | None = Field(default=None, min_length=1)
    email: str | None = Field(default=None, min_length=1)


class ParticipanteResponse(ParticipanteBase):
    ci: str


class SalaBase(BaseModel):
    capacidad: int = Field(gt=0)
    tipo_sala: str = Field(pattern="^(libre|posgrado|docente)$")


class SalaCreate(SalaBase):
    nombre_sala: str = Field(min_length=1)
    edificio: str = Field(min_length=1)


class SalaUpdate(BaseModel):
    capacidad: int | None = Field(default=None, gt=0)
    tipo_sala: str | None = Field(default=None, pattern="^(libre|posgrado|docente)$")


class SalaResponse(SalaBase):
    nombre_sala: str
    edificio: str


class SancionBase(BaseModel):
    ci_participante: str = Field(min_length=1)
    fecha_inicio: date
    fecha_fin: date


class SancionCreate(SancionBase):
    pass


class SancionResponse(SancionBase):
    id_sancion: int

