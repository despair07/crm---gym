/**
 * Campañas - CRUD completo para Admin
 * Crear, editar, eliminar, ver detalles y asignar usuarios
 */
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { campanaService } from '../services/campanaService';
import { formatFecha } from '../utils/format';
import type { CampanaResponse, CampanaCreate } from '../types/api';

const EMPTY_FORM: CampanaCreate = {
  nombre: '',
  descripcion: '',
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: null,
  estado: 'activa',
};

const ESTADO_META: Record<string, { badge: string; icon: string; label: string }> = {
  activa:     { badge: 'badge-success', icon: '🟢', label: 'Activa' },
  pausada:    { badge: 'badge-warning', icon: '🟡', label: 'Pausada' },
  finalizada: { badge: 'badge-neutral', icon: '⚪', label: 'Finalizada' },
};

const Campanas = () => {
  const [campanas, setCampanas] = useState<CampanaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<CampanaResponse | null>(null);
  const [formData, setFormData] = useState<CampanaCreate>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Filtro de estado
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const notify = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };
  const notifyError = (msg: string) => { setError(msg); setTimeout(() => setError(null), 4000); };

  const fetchCampanas = async () => {
    try {
      setLoading(true);
      const data = await campanaService.listar();
      setCampanas(data);
    } catch (err: any) {
      notifyError(err.response?.data?.detail || 'Error al cargar campañas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampanas(); }, []);

  const abrirCrear = () => {
    setEditando(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const abrirEditar = (c: CampanaResponse) => {
    setEditando(c);
    setFormData({
      nombre: c.nombre,
      descripcion: c.descripcion || '',
      fecha_inicio: c.fecha_inicio?.split('T')[0] || '',
      fecha_fin: c.fecha_fin?.split('T')[0] || null,
      estado: c.estado,
    });
    setShowModal(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editando) {
        await campanaService.actualizar(editando.id_campana, formData);
        notify('✅ Campaña actualizada');
      } else {
        await campanaService.crear(formData);
        notify('✅ Campaña creada exitosamente');
      }
      setShowModal(false);
      fetchCampanas();
    } catch (err: any) {
      notifyError(err.response?.data?.detail || 'Error al guardar campaña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (c: CampanaResponse) => {
    if (!confirm(`¿Eliminar la campaña "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await campanaService.eliminar(c.id_campana);
      notify('✅ Campaña eliminada');
      fetchCampanas();
    } catch (err: any) {
      notifyError(err.response?.data?.detail || 'Error al eliminar campaña');
    }
  };

  const campanasFiltradas = filtroEstado === 'todos'
    ? campanas
    : campanas.filter((c) => c.estado === filtroEstado);

  const stats = {
    total: campanas.length,
    activas: campanas.filter((c) => c.estado === 'activa').length,
    pausadas: campanas.filter((c) => c.estado === 'pausada').length,
    finalizadas: campanas.filter((c) => c.estado === 'finalizada').length,
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Campañas</h1>
            <p>Gestión de campañas de marketing del Gym Popayán</p>
          </div>
          <button onClick={abrirCrear} className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Campaña
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: '📢', color: 'blue' },
            { label: 'Activas', value: stats.activas, icon: '🟢', color: 'green' },
            { label: 'Pausadas', value: stats.pausadas, icon: '🟡', color: 'amber' },
            { label: 'Finalizadas', value: stats.finalizadas, icon: '⚪', color: 'blue' },
          ].map((s) => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs text-dark-400">{s.label}</span>
              </div>
              <p className="text-3xl font-extrabold text-white">{loading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros por estado */}
        <div className="card p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-dark-500 mr-1">Filtrar:</span>
            {['todos', 'activa', 'pausada', 'finalizada'].map((e) => (
              <button
                key={e}
                onClick={() => setFiltroEstado(e)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filtroEstado === e
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'bg-dark-800/50 text-dark-500 border border-white/5 hover:text-dark-200'
                }`}
              >
                {e === 'todos' ? `Todas (${stats.total})` :
                 e === 'activa' ? `🟢 Activas (${stats.activas})` :
                 e === 'pausada' ? `🟡 Pausadas (${stats.pausadas})` :
                 `⚪ Finalizadas (${stats.finalizadas})`}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de campañas */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : campanasFiltradas.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="text-4xl block mb-3">📢</span>
            <p className="text-dark-400">No hay campañas {filtroEstado !== 'todos' ? `con estado "${filtroEstado}"` : 'registradas'}</p>
            <button onClick={abrirCrear} className="btn btn-primary mt-4 text-sm">+ Crear primera campaña</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campanasFiltradas.map((c) => {
              const meta = ESTADO_META[c.estado] || { badge: 'badge-info', icon: '🔵', label: c.estado };
              return (
                <div key={c.id_campana} className="glass-card p-5 animate-fade-in flex flex-col">
                  {/* Top */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                        📢
                      </div>
                      <h3 className="text-sm font-bold text-white truncate">{c.nombre}</h3>
                    </div>
                    <span className={`badge ${meta.badge} ml-2 flex-shrink-0`}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-dark-400 mb-4 line-clamp-2 flex-1">
                    {c.descripcion || <span className="italic text-dark-600">Sin descripción</span>}
                  </p>

                  {/* Fechas */}
                  <div className="space-y-1 text-xs text-dark-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Inicio: <span className="text-dark-300">{formatFecha(c.fecha_inicio)}</span></span>
                    </div>
                    {c.fecha_fin && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Fin: <span className="text-dark-300">{formatFecha(c.fecha_fin)}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[10px] text-dark-600 font-mono">ID: #{c.id_campana}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirEditar(c)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-500/15 text-primary-300 hover:bg-primary-500/25 border border-primary-500/20 transition-all"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(c)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-accent-rose/15 text-accent-rose hover:bg-accent-rose/25 border border-accent-rose/20 transition-all"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal crear / editar */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-5">
                {editando ? '✏️ Editar Campaña' : '📢 Nueva Campaña'}
              </h3>
              <form onSubmit={handleGuardar} className="space-y-4">
                <div>
                  <label className="input-label">Nombre *</label>
                  <input
                    type="text" required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="input-field"
                    placeholder="Nombre de la campaña"
                  />
                </div>
                <div>
                  <label className="input-label">Descripción</label>
                  <textarea
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Describe el objetivo de la campaña..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Fecha Inicio *</label>
                    <input
                      type="date" required
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Fecha Fin</label>
                    <input
                      type="date"
                      value={formData.fecha_fin || ''}
                      onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value || null })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Estado</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['activa', 'pausada', 'finalizada'] as const).map((est) => {
                      const m = ESTADO_META[est];
                      return (
                        <button
                          key={est} type="button"
                          onClick={() => setFormData({ ...formData, estado: est })}
                          className={`p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                            formData.estado === est
                              ? est === 'activa'
                                ? 'bg-accent-emerald/15 border-accent-emerald/30 text-accent-emerald'
                                : est === 'pausada'
                                  ? 'bg-accent-amber/15 border-accent-amber/30 text-accent-amber'
                                  : 'bg-dark-700 border-white/20 text-dark-200'
                              : 'bg-dark-800/50 border-white/5 text-dark-500 hover:text-dark-200'
                          }`}
                        >
                          {m.icon} {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting
                      ? (editando ? 'Guardando...' : 'Creando...')
                      : (editando ? '💾 Guardar Cambios' : '📢 Crear Campaña')}
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

export default Campanas;
