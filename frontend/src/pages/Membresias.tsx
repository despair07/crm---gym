import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { membresiaService } from '../services/membresiaService';
import type { MembresiaResponse, MembresiaCreate } from '../types/api';

const Membresias = () => {
  const [membresias, setMembresias] = useState<MembresiaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<MembresiaCreate>({
    id_usuario: 0, id_plan: 1, fecha_inicio: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMembresias = async () => {
    try {
      setLoading(true);
      const data = await membresiaService.listar(filtroEstado || undefined);
      setMembresias(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar membresías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembresias(); }, [filtroEstado]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    try {
      await membresiaService.crear(formData);
      setShowModal(false);
      setFormData({ id_usuario: 0, id_plan: 1, fecha_inicio: new Date().toISOString().split('T')[0] });
      setSuccess('✅ Membresía creada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      fetchMembresias();
    } catch (err: any) { setError(err.response?.data?.detail || 'Error al crear membresía'); }
    finally { setSubmitting(false); }
  };

  const handleRenovar = async (id: number) => {
    try {
      await membresiaService.renovar(id);
      setSuccess('✅ Membresía renovada');
      setTimeout(() => setSuccess(null), 3000);
      fetchMembresias();
    } catch (err: any) { setError(err.response?.data?.detail || 'Error al renovar'); }
  };

  const handleCancelar = async (id: number) => {
    if (!confirm('¿Seguro que deseas cancelar esta membresía?')) return;
    try {
      await membresiaService.cancelar(id);
      setSuccess('✅ Membresía cancelada');
      setTimeout(() => setSuccess(null), 3000);
      fetchMembresias();
    } catch (err: any) { setError(err.response?.data?.detail || 'Error al cancelar'); }
  };

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      activa: 'badge-success', vencida: 'badge-danger', cancelada: 'badge-neutral',
    };
    return styles[estado] || 'badge-info';
  };

  const getPlanName = (id_plan: number) => {
    const planes: Record<number, string> = { 1: 'Mensual', 2: 'Trimestral', 3: 'Anual' };
    return planes[id_plan] || `Plan ${id_plan}`;
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="page-header">
          <div>
            <h1>Membresías</h1>
            <p>Gestiona las membresías de los usuarios</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Membresía
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Filter */}
        <div className="card p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-dark-400">Filtrar por estado:</span>
            {['', 'activa', 'vencida', 'cancelada'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filtroEstado === estado
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'bg-dark-800/50 text-dark-400 border border-white/5 hover:text-dark-200'
                }`}
              >
                {estado || 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Plan</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {membresias.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">No hay membresías registradas</td></tr>
                  ) : membresias.map((m) => (
                    <tr key={m.id_membresia}>
                      <td className="font-mono text-dark-500 text-xs">#{m.id_membresia}</td>
                      <td>
                        <span className="badge badge-info">Usuario #{m.id_usuario}</span>
                      </td>
                      <td>
                        <span className="font-medium text-dark-200">{getPlanName(m.id_plan)}</span>
                      </td>
                      <td className="text-dark-400">{m.fecha_inicio}</td>
                      <td className="text-dark-400">{m.fecha_fin}</td>
                      <td><span className={`badge ${getEstadoBadge(m.estado)}`}>{m.estado}</span></td>
                      <td className="text-right space-x-1">
                        <button onClick={() => handleRenovar(m.id_membresia)} className="action-btn action-btn-success">Renovar</button>
                        <button onClick={() => handleCancelar(m.id_membresia)} className="action-btn action-btn-delete">Cancelar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Crear */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-5">🛡️ Nueva Membresía</h3>
              <form onSubmit={handleCrear} className="space-y-4">
                <div>
                  <label className="input-label">ID Usuario *</label>
                  <input type="number" required min={1} value={formData.id_usuario || ''} onChange={(e) => setFormData({ ...formData, id_usuario: parseInt(e.target.value) || 0 })} className="input-field" placeholder="ID del usuario" />
                </div>
                <div>
                  <label className="input-label">Plan *</label>
                  <select value={formData.id_plan} onChange={(e) => setFormData({ ...formData, id_plan: parseInt(e.target.value) })} className="input-field">
                    <option value={1}>Mensual - $80,000</option>
                    <option value={2}>Trimestral - $210,000</option>
                    <option value={3}>Anual - $650,000</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Fecha Inicio *</label>
                  <input type="date" required value={formData.fecha_inicio} onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} className="input-field" />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Creando...' : 'Crear Membresía'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Membresias;
