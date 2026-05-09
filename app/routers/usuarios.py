from typing import List

from fastapi import APIRouter, HTTPException, Depends

from app.schemas.usuario import UsuarioCreate, UsuarioResponse, UsuarioUpdate
from app.services import crm_service
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/usuarios", tags=["Usuarios"])


@router.post("/", response_model=dict, status_code=201, summary="Crear usuario")
def crear_usuario(payload: UsuarioCreate, current_user: dict = Depends(get_current_user)):
    """Crear usuario - Requiere estar autenticado"""
    try:
        row = crm_service.crear_usuario(payload)
        return {"mensaje": "Usuario creado", "id_usuario": row["id_usuario"]}
    except Exception as e:
        msg = str(e)
        if "Duplicate entry" in msg:
            raise HTTPException(status_code=400, detail="El email ya existe")
        if "foreign key constraint fails" in msg:
            raise HTTPException(status_code=400, detail="id_rol o id_entrenador no válido")
        raise HTTPException(status_code=500, detail=msg)


@router.get("/", response_model=List[UsuarioResponse], summary="Listar usuarios")
def listar_usuarios(id_rol: int | None = None, estado: str | None = None, current_user: dict = Depends(get_current_user)):
    """Listar usuarios - Requiere estar autenticado"""
    try:
        return crm_service.listar_usuarios(id_rol, estado)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id_usuario}", response_model=UsuarioResponse, summary="Obtener usuario por ID")
def obtener_usuario(id_usuario: int, current_user: dict = Depends(get_current_user)):
    """Obtener usuario - Requiere estar autenticado"""
    try:
        row = crm_service.obtener_usuario(id_usuario)
        if not row:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return row
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id_usuario}", response_model=dict, summary="Actualizar usuario")
def actualizar_usuario(id_usuario: int, payload: UsuarioUpdate, current_user: dict = Depends(get_current_user)):
    """Actualizar usuario - Requiere estar autenticado"""
    try:
        current = crm_service.obtener_usuario(id_usuario)
        if not current:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        row = crm_service.actualizar_usuario(id_usuario, payload, current)
        return {"mensaje": "Usuario actualizado", "filas": row.get("filas_actualizadas", 0) if row else 0}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id_usuario}", response_model=dict, summary="Eliminar usuario")
def eliminar_usuario(id_usuario: int, current_user: dict = Depends(get_current_user)):
    """Eliminar usuario - Requiere estar autenticado"""
    try:
        current = crm_service.obtener_usuario(id_usuario)
        if not current:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        row = crm_service.eliminar_usuario(id_usuario)
        return {"mensaje": "Usuario eliminado", "filas": row.get("filas_eliminadas", 0) if row else 0}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
