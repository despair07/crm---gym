"""
Esquemas Pydantic para autenticación
"""
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Datos requeridos para hacer login"""
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=6, description="Contraseña")


class RegisterRequest(BaseModel):
    """Datos requeridos para registrarse"""
    nombre: str = Field(..., min_length=3, description="Nombre del usuario")
    email: EmailStr = Field(..., description="Email único")
    password: str = Field(..., min_length=6, description="Contraseña (mínimo 6 caracteres)")
    telefono: str | None = None
    fecha_nacimiento: str | None = Field(None, description="Formato: YYYY-MM-DD")


class LoginResponse(BaseModel):
    """Respuesta al hacer login"""
    mensaje: str
    id_usuario: int | None = None
    nombre: str | None = None
    email: str | None = None
    rol: str | None = None
    rol_id: int | None = None
    access_token: str | None = None
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Datos del token JWT"""
    id_usuario: int
    email: str
    nombre: str
    rol: int  # ID del rol


class CurrentUser(BaseModel):
    """Información del usuario actual"""
    id_usuario: int
    email: str
    nombre: str
    rol: int
    estado: str
