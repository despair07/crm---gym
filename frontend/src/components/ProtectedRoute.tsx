/**
 * Componente de Ruta Protegida
 * Verifica autenticación y permisos de rol antes de renderizar
 * Redirige a /login si no hay sesión, o muestra error si no tiene permisos
 */
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Roles permitidos para acceder a esta ruta (si no se especifica, cualquier usuario autenticado) */
  allowedRoles?: number[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Mientras carga la sesión desde localStorage, mostrar spinner
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
      }}>
        <div className="spinner" />
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga el rol
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.rol_id)) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#e2e8f0',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f43f5e' }}>
            Acceso Denegado
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '400px' }}>
            No tienes permisos para acceder a esta sección.
            Contacta al administrador si necesitas acceso.
          </p>
          <a
            href="/dashboard"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Ir al Dashboard
          </a>
        </div>
      );
    }
  }

  // Usuario autenticado y con permisos → renderizar contenido
  return <>{children}</>;
};

export default ProtectedRoute;