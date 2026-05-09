"""
Router de entrenamientos con protección JWT
"""
from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.entrenamiento import EntrenamientoCreate, EntrenamientoResponse, EntrenamientoUpdate
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/entrenamientos", tags=["Entrenamientos"])


@router.post("/", response_model=dict, status_code=201, summary="Crear entrenamiento")
def crear_entrenamiento(payload: EntrenamientoCreate, current_user: dict = Depends(get_current_user)):
    """Crear entrenamiento - Requiere estar autenticado"""
    try:
        row = crm_service.crear_entrenamiento(payload)
        return {"mensaje": "Entrenamiento creado", "id_entrenamiento": row["id_entrenamiento"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/usuario/{id_usuario}", response_model=List[EntrenamientoResponse], summary="Entrenamientos por usuario")
def listar_entrenamientos_usuario(id_usuario: int, current_user: dict = Depends(get_current_user)):
    """Listar entrenamientos de un usuario - Requiere estar autenticado"""
    try:
        return crm_service.listar_entrenamientos_usuario(id_usuario)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id_entrenamiento}", response_model=dict, summary="Actualizar entrenamiento")
def actualizar_entrenamiento(id_entrenamiento: int, payload: EntrenamientoUpdate, current_user: dict = Depends(get_current_user)):
    """Actualizar entrenamiento - Requiere estar autenticado"""
    try:
        current = crm_service.obtener_entrenamiento(id_entrenamiento)
        if not current:
            raise HTTPException(status_code=404, detail="Entrenamiento no encontrado")
        row = crm_service.actualizar_entrenamiento(id_entrenamiento, payload, current)
        return {"mensaje": "Entrenamiento actualizado"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id_entrenamiento}", response_model=dict, summary="Eliminar entrenamiento")
def eliminar_entrenamiento(id_entrenamiento: int, current_user: dict = Depends(get_current_user)):
    """Eliminar entrenamiento - Requiere estar autenticado"""
    try:
        row = crm_service.eliminar_entrenamiento(id_entrenamiento)
        return {"mensaje": "Entrenamiento eliminado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
