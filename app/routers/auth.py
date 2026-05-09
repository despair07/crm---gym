"""
Router de autenticación con login y registro
Maneja tokens JWT y validación de usuarios
"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import LoginRequest, RegisterRequest, LoginResponse
from app.services import crm_service
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.decorators import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Iniciar sesión con email y contraseña",
    status_code=200
)
def login(payload: LoginRequest):
    """
    Permite que un usuario inicie sesión con sus credenciales.
    Retorna un token JWT válido por 24 horas.
    
    Args:
        payload: Email y contraseña del usuario
        
    Returns:
        LoginResponse con token JWT y datos del usuario
        
    Raises:
        HTTPException 401: Si las credenciales son inválidas
    """
    try:
        # Buscar usuario por email en la base de datos
        users = crm_service.obtener_usuario_por_email(payload.email)
        
        if not users:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        user = users[0]
        
        # Verificar contraseña
        if not verify_password(payload.password, user.get("password")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        # Verificar que el usuario está activo
        if user.get("estado") != "activo":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tu cuenta ha sido desactivada"
            )
        
        # Crear token JWT
        token_data = {
            "id_usuario": user["id_usuario"],
            "email": user["email"],
            "nombre": user["nombre"],
            "rol": user["id_rol"]
        }
        access_token = create_access_token(data=token_data)
        
        return LoginResponse(
            mensaje="Login exitoso",
            id_usuario=user["id_usuario"],
            nombre=user["nombre"],
            email=user["email"],
            rol=user.get("rol_nombre", "usuario"),
            rol_id=user["id_rol"],
            access_token=access_token,
            token_type="bearer"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar login: {str(e)}"
        )


@router.post(
    "/register",
    response_model=dict,
    summary="Registrar nuevo usuario",
    status_code=201
)
def register(payload: RegisterRequest):
    """
    Registra un nuevo usuario en el sistema.
    Por defecto se registra como cliente (id_rol = 1).
    
    Args:
        payload: Datos del nuevo usuario
        
    Returns:
        Mensaje de confirmación con ID del usuario
        
    Raises:
        HTTPException 400: Si el email ya existe o hay datos inválidos
        HTTPException 500: Error en el servidor
    """
    try:
        # Verificar que el email no exista
        existing_users = crm_service.obtener_usuario_por_email(payload.email)
        if existing_users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado en el sistema"
            )
        
        # Hashear contraseña
        hashed_password = hash_password(payload.password)
        
        # Crear usuario con rol de cliente (id_rol = 3)
        row = crm_service.crear_usuario_completo(
            nombre=payload.nombre,
            email=payload.email,
            password=hashed_password,  # Guardamos la contraseña hasheada
            telefono=payload.telefono,
            fecha_nacimiento=payload.fecha_nacimiento,
            estado="activo",
            id_rol=3,  # Rol de cliente (3=Cliente)
            id_entrenador=None
        )
        
        if not row:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear el usuario"
            )
        
        return {
            "mensaje": "Usuario registrado exitosamente",
            "id_usuario": row["id_usuario"],
            "email": payload.email,
            "nombre": payload.nombre
        }
        
    except HTTPException:
        raise
    except Exception as e:
        if "Duplicate entry" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar usuario: {str(e)}"
        )


@router.get(
    "/me",
    response_model=dict,
    summary="Obtener datos del usuario actual",
    status_code=200
)
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Obtiene la información del usuario autenticado.
    Requiere token JWT válido en el header Authorization.
    
    Args:
        current_user: Usuario actual del token JWT
        
    Returns:
        Información del usuario autenticado
    """
    return {
        "id_usuario": current_user.get("id_usuario"),
        "email": current_user.get("email"),
        "nombre": current_user.get("nombre"),
        "rol_id": current_user.get("rol"),
        "mensaje": "Datos del usuario autenticado"
    }


@router.post(
    "/logout",
    response_model=dict,
    summary="Cerrar sesión",
    status_code=200
)
def logout(current_user: dict = Depends(get_current_user)):
    """
    Endpoint para cerrar sesión (principalmente para el frontend).
    Nota: El logout real se maneja en el frontend eliminando el token.
    
    Args:
        current_user: Usuario autenticado
        
    Returns:
        Mensaje de confirmación
    """
    return {
        "mensaje": "Sesión cerrada exitosamente",
        "status": "success"
    }
