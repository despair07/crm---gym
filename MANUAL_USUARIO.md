# Manual de Usuario — CRM Gym

Última actualización: 15-05-2026

## Índice
- Introducción
- Requisitos
- Instalación y puesta en marcha
  - Backend (API)
  - Frontend (SPA)
- Inicio de sesión y registro
- Vista general de la interfaz
  - Dashboard
  - Menú lateral
- Funcionalidades por sección
  - Landing
  - Asistencia
  - Campañas
  - Entrenamientos
  - Membresías
  - Pagos
  - Seguimiento
  - Usuarios
  - Perfil
- Seguridad y permisos
- Resolución de problemas comunes
- Soporte y contacto

---

## Introducción
Este documento explica cómo usar la aplicación "CRM Gym" desde la perspectiva de usuario final. Cubre pasos básicos: instalación, inicio de sesión, navegación por las secciones principales y operaciones comunes.

## Requisitos
- Navegador moderno (Chrome, Edge, Firefox) actualizado.
- Conexión a internet para usar la API y recursos estáticos.
- Acceso con credenciales provistas por el administrador (email/usuario y contraseña).

## Instalación y puesta en marcha
Nota: si usas la versión desplegada (Vercel o similar), solo necesitas abrir la URL pública. Los siguientes pasos aplican si trabajas localmente.

### Backend (API)
1. Clonar el repositorio y activar el entorno virtual:

   - Clonar: `git clone <repo>`
   - Entrar a la carpeta: `cd "crm gym"`
   - Crear/activar entorno virtual (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

3. Configurar variables de entorno (ejemplos en `app/config.py`):
   - `DATABASE_URL` o parámetros de conexión a la base de datos
   - `SECRET_KEY` para firmas/tokens
   - Otros valores según integración de email o pasarelas de pago

4. Iniciar la API (modo desarrollo):

```powershell
python -m app.main
```

La API expone rutas para autenticación, gestión de usuarios, asistencias, pagos, etc.

### Frontend (SPA)
1. Entrar a la carpeta `frontend`:

```bash
cd frontend
```

2. Instalar dependencias (requiere Node.js + npm/yarn):

```bash
npm install
# o
yarn
```

3. Iniciar servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

4. Abrir `http://localhost:3000` (o el puerto mostrado) en el navegador.

## Inicio de sesión y registro
- Registro: accede a la pantalla `Register` y completa los datos solicitados (nombre, email, contraseña y demás campos obligatorios).
- Inicio de sesión: en `Login` introduce tu email y contraseña; si las credenciales son válidas, accederás al `Dashboard`.
- Recuperar contraseña: si la app tiene esta función, sigue el enlace "¿Olvidaste tu contraseña?" y sigue las instrucciones. Si no, contacta al administrador.

## Vista general de la interfaz
La interfaz se compone de:
- Encabezado (Header): acceso a perfil, notificaciones y opciones generales.
- Barra lateral (Sidebar): navegación entre secciones (Dashboard, Asistencia, Campañas, Entrenamientos, Membresías, Pagos, Seguimiento, Usuarios, Perfil).
- Área principal: contenido y formularios de la sección seleccionada.

### Dashboard
Presenta métricas clave: número de usuarios activos, pagos recientes, próximas asistencias, y acceso rápido a acciones comunes.

### Menú lateral
- Dashboard
- Asistencia
- Campañas
- Entrenamientos
- Membresías
- Pagos
- Seguimiento
- Usuarios (solo admins)
- Perfil
- Cerrar sesión

## Funcionalidades por sección
A continuación se describen las acciones más comunes en cada sección. La interfaz puede ofrecer botones, tablas, filtros y formularios.

### Landing
- Vista pública de la app o página inicial.
- Generalmente contiene información de presentación y links a registro/login.

### Asistencia
- Registrar asistencia: marcar entrada/salida de un socio.
- Ver historial: tabla con registros de fecha, hora, usuario y observaciones.
- Filtrar por fecha/usuario.

### Campañas
- Crear/editar campañas de marketing (envío de correos o notificaciones).
- Ver lista de campañas activas e historial.
- Iniciar/pausar campañas y revisar métricas básicas (apertura, clics) si están integradas.

### Entrenamientos
- Crear plantillas de entrenamientos.
- Asignar rutinas a usuarios.
- Ver historial de entrenamientos completados.

### Membresías
- Crear y configurar tipos de membresía (duración, precio, beneficios).
- Asignar membresías a usuarios y ver su estado (activa, vencida, pendiente).
- Renovar o cancelar membresías.

### Pagos
- Registrar pagos manualmente o ver pagos procesados por integración.
- Ver historial de transacciones con fecha, monto, método y usuario.
- Generar comprobantes o facturas (si está disponible).

### Seguimiento
- Registrar notas o seguimiento personalizado por usuario.
- Ver comunicaciones previas y progreso.

### Usuarios
- Listado de usuarios: buscar, filtrar y ordenar.
- Crear nuevo usuario (formulario con datos personales y credenciales temporales).
- Editar datos del usuario (contacto, estado, membresía asignada).
- Cambiar roles/permisos (por ejemplo: admin, staff, cliente).
- Eliminar o desactivar un usuario.

### Perfil
- Ver y editar datos propios: nombre, email, foto, contraseña.
- Preferencias de usuario (si aplica).

## Seguridad y permisos
- Existen roles que limitan acceso a ciertas funciones (por ejemplo, solo administradores pueden gestionar usuarios).
- No compartas tu contraseña.
- Cierra sesión en equipos públicos.

## Resolución de problemas comunes
- No puedo iniciar sesión: verifica email/contraseña, revisa mayúsculas, solicita restablecimiento o contacta soporte.
- Página en blanco o errores JS: intenta recargar la página o limpiar caché del navegador.
- La API no responde: verifica que el backend esté en ejecución y la `DATABASE_URL` esté correcta.

## Soporte y contacto
Para problemas que no puedas resolver, contacta al administrador o al equipo de soporte interno proporcionando:
- Descripción del problema
- Pasos para reproducirlo
- Capturas de pantalla (si aplica)
- Hora y usuario afectado

## Notas para administradores (rápido)
- Archivos relevantes:
  - Backend: `app/main.py`, `app/repositories/`, `app/services/`, `app/routers/`
  - Frontend: `frontend/src/` (componentes, pages, services)
- Base de datos: el esquema SQL está en la carpeta `sql/` (`schema.sql`, `seed_data.sql`).
- Despliegue: se incluye `vercel.json` en caso de hosting con Vercel.

---

¿Quieres que añada capturas de pantalla, pasos detallados para cada formulario, o una versión en inglés?
