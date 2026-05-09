import api from './api';
import type { SeguimientoCreate, SeguimientoResponse } from '../types/api';

export const seguimientoService = {
  crear: async (seguimiento: SeguimientoCreate): Promise<{ mensaje: string; id_seguimiento: number }> => {
    const response = await api.post('/api/v1/seguimiento', seguimiento);
    return response.data;
  },

  listarPorUsuario: async (id_usuario: number): Promise<SeguimientoResponse[]> => {
    const response = await api.get<SeguimientoResponse[]>(`/api/v1/seguimiento/usuario/${id_usuario}`);
    return response.data;
  },
};