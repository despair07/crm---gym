"""
Router de asistencia con protección JWT
"""
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.asistencia import AsistenciaCreate, AsistenciaResponse
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/asistencia", tags=["Asistencia"])


@router.get("/", response_model=List[AsistenciaResponse], summary="Listar todos los registros de asistencia")
def listar_asistencia(current_user: dict = Depends(get_current_user)):
    """Listar todos los registros de asistencia - Requiere autenticación"""
    try:
        return crm_service.listar_asistencia_todos()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=dict, status_code=201, summary="Registrar asistencia")
def registrar_asistencia(payload: AsistenciaCreate, current_user: dict = Depends(get_current_user)):
    """Registrar asistencia - Requiere estar autenticado"""
    try:
        row = crm_service.registrar_asistencia(payload)
        return {"mensaje": "Asistencia registrada", "id_asistencia": row["id_asistencia"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/usuario/{id_usuario}", response_model=List[AsistenciaResponse], summary="Asistencia por usuario")
def listar_asistencia_usuario(id_usuario: int, current_user: dict = Depends(get_current_user)):
    """Listar asistencia de un usuario - Requiere estar autenticado"""
    try:
        return crm_service.listar_asistencia_usuario(id_usuario)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
