"""
Router para la página de inicio (landing page)
Información pública sobre el gym, planes y ejercicios
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/landing", tags=["Landing"])


@router.get("/", summary="Información principal del gym")
def get_landing_info():
    """
    Obtiene información pública del gym para la landing page
    No requiere autenticación
    """
    return {
        "nombre": "FitGym Pro",
        "descripcion": "Tu mejor aliado en fitness",
        "tagline": "Transforma tu cuerpo, transforma tu vida",
        "logo_url": "/images/logo.png",
        "email_contacto": "info@fitgym.com",
        "telefono": "+1 (555) 123-4567",
        "ubicacion": "Calle Principal 123, Ciudad",
        "horario": {
            "lunes_viernes": "06:00 - 22:00",
            "sabado": "08:00 - 20:00",
            "domingo": "09:00 - 18:00"
        }
    }


@router.get("/planes", summary="Listar planes de membresía disponibles")
def get_planes():
    """
    Obtiene todos los planes de membresía disponibles
    No requiere autenticación
    """
    return {
        "planes": [
            {
                "id": 1,
                "nombre": "Plan Básico",
                "descripcion": "Acceso a equipos básicos",
                "precio_mensual": 29.99,
                "duracion_dias": 30,
                "beneficios": [
                    "Acceso a equipos cardio",
                    "Pesas libres",
                    "Vestuarios",
                    "WiFi"
                ],
                "color": "#FFB800"
            },
            {
                "id": 2,
                "nombre": "Plan Premium",
                "descripcion": "Acceso completo con entrenador",
                "precio_mensual": 59.99,
                "duracion_dias": 30,
                "beneficios": [
                    "Acceso a todos los equipos",
                    "Clases grupales ilimitadas",
                    "Entrenador personal (1 sesión/mes)",
                    "Piscina",
                    "Vestuarios premium",
                    "WiFi y App móvil",
                    "Nutritionist consultation"
                ],
                "color": "#00D4FF",
                "popular": True
            },
            {
                "id": 3,
                "nombre": "Plan VIP",
                "descripcion": "Experiencia completa de fitness",
                "precio_mensual": 99.99,
                "duracion_dias": 30,
                "beneficios": [
                    "Acceso 24/7",
                    "Entrenador personal dedicado (4 sesiones/mes)",
                    "Planes de nutrición personalizados",
                    "Fisioterapeuta",
                    "Sauna y spa",
                    "Zona lounge premium",
                    "Priority booking en clases",
                    "Uniforme del gym"
                ],
                "color": "#FFD700"
            }
        ]
    }


@router.get("/ejercicios", summary="Listar ejercicios disponibles")
def get_ejercicios():
    """
    Obtiene información sobre ejercicios disponibles
    No requiere autenticación
    """
    return {
        "ejercicios": [
            {
                "id": 1,
                "nombre": "Sentadillas",
                "tipo": "Pesas",
                "grupo_muscular": "Piernas",
                "dificultad": "Principiante",
                "descripcion": "Ejercicio fundamental para trabajar piernas",
                "serie_recomendada": "3x10",
                "imagen_url": "/images/ejercicios/sentadillas.jpg"
            },
            {
                "id": 2,
                "nombre": "Press de banca",
                "tipo": "Pesas",
                "grupo_muscular": "Pecho",
                "dificultad": "Intermedio",
                "descripcion": "Excelente para desarrollar pecho",
                "serie_recomendada": "4x8",
                "imagen_url": "/images/ejercicios/press_banca.jpg"
            },
            {
                "id": 3,
                "nombre": "Corredor",
                "tipo": "Cardio",
                "grupo_muscular": "Cardiovascular",
                "dificultad": "Principiante",
                "descripcion": "Mejora resistencia cardiopulmonar",
                "serie_recomendada": "20-30 minutos",
                "imagen_url": "/images/ejercicios/corredor.jpg"
            },
            {
                "id": 4,
                "nombre": "Dominadas",
                "tipo": "Pesas",
                "grupo_muscular": "Espalda",
                "dificultad": "Avanzado",
                "descripcion": "Fortalece espalda y brazos",
                "serie_recomendada": "3x5",
                "imagen_url": "/images/ejercicios/dominadas.jpg"
            },
            {
                "id": 5,
                "nombre": "Flexiones",
                "tipo": "Peso corporal",
                "grupo_muscular": "Pecho",
                "dificultad": "Principiante",
                "descripcion": "Clásico ejercicio sin equipamiento",
                "serie_recomendada": "3x15",
                "imagen_url": "/images/ejercicios/flexiones.jpg"
            }
        ]
    }


@router.get("/clases", summary="Listar clases grupales disponibles")
def get_clases():
    """
    Obtiene información sobre clases grupales
    No requiere autenticación
    """
    return {
        "clases": [
            {
                "id": 1,
                "nombre": "Yoga",
                "instructor": "María López",
                "horarios": ["Lunes 09:00", "Miércoles 18:00", "Viernes 17:00"],
                "capacidad": 20,
                "duracion_minutos": 60,
                "nivel": "Todos los niveles",
                "descripcion": "Flexibilidad y relajación"
            },
            {
                "id": 2,
                "nombre": "Spinning",
                "instructor": "Carlos González",
                "horarios": ["Martes 07:00", "Jueves 19:00", "Sábado 10:00"],
                "capacidad": 30,
                "duracion_minutos": 45,
                "nivel": "Intermedio",
                "descripcion": "Entrenamiento cardio intenso en bicicleta"
            },
            {
                "id": 3,
                "nombre": "Zumba",
                "instructor": "Laura Martínez",
                "horarios": ["Lunes 18:00", "Miércoles 19:00", "Viernes 20:00"],
                "capacidad": 25,
                "duracion_minutos": 60,
                "nivel": "Todos los niveles",
                "descripcion": "Cardio divertido al ritmo de la música"
            },
            {
                "id": 4,
                "nombre": "Pilates",
                "instructor": "Paula Ruiz",
                "horarios": ["Martes 10:00", "Jueves 17:00", "Sábado 11:00"],
                "capacidad": 15,
                "duracion_minutos": 50,
                "nivel": "Principiante-Intermedio",
                "descripcion": "Fortalecimiento del core y postura"
            }
        ]
    }


@router.get("/testimonios", summary="Testimonios de clientes")
def get_testimonios():
    """
    Obtiene testimonios de clientes satisfechos
    No requiere autenticación
    """
    return {
        "testimonios": [
            {
                "id": 1,
                "cliente": "Juan Pérez",
                "calificacion": 5,
                "texto": "¡Excelente gym! Los entrenadores son muy profesionales y los equipos están en perfecto estado.",
                "fecha": "2026-04-15"
            },
            {
                "id": 2,
                "cliente": "Ana García",
                "calificacion": 5,
                "texto": "He mejorado mucho mi condición física. Las clases grupales son muy motivadoras.",
                "fecha": "2026-04-20"
            },
            {
                "id": 3,
                "cliente": "Roberto Silva",
                "calificacion": 4,
                "texto": "Muy buena experiencia. Solo mejoraría un poco la limpieza del vestuario.",
                "fecha": "2026-04-25"
            }
        ]
    }


@router.post("/contacto", summary="Enviar mensaje de contacto")
def send_contact_message(nombre: str, email: str, mensaje: str):
    """
    Recibe mensajes de contacto desde la landing page
    No requiere autenticación
    """
    return {
        "mensaje": "Tu mensaje ha sido recibido. Nos contactaremos pronto.",
        "status": "success"
    }
