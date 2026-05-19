import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { pagoService } from '../services/pagoService';
import { formatCOP, formatFecha } from '../utils/format';
import type { PagoResponse, PagoCreate } from '../types/api';

const Pagos = () => {
  const [pagos, setPagos] = useState<PagoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<PagoCreate>({ id_membresia: 0, concepto: '', monto: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPagos = async () => {
    try {
      setLoading(true);
      const data = await pagoService.listar();
      setPagos(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPagos(); }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await pagoService.registrar(formData);
      setShowModal(false);
      setFormData({ id_membresia: 0, concepto: '', monto: 0 });
      setSuccess('✅ Pago registrado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      fetchPagos();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrar pago');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id_pago: number) => {
    if (!confirm('¿Estás seguro de eliminar este pago? Esta acción no se puede deshacer.')) return;
    try {
      await pagoService.eliminar(id_pago);
      setSuccess('✅ Pago eliminado correctamente');
      setTimeout(() => setSuccess(null), 3000);
      fetchPagos();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar pago');
      setTimeout(() => setError(null), 4000);
    }
  };

  const totalIngresos = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);
  const pagosHoy = pagos.filter(p => {
    if (!p.fecha_pago) return false;
    const hoy = new Date().toISOString().split('T')[0];
    return p.fecha_pago.startsWith(hoy);
  });

  const filtered = pagos.filter(p =>
    (p.usuario_nombre || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.concepto || '').toLowerCase().includes(search.toLowerCase()) ||
    String(p.id_pago).includes(search)
  );

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Pagos</h1>
            <p>Control de pagos de membresías · Pesos Colombianos (COP)</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Pago
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card amber">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-amber to-orange-500 flex items-center justify-center">
                <span className="text-white text-lg">💳</span>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Total Registros</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{loading ? '—' : pagos.length}</p>
          </div>
          <div className="stat-card green">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-emerald to-green-500 flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Ingresos Totales</span>
            </div>
            <p className="text-xl font-extrabold text-accent-emerald">{loading ? '—' : formatCOP(totalIngresos)}</p>
          </div>
          <div className="stat-card blue">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white text-lg">📅</span>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Pagos Hoy</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{loading ? '—' : pagosHoy.length}</p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, concepto o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !bg-transparent !border-0 !shadow-none !ring-0 focus:!shadow-none"
            />
            <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{filtered.length} registros</span>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario / Membresía</th>
                    <th>Concepto</th>
                    <th>Monto (COP)</th>
                    <th>Fecha</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="empty-state">No hay pagos registrados</td></tr>
                  ) : filtered.map((p) => (
                    <tr key={p.id_pago}>
                      <td className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>#{p.id_pago}</td>
                      <td>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {p.usuario_nombre || `Membresía #${p.id_membresia}`}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Membresía #{p.id_membresia}</p>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-body)' }}>{p.concepto || '—'}</td>
                      <td>
                        <span className="font-bold text-accent-emerald text-base">{formatCOP(p.monto)}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatFecha(p.fecha_pago)}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleEliminar(p.id_pago)}
                          className="action-btn action-btn-delete"
                          title="Eliminar pago"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totalizador */}
            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-white/5 flex justify-end items-center gap-4">
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{filtered.length} pagos filtrados</span>
                <span className="text-sm font-bold text-accent-emerald">
                  Total: {formatCOP(filtered.reduce((s, p) => s + (p.monto || 0), 0))}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Registrar Pago */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>💳 Registrar Pago</h3>
              <form onSubmit={handleCrear} className="space-y-4">
                <div>
                  <label className="input-label">ID Membresía *</label>
                  <input
                    type="number" required min={1}
                    value={formData.id_membresia || ''}
                    onChange={(e) => setFormData({ ...formData, id_membresia: parseInt(e.target.value) || 0 })}
                    className="input-field" placeholder="ID de la membresía"
                  />
                </div>
                <div>
                  <label className="input-label">Concepto</label>
                  <input
                    type="text"
                    value={formData.concepto || ''}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    className="input-field" placeholder="Ej: Pago mensual, Inscripción"
                  />
                </div>
                <div>
                  <label className="input-label">Monto (COP) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                    <input
                      type="number" required min={1000} step={1000}
                      value={formData.monto || ''}
                      onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
                      className="input-field !pl-7" placeholder="150000"
                    />
                  </div>
                  {formData.monto > 0 && (
                    <p className="text-xs text-accent-emerald mt-1">{formatCOP(formData.monto)}</p>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Registrando...' : 'Registrar Pago'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Pagos;
