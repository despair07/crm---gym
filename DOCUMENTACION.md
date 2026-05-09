# Documentación Técnica - Gym Popayán CRM v2.0
## Sistema de Gestión Integral · Popayán, Cauca, Colombia

---

## 1. VISIÓN GENERAL

El CRM del Gym Popayán es una aplicación web full-stack que gestiona: membresías, pagos en COP, asistencia, entrenamientos, campañas de marketing y seguimiento de clientes. Está diseñado para el contexto colombiano (moneda COP, teléfonos locales, zona horaria UTC-5).

- **Backend:** API REST Python/FastAPI → MySQL via Stored Procedures
- **Frontend:** React SPA que adapta su contenido según el rol del usuario

---

## 2. TECNOLOGÍAS

### Backend (Python)
- **FastAPI** — Framework web asíncrono. Documentación Swagger automática en `/docs`
- **Uvicorn** — Servidor ASGI para ejecutar FastAPI (`--reload` en desarrollo)
- **mysql-connector-python** — Comunicación directa con MySQL usando `cursor.callproc()`
- **python-jose[cryptography]** — Generación y verificación de tokens JWT
- **passlib[bcrypt]** — Hasheo seguro de contraseñas (bcrypt factor 12)
- **pydantic / pydantic-settings** — Validación de datos y lectura del `.env`
- **python-dotenv** — Variables de entorno

### Frontend (TypeScript)
- **React 19** — Librería de interfaces con componentes funcionales y hooks
- **TypeScript** — Tipado estático en todos los archivos `.tsx` / `.ts`
- **Vite 8** — Bundler y servidor de desarrollo con HMR
- **React Router DOM v7** — Enrutamiento client-side con rutas protegidas
- **Axios** — Cliente HTTP con interceptores para JWT automático
- **Tailwind CSS v4** — Utilidades CSS con tokens de diseño via `@theme`
- **Inter (Google Fonts)** — Tipografía del sistema

### Base de datos
- **MySQL 8+** — Toda la lógica de negocio en Stored Procedures. Nunca SQL dinámico en Python.

---

## 3. ESTRUCTURA DE ARCHIVOS

```
crm gym/
├── .env                        ← DB_PASSWORD, JWT_SECRET_KEY, etc.
├── .venv/                      ← Entorno virtual Python
├── app/
│   ├── main.py                 ← Registra routers, configura CORS
│   ├── config.py               ← Settings con pydantic-settings
│   ├── database.py             ← Conexión MySQL + execute_sp()
│   ├── routers/
│   │   ├── auth.py             ← Login, registro, /me
│   │   ├── usuarios.py         ← CRUD usuarios
│   │   ├── membresias.py       ← Crear, listar, renovar, cancelar
│   │   ├── pagos.py            ← Registrar y listar pagos
│   │   ├── asistencia.py       ← Registrar entrada/salida, listar todos o por usuario
│   │   ├── entrenamientos.py   ← CRUD entrenamientos
│   │   ├── campanas.py         ← CRUD completo + asignación de usuarios
│   │   ├── seguimiento.py      ← Historial de interacciones
│   │   └── landing.py          ← Endpoints públicos (planes, clases, ejercicios)
│   ├── services/crm_service.py ← Capa de orquestación (llama al repositorio)
│   ├── repositories/crm_repository.py ← Única capa que habla con MySQL
│   ├── schemas/                ← Modelos Pydantic request/response
│   └── utils/decorators.py     ← get_current_user (verifica JWT)
├── frontend/
│   ├── .env                    ← VITE_API_BASE_URL=http://127.0.0.1:8000
│   └── src/
│       ├── context/AuthContext.tsx   ← Estado global: usuario, rol, isAdmin, etc.
│       ├── components/
│       │   ├── ProtectedRoute.tsx    ← Verifica auth + roles antes de renderizar
│       │   └── layout/
│       │       ├── Layout.tsx        ← Shell (Header + Sidebar + contenido)
│       │       ├── Header.tsx        ← Barra superior con nombre de usuario
│       │       └── Sidebar.tsx       ← Navegación filtrada por rol
│       ├── pages/
│       │   ├── Landing.tsx     ← Página pública: Gym Popayán, planes COP, clases
│       │   ├── Login.tsx       ← Login con branding Popayán, mostrar/ocultar pass
│       │   ├── Register.tsx    ← Registro público
│       │   ├── Dashboard.tsx   ← Diferente contenido según rol
│       │   ├── Usuarios.tsx    ← CRUD usuarios (Admin)
│       │   ├── Membresias.tsx  ← Gestión de membresías (Admin)
│       │   ├── Pagos.tsx       ← Lista con búsqueda, totalizador, stats (Admin)
│       │   ├── Asistencia.tsx  ← Lista completa + filtro por usuario
│       │   ├── Entrenamientos.tsx ← Selector de cliente → historial de sesiones
│       │   ├── Campanas.tsx    ← CRUD completo con editar/eliminar (Admin)
│       │   ├── Seguimiento.tsx ← Selector de cliente → historial de interacciones
│       │   └── Perfil.tsx      ← Perfil personal para todos los roles
│       ├── services/           ← Una función por módulo, llaman a la API
│       │   ├── api.ts          ← Instancia Axios con interceptores de JWT
│       │   └── *.ts            ← authService, usuarioService, pagoService, etc.
│       ├── types/api.ts        ← Interfaces TypeScript de todos los modelos
│       └── utils/format.ts     ← formatCOP, formatTelCO, formatFecha, formatFechaHora
└── sql/
    ├── schema.sql              ← Tablas y relaciones
    ├── procedures.sql          ← Todos los Stored Procedures
    ├── triggers.sql            ← Triggers automáticos
    ├── seed_data.sql           ← Datos de ejemplo (contraseña: 123456)
    └── update_sps.sql          ← Script de actualización v2 (ejecutar 1 vez)
```

