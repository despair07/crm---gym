/**
 * Contexto de Autenticación
 * Provee el estado del usuario a toda la aplicación
 * Persiste la sesión usando localStorage
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { LoginResponse } from '../types/api';
import { authService } from '../services/authService';

// ==================== DEFINICIÓN DE ROLES ====================
// Deben coincidir con la tabla 'roles' de la base de datos
export const ROLES = {
  ADMIN: 1,        // Administrador - acceso total
  ENTRENADOR: 2,   // Entrenador - entrenamientos, asistencia, seguimiento
  CLIENTE: 3,      // Cliente - solo su perfil y datos personales
} as const;

// Nombres legibles de los roles
export const ROLE_NAMES: Record<number, string> = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.ENTRENADOR]: 'Entrenador',
  [ROLES.CLIENTE]: 'Cliente',
};

// ==================== INTERFACE DEL CONTEXTO ====================
interface AuthContextType {
  /** Usuario autenticado (null si no hay sesión) */
  user: LoginResponse | null;
  /** Indica si se está cargando la sesión */
  loading: boolean;
  /** Indica si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Login: guarda usuario y token */
  login: (userData: LoginResponse) => void;
  /** Logout: limpia todo */
  logout: () => void;
  /** Verifica si el usuario tiene alguno de los roles indicados */
  hasRole: (...roles: number[]) => boolean;
  /** Verifica si el usuario es admin */
  isAdmin: boolean;
  /** Verifica si el usuario es entrenador */
  isEntrenador: boolean;
  /** Verifica si el usuario es cliente */
  isCliente: boolean;
}

// ==================== CREAR CONTEXTO ====================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true); // true hasta que verifiquemos localStorage

  // Al cargar la app, revisar si hay sesión guardada en localStorage
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = localStorage.getItem('access_token');

    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Función de login
  const login = useCallback((userData: LoginResponse) => {
    setUser(userData);
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Verificar si el usuario tiene alguno de los roles permitidos
  const hasRole = useCallback(
    (...roles: number[]) => {
      if (!user) return false;
      return roles.includes(user.rol_id);
    },
    [user]
  );

  // Propiedades computadas de rol
  const isAdmin = user?.rol_id === ROLES.ADMIN;
  const isEntrenador = user?.rol_id === ROLES.ENTRENADOR;
  const isCliente = user?.rol_id === ROLES.CLIENTE;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        isAdmin,
        isEntrenador,
        isCliente,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==================== HOOK ====================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};