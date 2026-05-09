"""
Router de campañas con protección JWT
CRUD completo: crear, listar, actualizar, eliminar + asignación de usuarios
"""
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.campana import CampanaAsignarUsuarios, CampanaCreate, CampanaResponse
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/campanas", tags=["Campanas"])


@router.get("/", response_model=List[CampanaResponse], summary="Listar campañas")
def listar_campanas(current_user: dict = Depends(get_current_user)):
    """Listar todas las campañas"""
    try:
        return crm_service.listar_campanas()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=dict, status_code=201, summary="Crear campaña")
def crear_campana(payload: CampanaCreate, current_user: dict = Depends(get_current_user)):
    """Crear campaña"""
    try:
        row = crm_service.crear_campana(payload)
        return {"mensaje": "Campaña creada", "id_campana": row["id_campana"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id_campana}", response_model=dict, summary="Actualizar campaña")
def actualizar_campana(id_campana: int, payload: CampanaCreate, current_user: dict = Depends(get_current_user)):
    """Actualizar nombre, descripción, fechas y estado de una campaña"""
    try:
        crm_service.actualizar_campana(id_campana, payload)
        return {"mensaje": "Campaña actualizada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id_campana}", response_model=dict, summary="Eliminar campaña")
def eliminar_campana(id_campana: int, current_user: dict = Depends(get_current_user)):
    """Eliminar una campaña permanentemente"""
    try:
        crm_service.eliminar_campana(id_campana)
        return {"mensaje": "Campaña eliminada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{id_campana}/asignar-usuarios", response_model=dict, summary="Asignar usuarios a campaña")
def asignar_usuarios(id_campana: int, payload: CampanaAsignarUsuarios, current_user: dict = Depends(get_current_user)):
    """Asignar una lista de usuarios a la campaña"""
    try:
        rows = crm_service.asignar_usuarios_campana(id_campana, payload.ids_usuarios)
        return {"mensaje": "Usuarios asignados", "total": len(rows)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id_campana}/usuarios", response_model=list[dict], summary="Listar usuarios de campaña")
def listar_usuarios_campana(id_campana: int, current_user: dict = Depends(get_current_user)):
    """Listar los usuarios asignados a una campaña"""
    try:
        return crm_service.listar_usuarios_campana(id_campana)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
