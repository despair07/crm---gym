from datetime import date
from pydantic import BaseModel


class MembresiaCreate(BaseModel):
    id_usuario: int
    id_plan: int
    fecha_inicio: date


class MembresiaResponse(BaseModel):
    id_membresia: int
    id_usuario: int
    id_plan: int
    fecha_inicio: date
    fecha_fin: date
    estado: str
