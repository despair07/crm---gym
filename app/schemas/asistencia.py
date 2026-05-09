from datetime import datetime
from pydantic import BaseModel


class AsistenciaCreate(BaseModel):
    id_usuario: int
    tipo_registro: str = "entrada"


class AsistenciaResponse(BaseModel):
    id_asistencia: int
    id_usuario: int
    fecha_hora: datetime
    tipo_registro: str
