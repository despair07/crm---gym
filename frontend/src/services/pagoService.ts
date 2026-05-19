import api from './api';
import type { PagoCreate, PagoResponse } from '../types/api';

export const pagoService = {
  registrar: async (pago: PagoCreate): Promise<{ mensaje: string; id_pago: number }> => {
    const response = await api.post('/api/v1/pagos', pago);
    return response.data;
  },

  listar: async (id_membresia?: number): Promise<PagoResponse[]> => {
    const params = id_membresia ? `?id_membresia=${id_membresia}` : '';
    const response = await api.get<PagoResponse[]>(`/api/v1/pagos${params}`);
    return response.data;
  },

  eliminar: async (id_pago: number): Promise<{ mensaje: string; filas: number }> => {
    const response = await api.delete(`/api/v1/pagos/${id_pago}`);
    return response.data;
  },
};