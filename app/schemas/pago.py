from datetime import date
from pydantic import BaseModel


class PagoCreate(BaseModel):
    id_membresia: int
    concepto: str | None = None
    monto: float


class PagoResponse(BaseModel):
    id_pago: int
    id_membresia: int
    concepto: str | None = None
    monto: float
    fecha_pago: date
