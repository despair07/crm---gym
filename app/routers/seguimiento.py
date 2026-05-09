"""
Router de seguimiento con protección JWT
"""
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.seguimiento import SeguimientoCreate, SeguimientoResponse
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/seguimiento", tags=["Seguimiento"])


@router.post("/", response_model=dict, status_code=201, summary="Crear seguimiento")
def crear_seguimiento(payload: SeguimientoCreate, current_user: dict = Depends(get_current_user)):
    """Crear seguimiento - Requiere estar autenticado"""
    try:
        row = crm_service.crear_seguimiento(payload)
        return {"mensaje": "Seguimiento creado", "id_seguimiento": row["id_seguimiento"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/usuario/{id_usuario}", response_model=List[SeguimientoResponse], summary="Seguimientos por usuario")
def listar_seguimiento_usuario(id_usuario: int, current_user: dict = Depends(get_current_user)):
    """Listar seguimiento de un usuario - Requiere estar autenticado"""
    try:
        return crm_service.listar_seguimiento_usuario(id_usuario)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
