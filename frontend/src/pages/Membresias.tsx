/**
 * Membresías - Gestión para Admin, vista personal para Cliente
 * ADMIN: CRUD completo de membresías
 * CLIENTE: ve solo sus propias membresías (read-only)
 */
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { membresiaService } from '../services/membresiaService';
import { formatFecha, formatCOP } from '../utils/format';
import type { MembresiaResponse, MembresiaCreate } from '../types/api';

const Membresias = () => {
  const { user, isAdmin, isCliente } = useAuth();
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
      if (isCliente && user) {
        // Cliente: solo ve sus propias membresías
        setMembresias(data.filter(m => m.id_usuario === user.id_usuario));
      } else {
        setMembresias(data);
      }
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

  const membresiaActiva = membresias.find(m => m.estado === 'activa');

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="page-header">
          <div>
            <h1>{isCliente ? 'Mi Membresía' : 'Membresías'}</h1>
            <p>{isCliente ? 'Información de tu membresía en el gimnasio' : 'Gestiona las membresías de los usuarios'}</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Membresía
            </button>
          )}
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Cliente: resumen de membresía activa */}
        {isCliente && !loading && (
          <div className={`card p-6 border ${membresiaActiva ? 'border-accent-emerald/30' : 'border-accent-rose/30'}`}
            style={{ background: membresiaActiva ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)' }}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${membresiaActiva ? 'bg-accent-emerald/20' : 'bg-accent-rose/20'}`}>
                {membresiaActiva ? '✅' : '⚠️'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {membresiaActiva ? `Plan ${getPlanName(membresiaActiva.id_plan)}` : 'Sin membresía activa'}
                </p>
                {membresiaActiva && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Válida: {formatFecha(membresiaActiva.fecha_inicio)} — <span className="text-accent-emerald font-semibold">{formatFecha(membresiaActiva.fecha_fin)}</span>
                    {membresiaActiva.precio && (
                      <span className="ml-3" style={{ color: 'var(--text-faint)' }}>· {formatCOP(membresiaActiva.precio)}</span>
                    )}
                  </p>
                )}
                {!membresiaActiva && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Contacta al administrador para renovar tu membresía</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter - solo Admin */}
        {isAdmin && (
          <div className="card p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Filtrar por estado:</span>
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
        )}

        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : membresias.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="text-4xl block mb-3">🛡️</span>
            <p style={{ color: 'var(--text-muted)' }}>
              {isCliente ? 'No tienes membresías registradas' : 'No hay membresías registradas'}
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    {!isCliente && <th>Usuario</th>}
                    <th>Plan</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    {isAdmin && <th className="text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {membresias.map((m) => (
                    <tr key={m.id_membresia}>
                      <td className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>#{m.id_membresia}</td>
                      {!isCliente && (
                        <td>
                          <span className="badge badge-info">{m.usuario_nombre || `Usuario #${m.id_usuario}`}</span>
                        </td>
                      )}
                      <td>
                        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{m.nombre_plan || getPlanName(m.id_plan)}</span>
                        {m.precio && (
                          <p className="text-xs text-accent-emerald">{formatCOP(m.precio)}</p>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatFecha(m.fecha_inicio)}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatFecha(m.fecha_fin)}</td>
                      <td><span className={`badge ${getEstadoBadge(m.estado)}`}>{m.estado}</span></td>
                      {isAdmin && (
                        <td className="text-right space-x-1">
                          <button onClick={() => handleRenovar(m.id_membresia)} className="action-btn action-btn-success">Renovar</button>
                          <button onClick={() => handleCancelar(m.id_membresia)} className="action-btn action-btn-delete">Cancelar</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Crear - solo Admin */}
        {showModal && isAdmin && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>🛡️ Nueva Membresía</h3>
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
