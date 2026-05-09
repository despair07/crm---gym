import api from './api';
import type { UsuarioCreate, UsuarioResponse, UsuarioUpdate } from '../types/api';

export const usuarioService = {
  crear: async (usuario: UsuarioCreate): Promise<{ mensaje: string; id_usuario: number }> => {
    const response = await api.post('/api/v1/usuarios', usuario);
    return response.data;
  },

  listar: async (id_rol?: number, estado?: string): Promise<UsuarioResponse[]> => {
    const params = new URLSearchParams();
    if (id_rol) params.append('id_rol', id_rol.toString());
    if (estado) params.append('estado', estado);
    
    const response = await api.get<UsuarioResponse[]>(`/api/v1/usuarios?${params}`);
    return response.data;
  },

  obtener: async (id_usuario: number): Promise<UsuarioResponse> => {
    const response = await api.get<UsuarioResponse>(`/api/v1/usuarios/${id_usuario}`);
    return response.data;
  },

  actualizar: async (id_usuario: number, usuario: UsuarioUpdate): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.put(`/api/v1/usuarios/${id_usuario}`, usuario);
    return response.data;
  },

  eliminar: async (id_usuario: number): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.delete(`/api/v1/usuarios/${id_usuario}`);
    return response.data;
  },
};