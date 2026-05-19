/**
 * Seguimiento mejorado - con selector de clientes por nombre
 * Admin/Entrenador: selecciona cliente y gestiona seguimientos
 * Cliente: ve solo su historial de seguimiento (read-only)
 */
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { seguimientoService } from '../services/seguimientoService';
import { usuarioService } from '../services/usuarioService';
import { formatFecha } from '../utils/format';
import type { SeguimientoResponse, SeguimientoCreate, UsuarioResponse } from '../types/api';

const TIPO_META: Record<string, { icon: string; badge: string; label: string }> = {
  nota: { icon: '📝', badge: 'badge-info', label: 'Nota' },
  llamada: { icon: '📞', badge: 'badge-purple', label: 'Llamada' },
  email: { icon: '📧', badge: 'badge-info', label: 'Email' },
  visita: { icon: '👤', badge: 'badge-success', label: 'Visita' },
  evaluacion: { icon: '📊', badge: 'badge-warning', label: 'Evaluación' },
  seguimiento: { icon: '🔍', badge: 'badge-info', label: 'Seguimiento' },
  alerta: { icon: '⚠️', badge: 'badge-danger', label: 'Alerta' },
};

const Seguimiento = () => {
  const { user, isEntrenador, isCliente, isAdmin } = useAuth();

  const [clientes, setClientes] = useState<UsuarioResponse[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<UsuarioResponse | null>(null);
  const [registros, setRegistros] = useState<SeguimientoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchCliente, setSearchCliente] = useState('');

  const [formData, setFormData] = useState<SeguimientoCreate>({
    id_usuario: 0,
    tipo: 'nota',
    comentario: '',
  });

  useEffect(() => {
    if (isCliente && user) {
      // Cliente: carga directamente su historial de seguimiento
      setLoadingClientes(false);
      cargar(user.id_usuario);
    } else {
      // Admin y Entrenador: cargar lista de clientes
      usuarioService.listar(3).then((data) => {
        if (isEntrenador && user) {
          setClientes(data.filter((c) => c.id_entrenador === user.id_usuario));
        } else {
          setClientes(data);
        }
      }).finally(() => setLoadingClientes(false));
    }
  }, [user]);

  const seleccionar = (c: UsuarioResponse) => {
    setClienteSeleccionado(c);
    setFormData((f) => ({ ...f, id_usuario: c.id_usuario }));
    cargar(c.id_usuario);
  };

  const cargar = async (id: number) => {
    setLoading(true);
    try {
      const data = await seguimientoService.listarPorUsuario(id);
      setRegistros(data); setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar seguimiento');
    } finally { setLoading(false); }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    try {
      await seguimientoService.crear({
        ...formData,
        id_registrado_por: user?.id_usuario,
      });
      setShowModal(false);
      setSuccess('✅ Seguimiento registrado');
      setTimeout(() => setSuccess(null), 3000);
      if (clienteSeleccionado) cargar(clienteSeleccionado.id_usuario);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear seguimiento');
    } finally { setSubmitting(false); }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.email.toLowerCase().includes(searchCliente.toLowerCase())
  );

  // ── RENDER PARA CLIENTE ──
  if (isCliente) {
    return (
      <Layout>
        <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
          <div className="page-header">
            <div>
              <h1>Mi Seguimiento</h1>
              <p>Historial de seguimiento que tu entrenador ha registrado</p>
            </div>
          </div>

          {error && <div className="alert alert-error">❌ {error}</div>}

          {loading ? (
            <div className="flex justify-center py-16"><div className="spinner" /></div>
          ) : registros.length === 0 ? (
            <div className="card p-12 text-center">
              <span className="text-4xl">📋</span>
              <p className="mt-3" style={{ color: 'var(--text-muted)' }}>No hay seguimientos registrados para ti</p>
            </div>
          ) : (
            <div className="space-y-3">
              {registros.map((r) => {
                const meta = TIPO_META[r.tipo] || { icon: '📋', badge: 'badge-neutral', label: r.tipo };
                return (
                  <div key={r.id_seguimiento} className="glass-card p-5 animate-fade-in">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                          style={{ background: 'var(--bg-card)' }}>
                          {meta.icon}
                        </div>
                        <div>
                          <span className={`badge ${meta.badge}`}>{meta.label}</span>
                          <span className="text-xs ml-2 font-mono" style={{ color: 'var(--text-disabled)' }}>#{r.id_seguimiento}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>{formatFecha(r.fecha)}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                      {r.comentario || <span className="italic" style={{ color: 'var(--text-disabled)' }}>Sin comentario</span>}
                    </p>
                    {r.registrado_por_nombre && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs" style={{ color: 'var(--text-faint)' }}>
                        <span>📝 Por: <span style={{ color: 'var(--text-muted)' }}>{r.registrado_por_nombre}</span></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // ── RENDER PARA ADMIN/ENTRENADOR ──
  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Seguimiento</h1>
            <p>
              {clienteSeleccionado
                ? `Historial de ${clienteSeleccionado.nombre}`
                : 'Selecciona un cliente para ver su historial'}
            </p>
          </div>
          {clienteSeleccionado && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Seguimiento
            </button>
          )}
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Selector de clientes */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              {isEntrenador ? '👥 Mis Clientes' : '👥 Seleccionar Cliente'}
            </h2>
            {clienteSeleccionado && (
              <button
                onClick={() => { setClienteSeleccionado(null); setRegistros([]); }}
                className="text-xs transition-colors" style={{ color: 'var(--text-faint)' }}
              >
                ← Ver todos
              </button>
            )}
          </div>

          {loadingClientes ? (
            <div className="flex justify-center py-6"><div className="spinner" /></div>
          ) : clientes.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-3xl">👤</span>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>No hay clientes disponibles</p>
            </div>
          ) : !clienteSeleccionado ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--text-faint)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchCliente}
                  onChange={(e) => setSearchCliente(e.target.value)}
                  className="bg-transparent border-0 outline-none text-sm flex-1"
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {clientesFiltrados.map((c) => (
                  <button
                    key={c.id_usuario}
                    onClick={() => seleccionar(c)}
                    className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary-500/30 transition-all duration-200 text-left group"
                    style={{ background: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="avatar avatar-sm bg-gradient-to-br from-accent-violet to-purple-500 text-white flex-shrink-0">
                      {c.nombre.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-white" style={{ color: 'var(--text-secondary)' }}>{c.nombre}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{c.email}</p>
                      {/* Mostrar entrenador asignado */}
                      {isAdmin && c.entrenador_nombre && (
                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          🏋️ {c.entrenador_nombre}
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 group-hover:text-primary-400 flex-shrink-0" style={{ color: 'var(--text-disabled)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 flex items-center gap-4">
              <div className="avatar bg-gradient-to-br from-accent-violet to-purple-500 text-white">
                {clienteSeleccionado.nombre.charAt(0)}
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>{clienteSeleccionado.nombre}</p>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{clienteSeleccionado.email}</p>
                {/* Mostrar entrenador asignado al admin */}
                {isAdmin && clienteSeleccionado.entrenador_nombre && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    🏋️ Entrenador: {clienteSeleccionado.entrenador_nombre}
                  </p>
                )}
              </div>
              <span className={`badge ml-auto ${clienteSeleccionado.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                {clienteSeleccionado.estado}
              </span>
            </div>
          )}
        </div>

        {/* Historial de seguimiento */}
        {clienteSeleccionado && (
          loading ? (
            <div className="flex justify-center py-16"><div className="spinner" /></div>
          ) : registros.length === 0 ? (
            <div className="card p-12 text-center">
              <span className="text-4xl">📋</span>
              <p className="mt-3" style={{ color: 'var(--text-muted)' }}>No hay seguimientos para este cliente</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4 text-sm">
                + Primer seguimiento
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {registros.map((r) => {
                const meta = TIPO_META[r.tipo] || { icon: '📋', badge: 'badge-neutral', label: r.tipo };
                return (
                  <div key={r.id_seguimiento} className="glass-card p-5 animate-fade-in">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                          style={{ background: 'var(--bg-card)' }}>
                          {meta.icon}
                        </div>
                        <div>
                          <span className={`badge ${meta.badge}`}>{meta.label}</span>
                          <span className="text-xs ml-2 font-mono" style={{ color: 'var(--text-disabled)' }}>#{r.id_seguimiento}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>{formatFecha(r.fecha)}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                      {r.comentario || <span className="italic" style={{ color: 'var(--text-disabled)' }}>Sin comentario</span>}
                    </p>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs" style={{ color: 'var(--text-faint)' }}>
                      <span>👤 {r.usuario_nombre || `Usuario #${r.id_usuario}`}</span>
                      {r.registrado_por_nombre && (
                        <span>📝 Por: <span style={{ color: 'var(--text-muted)' }}>{r.registrado_por_nombre}</span></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>📋 Nuevo Seguimiento</h3>
              {clienteSeleccionado && (
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                  Cliente: <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{clienteSeleccionado.nombre}</span>
                </p>
              )}
              <form onSubmit={handleCrear} className="space-y-4">
                <div>
                  <label className="input-label">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="input-field"
                  >
                    {Object.entries(TIPO_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Comentario</label>
                  <textarea
                    value={formData.comentario || ''}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Describe la interacción, progreso o nota relevante..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Guardando...' : 'Guardar Seguimiento'}
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

export default Seguimiento;
