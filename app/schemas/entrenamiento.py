from datetime import date
from pydantic import BaseModel


class EntrenamientoCreate(BaseModel):
    id_usuario: int
    id_entrenador: int | None = None
    tipo_entrenamiento: str
    duracion_minutos: int | None = None
    observaciones: str | None = None
    fecha: date


class EntrenamientoUpdate(BaseModel):
    id_entrenador: int | None = None
    tipo_entrenamiento: str | None = None
    duracion_minutos: int | None = None
    observaciones: str | None = None
    fecha: date | None = None


class EntrenamientoResponse(BaseModel):
    id_entrenamiento: int
    id_usuario: int
    id_entrenador: int | None = None
    tipo_entrenamiento: str
    duracion_minutos: int | None = None
    observaciones: str | None = None
    fecha: date
