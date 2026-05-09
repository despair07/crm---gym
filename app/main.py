"""
Aplicación principal FastAPI con autenticación JWT
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import asistencia, auth, campanas, entrenamientos, membresias, pagos, seguimiento, usuarios, landing

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: specify origin e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROUTERS PÚBLICOS ====================
app.include_router(landing.router)  # Landing page - sin autenticación
app.include_router(auth.router)     # Login y registro - sin autenticación

# ==================== ROUTERS PROTEGIDOS ====================
# Estos requieren token JWT válido
app.include_router(usuarios.router)      # Gestión de usuarios
app.include_router(membresias.router)    # Gestión de membresías
app.include_router(pagos.router)         # Gestión de pagos
app.include_router(asistencia.router)    # Gestión de asistencia
app.include_router(entrenamientos.router) # Gestión de entrenamientos
app.include_router(campanas.router)      # Gestión de campañas
app.include_router(seguimiento.router)   # Gestión de seguimiento


# ==================== ENDPOINTS GENERALES ====================

@app.get("/", tags=["General"], summary="Raíz de la API")
def read_root():
    """Información general de la API"""
    return {
        "nombre": settings.APP_TITLE,
        "version": settings.APP_VERSION,
        "descripcion": settings.APP_DESCRIPTION,
        "documentacion": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "publicos": [
                "GET /api/v1/landing/ - Información del gym",
                "GET /api/v1/landing/planes - Planes disponibles",
                "GET /api/v1/landing/ejercicios - Ejercicios",
                "GET /api/v1/landing/clases - Clases grupales",
                "POST /api/v1/auth/login - Login",
                "POST /api/v1/auth/register - Registro"
            ],
            "protegidos": [
                "GET /api/v1/usuarios - Listar usuarios",
                "POST /api/v1/auth/me - Datos del usuario actual"
            ]
        }
    }


@app.get("/health", tags=["General"], summary="Estado de la API")
def health_check():
    """Verifica que la API está funcionando correctamente"""
    return {
        "status": "ok",
        "mensaje": "La API funciona correctamente",
        "version": settings.APP_VERSION
    }
