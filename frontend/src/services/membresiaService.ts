import api from './api';
import type { MembresiaCreate, MembresiaResponse } from '../types/api';

export const membresiaService = {
  crear: async (membresia: MembresiaCreate): Promise<{ mensaje: string; id_membresia: number }> => {
    const response = await api.post('/api/v1/membresias', membresia);
    return response.data;
  },

  listar: async (estado?: string): Promise<MembresiaResponse[]> => {
    const params = estado ? `?estado=${estado}` : '';
    const response = await api.get<MembresiaResponse[]>(`/api/v1/membresias${params}`);
    return response.data;
  },

  renovar: async (id_membresia: number): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.put(`/api/v1/membresias/${id_membresia}/renovar`);
    return response.data;
  },

  cancelar: async (id_membresia: number): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.put(`/api/v1/membresias/${id_membresia}/cancelar`);
    return response.data;
  },
};