---

## 4. FLUJO DE AUTENTICACIÓN

1. Usuario ingresa email y contraseña en `/login`
2. Frontend llama `POST /api/v1/auth/login`
3. Backend busca el usuario en MySQL con `sp_obtener_usuario_por_email`
4. `passlib` verifica la contraseña contra el hash bcrypt almacenado
5. Si es válida, `python-jose` genera un JWT (expira en 24h) con: `id_usuario`, `email`, `rol_id`
6. El token se guarda en `localStorage` como `access_token`
7. Los datos del usuario se guardan en `localStorage` como `user`
8. `AuthContext` se actualiza → el componente `ProtectedRoute` permite el acceso

**Peticiones protegidas:** El interceptor de request de Axios lee el token de `localStorage` y lo añade como `Authorization: Bearer <token>`. Si el backend responde `401`, el interceptor de response limpia `localStorage` y redirige a `/login`.

---

## 5. ARQUITECTURA DE 3 CAPAS (BACKEND)

```
HTTP Request
    ↓
Router (app/routers/*.py)
  - Valida JWT con Depends(get_current_user)
  - Valida body con schema Pydantic
    ↓
Service (app/services/crm_service.py)
  - Orquesta lógica de negocio
  - Combina datos de múltiples calls si es necesario
    ↓
Repository (app/repositories/crm_repository.py)
  - Única capa que toca MySQL
  - Llama a execute_sp(nombre_sp, [params])
    ↓
MySQL Stored Procedure
  - Ejecuta la query
  - Retorna resultados como diccionarios
```

---

## 6. BASE DE DATOS

### Tablas principales
- **roles** — 1=Administrador, 2=Entrenador, 3=Cliente
- **usuarios** — Todos los usuarios. `id_entrenador` referencia al entrenador asignado
- **planes** — Planes con precio (COP), nombre y `duracion_dias`
- **membresias** — Vincula usuario + plan. Estados: activa/vencida/cancelada
- **pagos** — Cada pago vinculado a una membresía. Monto en COP
- **asistencia** — Log de entradas/salidas con `fecha_hora` exacta
- **entrenamientos** — Sesiones: tipo, duración, entrenador, observaciones
- **campanas** — Campañas de marketing. Estados: activa/pausada/finalizada
- **usuario_campana** — Relación N:N entre usuarios y campañas
- **seguimiento_cliente** — Log de interacciones: nota, llamada, visita, evaluación, alerta

### Stored Procedures clave
- `sp_listar_usuarios(id_rol, estado)` — Acepta NULL para traer todos
- `sp_listar_pagos(id_membresia)` — NULL = todos los pagos del sistema
- `sp_listar_asistencia_usuario(id_usuario)` — NULL = toda la asistencia
- `sp_crear_membresia` — Calcula `fecha_fin` automáticamente
- `sp_renovar_membresia` — Extiende desde hoy si venció, o desde `fecha_fin` si sigue activa
- `sp_actualizar_campana` — Edita nombre, descripción, fechas y estado
- `sp_eliminar_campana` — Borra la campaña y sus asignaciones de `usuario_campana`
- `sp_dashboard_stats` — Un solo SP retorna todos los KPIs del dashboard admin

