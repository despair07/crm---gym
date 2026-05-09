from datetime import date
from pydantic import BaseModel


class CampanaCreate(BaseModel):
    nombre: str
    descripcion: str | None = None
    fecha_inicio: date
    fecha_fin: date | None = None
    estado: str = "activa"


class CampanaResponse(BaseModel):
    id_campana: int
    nombre: str
    descripcion: str | None = None
    fecha_inicio: date
    fecha_fin: date | None = None
    estado: str


class CampanaAsignarUsuarios(BaseModel):
    ids_usuarios: list[int]
