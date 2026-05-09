/**
 * App principal - Enrutamiento con protección por roles
 * 
 * Rutas públicas:  / (landing), /login, /register
 * Rutas protegidas: /dashboard, /usuarios, /membresias, etc.
 * 
 * Roles: 1=Admin (todo), 2=Entrenador (entrenamientos, asistencia, seguimiento), 3=Cliente (dashboard)
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROLES } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas públicas
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas protegidas
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Membresias from './pages/Membresias';
import Pagos from './pages/Pagos';
import Entrenamientos from './pages/Entrenamientos';
import Asistencia from './pages/Asistencia';
import Campanas from './pages/Campanas';
import Seguimiento from './pages/Seguimiento';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* ==================== RUTAS PÚBLICAS ==================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==================== RUTAS PROTEGIDAS ==================== */}

        {/* Dashboard - Todos los roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Usuarios - Solo Admin */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        {/* Membresías - Solo Admin */}
        <Route
          path="/membresias"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Membresias />
            </ProtectedRoute>
          }
        />

        {/* Pagos - Solo Admin */}
        <Route
          path="/pagos"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Pagos />
            </ProtectedRoute>
          }
        />

        {/* Entrenamientos - Admin y Entrenadores */}
        <Route
          path="/entrenamientos"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR]}>
              <Entrenamientos />
            </ProtectedRoute>
          }
        />

        {/* Asistencia - Admin y Entrenadores */}
        <Route
          path="/asistencia"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR]}>
              <Asistencia />
            </ProtectedRoute>
          }
        />

        {/* Campañas - Solo Admin */}
        <Route
          path="/campanas"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Campanas />
            </ProtectedRoute>
          }
        />

        {/* Seguimiento - Admin y Entrenadores */}
        <Route
          path="/seguimiento"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ENTRENADOR]}>
              <Seguimiento />
            </ProtectedRoute>
          }
        />

        {/* Perfil - Todos los roles */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto - redirigir al landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;