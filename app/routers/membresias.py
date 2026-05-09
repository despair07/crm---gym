"""
Router de membresías con protección JWT
"""
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.membresia import MembresiaCreate, MembresiaResponse
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/membresias", tags=["Membresias"])


@router.post("/", response_model=dict, status_code=201, summary="Crear membresía")
def crear_membresia(payload: MembresiaCreate, current_user: dict = Depends(get_current_user)):
    """Crear membresía - Requiere estar autenticado"""
    try:
        row = crm_service.crear_membresia(payload)
        return {"mensaje": "Membresía creada", "id_membresia": row["id_membresia"]}
    except Exception as e:
        msg = str(e)
        if "El usuario no existe" in msg or "El plan no existe" in msg:
            raise HTTPException(status_code=400, detail=msg)
        if "foreign key constraint fails" in msg:
            raise HTTPException(status_code=400, detail="id_usuario o id_plan no válido")
        raise HTTPException(status_code=500, detail=msg)


@router.get("/", response_model=List[MembresiaResponse], summary="Listar membresías")
def listar_membresias(estado: str | None = None, current_user: dict = Depends(get_current_user)):
    """Listar membresías - Requiere estar autenticado"""
    try:
        return crm_service.listar_membresias(estado)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id_membresia}/renovar", response_model=dict, summary="Renovar membresía")
def renovar_membresia(id_membresia: int, current_user: dict = Depends(get_current_user)):
    """Renovar membresía - Requiere estar autenticado"""
    try:
        row = crm_service.renovar_membresia(id_membresia)
        return {"mensaje": "Membresía renovada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id_membresia}/cancelar", response_model=dict, summary="Cancelar membresía")
def cancelar_membresia(id_membresia: int, current_user: dict = Depends(get_current_user)):
    """Cancelar membresía - Requiere estar autenticado"""
    try:
        row = crm_service.cancelar_membresia(id_membresia)
        return {"mensaje": "Membresía cancelada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