---

## 7. SISTEMA DE ROLES Y PERMISOS

### Roles
- **1 = Administrador** — Acceso total: usuarios, membresías, pagos, asistencia, entrenamientos, campañas, seguimiento
- **2 = Entrenador** — Ve sus clientes asignados (filtro `id_entrenador = su ID`). Módulos: Entrenamientos, Asistencia, Seguimiento, Perfil
- **3 = Cliente** — Solo su Dashboard personal y su Perfil (membresía, entrenamientos propios)

### Aplicación en Frontend
- `ProtectedRoute.tsx` — Si el usuario no tiene el rol correcto, redirige a `/dashboard`
- `Sidebar.tsx` — Cada ítem tiene `roles: number[]`. Se filtra antes de renderizar
- `Dashboard.tsx` — Renderiza `AdminDashboard`, `EntrenadorDashboard` o `ClienteDashboard`
- `Entrenamientos.tsx` / `Seguimiento.tsx` — Entrenador solo ve clientes con `id_entrenador === user.id_usuario`
- `Campanas.tsx` — Los botones Editar/Eliminar solo aparecen para Admin

---

## 8. FORMATEO COLOMBIANO (src/utils/format.ts)

- `formatCOP(valor)` — `Intl.NumberFormat('es-CO', { currency: 'COP' })` → `$ 150.000`
- `formatTelCO(tel)` — 10 dígitos → `300 123 4567`
- `formatFecha(fecha)` — ISO → `dd/mm/aaaa` en locale `es-CO`
- `formatFechaHora(fechaHora)` — Incluye hora en formato 12h colombiano

---

## 9. MÓDULOS DEL SISTEMA

### Landing (pública)
Página de entrada del Gym Popayán. Datos dinámicos desde el backend: planes con precio en COP, ejercicios, clases grupales con horarios, testimonios. Contacto con dirección de Popayán, teléfono colombiano y NIT.

### Login
Branding Gym Popayán con ubicación (Popayán, Cauca), zona horaria UTC-5, moneda COP. Botón ver/ocultar contraseña. Acceso rápido demo (admin, entrenador, cliente).

### Dashboard
- **Admin:** Stats globales (usuarios activos, membresías, ingresos en COP, asistencia hoy), acciones rápidas, tablas de últimas actividades
- **Entrenador:** Accesos rápidos, lista de sus clientes asignados
- **Cliente:** Estado de membresía activa, entrenamientos recientes, estadísticas personales

### Usuarios (Admin)
CRUD completo. Tabla con búsqueda, filtros por rol/estado, teléfonos en formato colombiano, asignación de entrenador.

### Membresías (Admin)
Lista con estado, fechas, precio en COP. Acciones: renovar, cancelar.

### Pagos (Admin)
Lista completa con búsqueda por nombre/concepto, totalizador de ingresos en COP, stats de pagos del día.

### Asistencia
Carga todos los registros al abrir. Filtro opcional por ID de usuario. Stats de entradas vs salidas. Registro con selección visual de tipo (entrada/salida).

### Entrenamientos
Admin → selector de todos los clientes. Entrenador → selector de sus clientes. Cliente → ve directamente los suyos. Muestra nombre del entrenador en la tabla.

### Campañas (Admin - CRUD completo)
Tarjetas con estado visual. Filtro por estado (activa/pausada/finalizada). Editar en modal reutilizable. Eliminar con confirmación (borra también asignaciones).

### Seguimiento
Selector de clientes por nombre (igual que Entrenamientos). Historial con iconos por tipo. Registra automáticamente quién hace el seguimiento (el usuario autenticado).

### Perfil (todos los roles)
- Todos: nombre, email, teléfono colombiano, fecha de nacimiento, estado, entrenador asignado (con nombre)
- Cliente además: membresía activa con precio COP, entrenamientos recientes, historial de membresías

---

## 10. ENDPOINTS API COMPLETOS

