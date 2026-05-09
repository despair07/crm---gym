from datetime import date
from pydantic import BaseModel, EmailStr, Field


class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    telefono: str | None = None
    fecha_nacimiento: date | None = None
    estado: str = "activo"
    id_rol: int = Field(..., ge=1)
    id_entrenador: int | None = Field(default=None, ge=1)


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    telefono: str | None = None
    fecha_nacimiento: date | None = None
    estado: str | None = None
    id_rol: int | None = Field(default=None, ge=1)
    id_entrenador: int | None = Field(default=None, ge=1)


class UsuarioResponse(UsuarioBase):
    id_usuario: int
    id_entrenador: int | None = None
