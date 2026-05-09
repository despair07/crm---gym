# 🏋️ Gym CRM - Sistema de Gestión para Gimnasios

CRM completo para gimnasio con panel de administración, gestión de usuarios, membresías, pagos, entrenamientos y campañas de marketing.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Base de datos**: MySQL (con stored procedures)
- **Auth**: JWT

---

## 📁 Estructura del Proyecto

```
crm-gym/
├── app/              # Backend FastAPI
│   ├── routers/
│   ├── schemas/
│   ├── repositories/
│   └── main.py
├── frontend/         # Frontend React
│   ├── src/
│   ├── vercel.json   # Configuración de Vercel
│   └── vite.config.ts
├── sql/              # Scripts SQL (tablas, procedures)
├── .env.example      # Plantilla de variables de entorno
└── requirements.txt
```

---

## 🚀 Instalación Local

### 1. Backend (FastAPI)

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/crm-gym.git
cd crm-gym

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env
# Editar .env con tus credenciales de MySQL

# Iniciar el backend
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (React + Vite)

```bash
cd frontend

# Configurar variables de entorno
copy .env.example .env
# Editar .env: VITE_API_BASE_URL=http://127.0.0.1:8000

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

Abre **http://localhost:5173** para ver la landing page.

---

## ☁️ Despliegue en Vercel (Frontend)

### Opción 1: Desde la web de Vercel

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project**
3. Importa tu repositorio de GitHub
4. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. En **Environment Variables** agrega:
   ```
   VITE_API_BASE_URL = https://tu-api-backend.com
   ```
6. Haz clic en **Deploy** ✅

### Opción 2: Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

---

## 🌐 Despliegue del Backend

El backend FastAPI requiere una base de datos MySQL. Opciones recomendadas:

| Servicio | Precio | Link |
|----------|--------|------|
| **Railway** | Gratis (con límites) | [railway.app](https://railway.app) |
| **Render** | Gratis (con límites) | [render.com](https://render.com) |
| **DigitalOcean** | Pago | [digitalocean.com](https://digitalocean.com) |

---

## 👥 Roles de Usuario

| Rol | Acceso |
|-----|--------|
| **Admin (1)** | Todo el sistema |
| **Entrenador (2)** | Entrenamientos, Asistencia, Seguimiento |
| **Cliente (3)** | Solo Dashboard propio |

---

## 📄 Licencia

MIT License
