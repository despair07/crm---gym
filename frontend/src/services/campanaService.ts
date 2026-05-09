import api from './api';
import type { CampanaCreate, CampanaResponse, CampanaAsignarUsuarios } from '../types/api';

export const campanaService = {
  listar: async (): Promise<CampanaResponse[]> => {
    const response = await api.get<CampanaResponse[]>('/api/v1/campanas');
    return response.data;
  },

  crear: async (campana: CampanaCreate): Promise<{ mensaje: string; id_campana: number }> => {
    const response = await api.post('/api/v1/campanas', campana);
    return response.data;
  },

  actualizar: async (id_campana: number, campana: CampanaCreate): Promise<{ mensaje: string }> => {
    const response = await api.put(`/api/v1/campanas/${id_campana}`, campana);
    return response.data;
  },

  eliminar: async (id_campana: number): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/api/v1/campanas/${id_campana}`);
    return response.data;
  },

  asignarUsuarios: async (id_campana: number, usuarios: CampanaAsignarUsuarios): Promise<{ mensaje: string; total: number }> => {
    const response = await api.post(`/api/v1/campanas/${id_campana}/asignar-usuarios`, usuarios);
    return response.data;
  },

  listarUsuarios: async (id_campana: number): Promise<any[]> => {
    const response = await api.get(`/api/v1/campanas/${id_campana}/usuarios`);
    return response.data;
  },
};