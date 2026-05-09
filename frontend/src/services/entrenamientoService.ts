import api from './api';
import type { EntrenamientoCreate, EntrenamientoResponse, EntrenamientoUpdate } from '../types/api';

export const entrenamientoService = {
  crear: async (entrenamiento: EntrenamientoCreate): Promise<{ mensaje: string; id_entrenamiento: number }> => {
    const response = await api.post('/api/v1/entrenamientos', entrenamiento);
    return response.data;
  },

  listarPorUsuario: async (id_usuario: number): Promise<EntrenamientoResponse[]> => {
    const response = await api.get<EntrenamientoResponse[]>(`/api/v1/entrenamientos/usuario/${id_usuario}`);
    return response.data;
  },

  actualizar: async (id_entrenamiento: number, entrenamiento: EntrenamientoUpdate): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.put(`/api/v1/entrenamientos/${id_entrenamiento}`, entrenamiento);
    return response.data;
  },

  eliminar: async (id_entrenamiento: number): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.delete(`/api/v1/entrenamientos/${id_entrenamiento}`);
    return response.data;
  },
};