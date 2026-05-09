"""
Decoradores para autenticación y autorización basada en roles
"""
from functools import wraps
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import verify_token
from typing import List, Optional

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Obtiene el usuario actual del token JWT
    
    Args:
        credentials: Credenciales HTTP del header Authorization
        
    Returns:
        Datos del usuario si el token es válido
        
    Raises:
        HTTPException: Si el token es inválido o ha expirado
    """
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload


def require_role(*allowed_roles: int):
    """
    Decorador para verificar que el usuario tiene uno de los roles permitidos
    
    Args:
        allowed_roles: IDs de roles permitidos
        
    Returns:
        Función decoradora
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: dict = Depends(get_current_user), **kwargs):
            user_role = current_user.get("rol")
            
            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"No tienes permiso para acceder a este recurso"
                )
            
            return await func(*args, current_user=current_user, **kwargs)
        
        return wrapper
    return decorator


def require_roles_sync(*allowed_roles: int):
    """
    Versión síncrona del decorador require_role para endpoints síncronos
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, current_user: dict = Depends(get_current_user), **kwargs):
            user_role = current_user.get("rol")
            
            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"No tienes permiso para acceder a este recurso"
                )
            
            return func(*args, current_user=current_user, **kwargs)
        
        return wrapper
    return decorator
