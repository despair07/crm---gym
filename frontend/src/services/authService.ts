/**
 * Servicio de autenticación
 * Maneja login, registro, logout y verificación de token
 */
import api from './api';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   * Guarda el token y datos del usuario en localStorage
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
    const data = response.data;

    // Guardar token y datos del usuario en localStorage
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id_usuario: data.id_usuario,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        rol_id: data.rol_id,
      }));
    }

    return data;
  },

  /**
   * Registrar nuevo usuario
   * Solo registra, NO hace login automático
   */
  register: async (data: RegisterRequest): Promise<{ mensaje: string; id_usuario: number }> => {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  },

  /**
   * Cerrar sesión
   * Limpia localStorage y opcionalmente notifica al backend
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener datos del usuario actual desde el backend
   * Verifica que el token siga siendo válido
   */
  getMe: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },

  /**
   * Verificar si hay sesión activa (token en localStorage)
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Obtener datos del usuario guardados en localStorage
   */
  getStoredUser: (): LoginResponse | null => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
};