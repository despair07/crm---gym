from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import os
from datetime import timedelta

load_dotenv()


class Settings(BaseSettings):
    # Database configuration
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_NAME: str = os.getenv("DB_NAME", "gimnasio")
    DB_PORT: int = int(os.getenv("DB_PORT", 3306))

    # App configuration
    APP_TITLE: str = os.getenv("APP_TITLE", "Gym CRM API")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    APP_DESCRIPTION: str = os.getenv("APP_DESCRIPTION", "API CRM para gimnasio con autenticación JWT")

    # JWT configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "tu_clave_secreta_muy_segura_cambiar_en_produccion")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_HOURS: int = int(os.getenv("JWT_EXPIRATION_HOURS", 24))
    JWT_EXPIRATION_DELTA: timedelta = timedelta(hours=JWT_EXPIRATION_HOURS)

    # Roles disponibles (deben coincidir con la tabla 'roles' en la BD)
    ROLES: dict = {
        1: "administrador",
        2: "entrenador",
        3: "cliente"
    }


settings = Settings()
