/**
 * Entrenamientos - Versión mejorada con lógica por rol
 *
 * ADMIN: lista todos los usuarios → selecciona uno → ve sus entrenamientos
 * ENTRENADOR: ve sus clientes asignados → selecciona uno → ve entrenamientos del cliente
 * CLIENTE: ve directamente sus propios entrenamientos
 */
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { entrenamientoService } from '../services/entrenamientoService';
import { usuarioService } from '../services/usuarioService';
import { formatFecha } from '../utils/format';
import type { EntrenamientoResponse, EntrenamientoCreate, UsuarioResponse } from '../types/api';

const tipoIcons: Record<string, string> = {
  Pesas: '🏋️', Cardio: '🏃', Crossfit: '💪', Yoga: '🧘',
  Natación: '🏊', Funcional: '🔥',
};

const Entrenamientos = () => {
  const { user, isAdmin, isEntrenador, isCliente } = useAuth();

  // Lista de clientes/usuarios disponibles para seleccionar (admin y entrenador)
  const [clientes, setClientes] = useState<UsuarioResponse[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<UsuarioResponse | null>(null);

  // Entrenamientos del usuario seleccionado (o del cliente propio)
  const [entrenamientos, setEntrenamientos] = useState<EntrenamientoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchCliente, setSearchCliente] = useState('');

  const [formData, setFormData] = useState<EntrenamientoCreate>({
    id_usuario: 0,
    tipo_entrenamiento: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  // ── Carga inicial según rol ────────────────────────────────
  useEffect(() => {
    if (isCliente && user) {
      // Cliente: carga sus propios entrenamientos directamente
      cargarEntrenamientos(user.id_usuario);
    } else {
      // Admin y Entrenador: carga lista de clientes
      cargarClientes();
    }
  }, [user]);

  const cargarClientes = async () => {
    setLoadingClientes(true);
    try {
      const todos = await usuarioService.listar(3); // solo rol=3 (clientes)
      if (isEntrenador && user) {
        // Entrenador: solo sus clientes asignados
        setClientes(todos.filter((c) => c.id_entrenador === user.id_usuario));
      } else {
        setClientes(todos);
      }
    } catch {
      setError('Error al cargar la lista de clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  const cargarEntrenamientos = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await entrenamientoService.listarPorUsuario(id);
      setEntrenamientos(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar entrenamientos');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCliente = (cliente: UsuarioResponse) => {
    setClienteSeleccionado(cliente);
    setFormData((f) => ({ ...f, id_usuario: cliente.id_usuario }));
    cargarEntrenamientos(cliente.id_usuario);
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const id = isCliente ? user!.id_usuario : clienteSeleccionado?.id_usuario ?? formData.id_usuario;
    try {
      await entrenamientoService.crear({
        ...formData,
        id_usuario: id,
        id_entrenador: (isAdmin || isEntrenador) ? user?.id_usuario : formData.id_entrenador,
      });
      setShowModal(false);
      setSuccess('✅ Entrenamiento creado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      cargarEntrenamientos(id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear entrenamiento');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este entrenamiento?')) return;
    const userId = isCliente ? user!.id_usuario : clienteSeleccionado?.id_usuario ?? 0;
    try {
      await entrenamientoService.eliminar(id);
      setSuccess('✅ Entrenamiento eliminado');
      setTimeout(() => setSuccess(null), 3000);
      if (userId) cargarEntrenamientos(userId);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar');
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.email.toLowerCase().includes(searchCliente.toLowerCase())
  );

  // ── RENDER ────────────────────────────────────────────────
  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Entrenamientos</h1>
            <p>
              {isCliente
                ? 'Tus sesiones de entrenamiento'
                : clienteSeleccionado
                  ? `Sesiones de ${clienteSeleccionado.nombre}`
                  : 'Selecciona un cliente para ver sus entrenamientos'}
            </p>
          </div>
          {/* Botón crear: siempre visible para admin/entrenador con cliente seleccionado, o para cliente */}
          {(isCliente || clienteSeleccionado) && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Entrenamiento
            </button>
          )}
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* ── Selector de clientes (Admin / Entrenador) ── */}
        {!isCliente && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-bold text-dark-200">
                {isEntrenador ? '👥 Mis Clientes' : '👥 Seleccionar Cliente'}
              </h2>
              {clienteSeleccionado && (
                <button
                  onClick={() => { setClienteSeleccionado(null); setEntrenamientos([]); }}
                  className="text-xs text-dark-500 hover:text-dark-300 transition-colors"
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
                <p className="text-dark-400 mt-2 text-sm">
                  {isEntrenador
                    ? 'No tienes clientes asignados. Pide al administrador que te asigne clientes.'
                    : 'No hay clientes registrados.'}
                </p>
              </div>
            ) : !clienteSeleccionado ? (
              <div className="p-4 space-y-3">
                {/* Búsqueda */}
                <div className="flex items-center gap-2 bg-dark-800/50 border border-white/5 rounded-xl px-3 py-2">
                  <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchCliente}
                    onChange={(e) => setSearchCliente(e.target.value)}
                    className="bg-transparent border-0 outline-none text-sm text-dark-200 placeholder-dark-500 flex-1"
                  />
                  <span className="text-xs text-dark-600">{clientesFiltrados.length}</span>
                </div>

                {/* Grid de tarjetas de cliente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {clientesFiltrados.map((c) => (
                    <button
                      key={c.id_usuario}
                      onClick={() => seleccionarCliente(c)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/30 hover:bg-dark-800 transition-all duration-200 text-left group"
                    >
                      <div className="avatar avatar-sm bg-gradient-to-br from-accent-cyan to-blue-500 text-white flex-shrink-0">
                        {c.nombre.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark-100 text-sm truncate group-hover:text-white transition-colors">
                          {c.nombre}
                        </p>
                        <p className="text-xs text-dark-500 truncate">{c.email}</p>
                      </div>
                      <svg className="w-4 h-4 text-dark-600 group-hover:text-primary-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Cliente seleccionado - banner */
              <div className="p-4 flex items-center gap-4">
                <div className="avatar bg-gradient-to-br from-accent-cyan to-blue-500 text-white">
                  {clienteSeleccionado.nombre.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-dark-100">{clienteSeleccionado.nombre}</p>
                  <p className="text-xs text-dark-500">{clienteSeleccionado.email}</p>
                </div>
                <span className={`badge ml-auto ${clienteSeleccionado.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                  {clienteSeleccionado.estado}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Lista de Entrenamientos ── */}
        {(isCliente || clienteSeleccionado) && (
          <>
            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-sm font-bold text-dark-200">
                    ⚡ {entrenamientos.length} Entrenamiento{entrenamientos.length !== 1 ? 's' : ''}
                  </h2>
                  {/* Stats rápidos */}
                  {entrenamientos.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-dark-500">
                        {entrenamientos.reduce((s, e) => s + (e.duracion_minutos ?? 0), 0)} min totales
                      </span>
                    </div>
                  )}
                </div>

                {entrenamientos.length === 0 ? (
                  <div className="p-12 text-center">
                    <span className="text-4xl">🏋️</span>
                    <p className="text-dark-400 mt-3">No hay entrenamientos registrados</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4 text-sm">
                      + Registrar primer entrenamiento
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tipo</th>
                          <th>Duración</th>
                          <th>Entrenador</th>
                          <th>Fecha</th>
                          <th>Observaciones</th>
                          {(isAdmin || isEntrenador) && <th className="text-right">Acciones</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {entrenamientos.map((e) => (
                          <tr key={e.id_entrenamiento}>
                            <td className="font-mono text-dark-500 text-xs">#{e.id_entrenamiento}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{tipoIcons[e.tipo_entrenamiento] || '⚡'}</span>
                                <span className="font-medium text-dark-200">{e.tipo_entrenamiento}</span>
                              </div>
                            </td>
                            <td>
                              {e.duracion_minutos
                                ? <span className="badge badge-info">{e.duracion_minutos} min</span>
                                : <span className="text-dark-600">—</span>}
                            </td>
                            <td>
                              {e.entrenador_nombre
                                ? <div className="flex items-center gap-2">
                                    <div className="avatar avatar-sm bg-gradient-to-br from-accent-emerald to-green-500 text-white text-xs">
                                      {e.entrenador_nombre.charAt(0)}
                                    </div>
                                    <span className="text-dark-300 text-sm">{e.entrenador_nombre}</span>
                                  </div>
                                : <span className="text-dark-600">—</span>}
                            </td>
                            <td className="text-dark-400">{formatFecha(e.fecha)}</td>
                            <td className="text-dark-500 max-w-[180px] truncate text-sm">
                              {e.observaciones || '—'}
                            </td>
                            {(isAdmin || isEntrenador) && (
                              <td className="text-right">
                                <button
                                  onClick={() => handleEliminar(e.id_entrenamiento)}
                                  className="action-btn action-btn-delete"
                                >
                                  Eliminar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Modal crear entrenamiento ── */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-1">⚡ Nuevo Entrenamiento</h3>
              {clienteSeleccionado && (
                <p className="text-sm text-dark-400 mb-5">Cliente: <span className="text-dark-200 font-medium">{clienteSeleccionado.nombre}</span></p>
              )}
              <form onSubmit={handleCrear} className="space-y-4">
                <div>
                  <label className="input-label">Tipo de Entrenamiento *</label>
                  <select
                    value={formData.tipo_entrenamiento}
                    onChange={(e) => setFormData({ ...formData, tipo_entrenamiento: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Pesas">🏋️ Pesas</option>
                    <option value="Cardio">🏃 Cardio</option>
                    <option value="Crossfit">💪 Crossfit</option>
                    <option value="Yoga">🧘 Yoga</option>
                    <option value="Natación">🏊 Natación</option>
                    <option value="Funcional">🔥 Funcional</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Duración (min)</label>
                    <input
                      type="number" min={1}
                      value={formData.duracion_minutos || ''}
                      onChange={(e) => setFormData({ ...formData, duracion_minutos: parseInt(e.target.value) || undefined })}
                      className="input-field"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label className="input-label">Fecha *</label>
                    <input
                      type="date" required
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Observaciones</label>
                  <textarea
                    value={formData.observaciones || ''}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Notas sobre el entrenamiento, progreso del cliente..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Creando...' : 'Crear Entrenamiento'}
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

export default Entrenamientos;