Todos requieren `Authorization: Bearer <token>` excepto los marcados como públicos.

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/v1/auth/login | Login (público) |
| POST | /api/v1/auth/register | Registro (público) |
| GET | /api/v1/auth/me | Datos del usuario autenticado |
| GET | /api/v1/usuarios/ | Listar usuarios (filtros: id_rol, estado) |
| POST | /api/v1/usuarios | Crear usuario |
| GET | /api/v1/usuarios/{id} | Obtener usuario por ID |
| PUT | /api/v1/usuarios/{id} | Actualizar usuario |
| DELETE | /api/v1/usuarios/{id} | Desactivar usuario (soft delete) |
| GET | /api/v1/membresias/ | Listar membresías (filtro: estado) |
| POST | /api/v1/membresias | Crear membresía |
| PUT | /api/v1/membresias/{id}/renovar | Renovar membresía |
| PUT | /api/v1/membresias/{id}/cancelar | Cancelar membresía |
| GET | /api/v1/pagos/ | Listar todos los pagos |
| POST | /api/v1/pagos | Registrar pago |
| GET | /api/v1/asistencia/ | Listar toda la asistencia |
| GET | /api/v1/asistencia/usuario/{id} | Asistencia de un usuario |
| POST | /api/v1/asistencia | Registrar entrada o salida |
| GET | /api/v1/entrenamientos/usuario/{id} | Entrenamientos de un usuario |
| POST | /api/v1/entrenamientos | Crear entrenamiento |
| PUT | /api/v1/entrenamientos/{id} | Actualizar entrenamiento |
| DELETE | /api/v1/entrenamientos/{id} | Eliminar entrenamiento |
| GET | /api/v1/campanas/ | Listar campañas |
| POST | /api/v1/campanas | Crear campaña |
| PUT | /api/v1/campanas/{id} | Editar campaña |
| DELETE | /api/v1/campanas/{id} | Eliminar campaña |
| POST | /api/v1/campanas/{id}/asignar-usuarios | Asignar usuarios |
| GET | /api/v1/campanas/{id}/usuarios | Ver usuarios de campaña |
| GET | /api/v1/seguimiento/usuario/{id} | Historial de seguimiento |
| POST | /api/v1/seguimiento | Crear registro de seguimiento |
| GET | /api/v1/landing/ | Info del gym (público) |
| GET | /api/v1/landing/planes | Planes y precios (público) |
| GET | /api/v1/landing/ejercicios | Catálogo de ejercicios (público) |
| GET | /api/v1/landing/clases | Clases grupales (público) |

---

## 11. CÓMO ARRANCAR

### Primera vez (base de datos)
Ejecutar en MySQL Workbench en este orden:
1. `sql/schema.sql`
2. `sql/procedures.sql`
3. `sql/triggers.sql`
4. `sql/seed_data.sql`
5. `sql/update_sps.sql` ← **obligatorio para que funcionen lista de pagos y asistencia**

### Backend
```
cd "crm gym"
.venv\Scripts\activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
API: http://127.0.0.1:8000 · Swagger: http://127.0.0.1:8000/docs

### Frontend
```
cd "crm gym/frontend"
npm run dev
```
App: http://localhost:5173

### Credenciales demo (contraseña: 123456)
| Email | Rol |
|---|---|
| admin@gym.com | Administrador (acceso total) |
| trainer1@gym.com | Entrenador (clientes: Juan, María, Diego, Isabella) |
| trainer2@gym.com | Entrenador (clientes: Pedro, Santiago, Valentina) |
| juan@gym.com | Cliente |

---

## 12. SEGURIDAD

- Contraseñas con bcrypt factor 12. Nunca en texto plano.
- JWT expira en 24h (configurable en `.env` con `JWT_EXPIRATION_HOURS`)
- `JWT_SECRET_KEY` debe ser una cadena aleatoria larga en producción
- CORS en modo `allow_origins=["*"]` en desarrollo. Cambiar al dominio real en producción
- Soft delete en usuarios (estado=inactivo) preserva históricos de pagos y membresías

---

## 13. DISEÑO (dark mode glassmorphic)

Tokens de color en `src/index.css` con `@theme` de Tailwind v4:
- `primary` (indigo/violeta) — Acción principal, Admin
- `accent-emerald` (verde) — Éxito, activo, ingresos
- `accent-amber` (naranja) — Advertencia, pagos
- `accent-rose` (rojo) — Error, eliminar
- `accent-cyan` (cian) — Highlights, clientes
- `accent-violet` (violeta) — Campañas, premium
- `dark` (slate oscuro) — Fondos y superficies

Clases utilitarias en `src/App.css`:
`.card`, `.glass-card`, `.stat-card`, `.btn`, `.badge`, `.input-field`, `.data-table`, `.modal-overlay`, `.page-header`, `.avatar`, `.spinner`, `.animate-fade-in`

---

*Gym Popayán CRM v2.0 · Documentación actualizada 9 de mayo de 2026*
*Popayán, Cauca, Colombia · America/Bogota (UTC-5)*
