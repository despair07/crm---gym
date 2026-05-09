import mysql.connector
from mysql.connector import Error
from app.config import settings


def get_db_connection():
    try:
        return mysql.connector.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME,
            port=settings.DB_PORT,
        )
    except Error as e:
        raise RuntimeError(f"Error de conexi?n a MySQL: {e}") from e


def execute_sp(procedure_name: str, args: list | None = None):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.callproc(procedure_name, args or [])

        results = []
        for result in cursor.stored_results():
            results.extend(result.fetchall())

        connection.commit()
        return results
    except Error as e:
        raise RuntimeError(f"Error ejecutando {procedure_name}: {e}") from e
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
