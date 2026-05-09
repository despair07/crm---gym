# Gym CRM API (FastAPI + MySQL)

Proyecto CRM para gimnasio usando arquitectura en capas, procedimientos almacenados y triggers sobre la base de datos `gimnasio`.

## Requisitos

- Python 3.9+
- MySQL Server
- Base de datos `gimnasio` creada con tus tablas

## Configuración

1. Crear entorno virtual:

```bash
python -m venv venv
```

2. Activar entorno (Windows):

```bash
venv\Scripts\activate
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```

4. Crear `.env` desde `.env.example` y completar contraseña.

## SQL requerido

Ejecuta en MySQL, en este orden:

1. `sql/schema.sql` - Crear todas las tablas
2. `sql/procedures.sql` - Crear procedimientos almacenados
3. `sql/triggers.sql` - Crear triggers de base de datos
4. `sql/seed_data.sql` - Datos de prueba/ejemplo (OPCIONAL)

## Ejecutar API

```bash
python -m uvicorn app.main:app --reload
```

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Endpoints principales

- `POST /api/v1/auth/login`
- `GET|POST|PUT|DELETE /api/v1/usuarios`
- `GET|POST|PUT /api/v1/membresias`
- `GET|POST /api/v1/pagos`
- `GET|POST /api/v1/asistencia`
- `GET|POST|PUT|DELETE /api/v1/entrenamientos`
- `GET|POST /api/v1/campanas`
- `POST /api/v1/campanas/{id}/asignar-usuarios`
- `GET|POST /api/v1/seguimiento`

## Arquitectura

- `app/routers`: capa API REST
- `app/services`: lógica de negocio
- `app/repositories`: acceso a datos (SP)
- `app/schemas`: validación y contratos Pydantic
- `sql/`: procedimientos y triggers
