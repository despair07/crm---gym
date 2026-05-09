"""
Router de pagos con protección JWT
"""
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.pago import PagoCreate, PagoResponse
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/pagos", tags=["Pagos"])


@router.post("/", response_model=dict, status_code=201, summary="Registrar pago")
def registrar_pago(payload: PagoCreate, current_user: dict = Depends(get_current_user)):
    """Registrar pago - Requiere estar autenticado"""
    try:
        row = crm_service.registrar_pago(payload)
        return {"mensaje": "Pago registrado", "id_pago": row["id_pago"]}
    except Exception as e:
        msg = str(e)
        if "La membresia no existe" in msg or "El monto debe ser mayor a 0" in msg:
            raise HTTPException(status_code=400, detail=msg)
        if "foreign key constraint fails" in msg:
            raise HTTPException(status_code=400, detail="id_membresia no válido")
        raise HTTPException(status_code=500, detail=msg)


@router.get("/", response_model=List[PagoResponse], summary="Listar pagos")
def listar_pagos(id_membresia: int | None = None, current_user: dict = Depends(get_current_user)):
    """Listar pagos - Requiere estar autenticado. Sin id_membresia lista todos."""
    try:
        if id_membresia is None:
            return crm_service.listar_todos_pagos()
        return crm_service.listar_pagos(id_membresia)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
