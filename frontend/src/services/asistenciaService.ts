import api from './api';
import type { AsistenciaCreate, AsistenciaResponse } from '../types/api';

export const asistenciaService = {
  registrar: async (asistencia: AsistenciaCreate): Promise<{ mensaje: string; id_asistencia: number }> => {
    const response = await api.post('/api/v1/asistencia', asistencia);
    return response.data;
  },

  listarTodos: async (): Promise<AsistenciaResponse[]> => {
    const response = await api.get<AsistenciaResponse[]>('/api/v1/asistencia');
    return response.data;
  },

  listarPorUsuario: async (id_usuario: number): Promise<AsistenciaResponse[]> => {
    const response = await api.get<AsistenciaResponse[]>(`/api/v1/asistencia/usuario/${id_usuario}`);
    return response.data;
  },
};