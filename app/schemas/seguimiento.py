from datetime import datetime
from pydantic import BaseModel


class SeguimientoCreate(BaseModel):
    id_usuario: int
    id_registrado_por: int | None = None
    comentario: str | None = None
    tipo: str


class SeguimientoResponse(BaseModel):
    id_seguimiento: int
    id_usuario: int
    id_registrado_por: int | None = None
    fecha: datetime
    comentario: str | None = None
    tipo: str
