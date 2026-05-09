import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { asistenciaService } from '../services/asistenciaService';
import { formatFechaHora } from '../utils/format';
import type { AsistenciaResponse, AsistenciaCreate } from '../types/api';

const Asistencia = () => {
  const [registros, setRegistros] = useState<AsistenciaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [buscarId, setBuscarId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<AsistenciaCreate>({ id_usuario: 0, tipo_registro: 'entrada' });
  const [submitting, setSubmitting] = useState(false);

  // Carga inicial: todos los registros (sin filtro)
  const fetchTodos = async () => {
    try {
      setLoading(true);
      // Si el servicio no tiene un método "listarTodos", buscar por un ID muy grande para listar
      // Intentamos sin ID primero — si no existe el endpoint, degradamos a búsqueda por ID
      const data = await asistenciaService.listarTodos?.() ?? [];
      setRegistros(data);
      setError(null);
    } catch {
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPorUsuario = async () => {
    if (!buscarId) { fetchTodos(); return; }
    try {
      setLoading(true);
      const data = await asistenciaService.listarPorUsuario(parseInt(buscarId));
      setRegistros(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar asistencia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await asistenciaService.registrar(formData);
      setShowModal(false);
      setFormData({ id_usuario: 0, tipo_registro: 'entrada' });
      setSuccess('✅ Asistencia registrada');
      setTimeout(() => setSuccess(null), 3000);
      buscarId ? fetchPorUsuario() : fetchTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrar asistencia');
    } finally {
      setSubmitting(false);
    }
  };

  const entradas = registros.filter(r => r.tipo_registro === 'entrada').length;
  const salidas = registros.filter(r => r.tipo_registro === 'salida').length;

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Asistencia</h1>
            <p>Registro de entradas y salidas del gimnasio</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Asistencia
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card blue">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white text-lg">📋</span>
              </div>
              <span className="text-xs text-dark-400 font-medium">Total Registros</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{loading ? '—' : registros.length}</p>
          </div>
          <div className="stat-card green">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-emerald to-green-500 flex items-center justify-center">
                <span className="text-white text-lg">🟢</span>
              </div>
              <span className="text-xs text-dark-400 font-medium">Entradas</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{loading ? '—' : entradas}</p>
          </div>
          <div className="stat-card amber">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-amber to-orange-500 flex items-center justify-center">
                <span className="text-white text-lg">🔴</span>
              </div>
              <span className="text-xs text-dark-400 font-medium">Salidas</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{loading ? '—' : salidas}</p>
          </div>
        </div>

        {/* Filtro por usuario */}
        <div className="card p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <svg className="w-4 h-4 text-dark-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="number"
              placeholder="Filtrar por ID de usuario..."
              value={buscarId}
              onChange={(e) => setBuscarId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPorUsuario()}
              className="input-field !bg-transparent !border-0 !shadow-none !ring-0 focus:!shadow-none flex-1"
            />
            <button onClick={fetchPorUsuario} className="btn btn-primary btn-sm">Filtrar</button>
            {buscarId && (
              <button onClick={() => { setBuscarId(''); fetchTodos(); }} className="btn btn-ghost btn-sm">
                Limpiar
              </button>
            )}
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
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Fecha y Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty-state">
                        <svg className="w-12 h-12 mx-auto mb-3 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No hay registros de asistencia
                      </td>
                    </tr>
                  ) : registros.map((r) => (
                    <tr key={r.id_asistencia}>
                      <td className="font-mono text-dark-500 text-xs">#{r.id_asistencia}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar avatar-sm bg-gradient-to-br from-accent-cyan to-blue-500 text-white text-xs">
                            {(r.usuario_nombre || String(r.id_usuario)).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-dark-200">{r.usuario_nombre || `Usuario #${r.id_usuario}`}</p>
                            <p className="text-xs text-dark-500">ID: {r.id_usuario}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.tipo_registro === 'entrada' ? 'badge-success' : 'badge-warning'}`}>
                          {r.tipo_registro === 'entrada' ? '🟢 Entrada' : '🔴 Salida'}
                        </span>
                      </td>
                      <td className="text-dark-400">{formatFechaHora(r.fecha_hora)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-5">📋 Registrar Asistencia</h3>
              <form onSubmit={handleCrear} className="space-y-4">
                <div>
                  <label className="input-label">ID Usuario *</label>
                  <input
                    type="number" required min={1}
                    value={formData.id_usuario || ''}
                    onChange={(e) => setFormData({ ...formData, id_usuario: parseInt(e.target.value) || 0 })}
                    className="input-field" placeholder="ID del usuario"
                  />
                </div>
                <div>
                  <label className="input-label">Tipo de Registro *</label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button type="button"
                      onClick={() => setFormData({ ...formData, tipo_registro: 'entrada' })}
                      className={`p-3 rounded-xl text-sm font-semibold transition-all border ${
                        formData.tipo_registro === 'entrada'
                          ? 'bg-accent-emerald/15 border-accent-emerald/30 text-accent-emerald'
                          : 'bg-dark-800/50 border-white/5 text-dark-400 hover:text-dark-200'
                      }`}>
                      🟢 Entrada
                    </button>
                    <button type="button"
                      onClick={() => setFormData({ ...formData, tipo_registro: 'salida' })}
                      className={`p-3 rounded-xl text-sm font-semibold transition-all border ${
                        formData.tipo_registro === 'salida'
                          ? 'bg-accent-amber/15 border-accent-amber/30 text-accent-amber'
                          : 'bg-dark-800/50 border-white/5 text-dark-400 hover:text-dark-200'
                      }`}>
                      🔴 Salida
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Registrando...' : 'Registrar'}
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

export default Asistencia;
