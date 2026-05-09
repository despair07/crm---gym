/**
 * Página de Perfil - Visible para todos los roles
 * Admin/Entrenador: su info + accesos rápidos
 * Cliente: su info + membresía activa + historial de entrenamientos
 */
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { membresiaService } from '../services/membresiaService';
import { entrenamientoService } from '../services/entrenamientoService';
import { formatTelCO, formatFecha, formatCOP } from '../utils/format';
import type { UsuarioResponse, MembresiaResponse, EntrenamientoResponse } from '../types/api';

const ROLE_COLORS: Record<number, string> = {
  1: 'from-accent-violet to-purple-600',
  2: 'from-accent-emerald to-green-600',
  3: 'from-accent-cyan to-blue-600',
};

const ROLE_LABELS: Record<number, string> = {
  1: 'Administrador',
  2: 'Entrenador',
  3: 'Cliente',
};

const Perfil = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<UsuarioResponse | null>(null);
  const [membresias, setMembresias] = useState<MembresiaResponse[]>([]);
  const [entrenamientos, setEntrenamientos] = useState<EntrenamientoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<{ nombre: string; telefono: string }>({ nombre: '', telefono: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetches: Promise<any>[] = [usuarioService.obtener(user.id_usuario)];
    if (user.rol_id === 3) {
      fetches.push(membresiaService.listar());
      fetches.push(entrenamientoService.listarPorUsuario(user.id_usuario));
    }
    Promise.allSettled(fetches).then(([p, m, e]) => {
      if (p.status === 'fulfilled') {
        setPerfil(p.value);
        setEditForm({ nombre: p.value.nombre, telefono: p.value.telefono || '' });
      }
      if (m?.status === 'fulfilled') {
        setMembresias((m.value as MembresiaResponse[]).filter(mb => mb.id_usuario === user.id_usuario));
      }
      if (e?.status === 'fulfilled') setEntrenamientos(e.value as EntrenamientoResponse[]);
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await usuarioService.actualizar(user.id_usuario, {
        nombre: editForm.nombre,
        telefono: editForm.telefono || null,
      });
      setMsg('✅ Perfil actualizado');
      setEditMode(false);
      // Refrescar
      const updated = await usuarioService.obtener(user.id_usuario);
      setPerfil(updated);
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg('❌ Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const membresiaActiva = membresias.find(m => m.estado === 'activa');
  const tipoIcons: Record<string, string> = {
    Pesas: '🏋️', Cardio: '🏃', Crossfit: '💪', Yoga: '🧘', Natación: '🏊', Funcional: '🔥',
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="spinner" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Mi Perfil</h1>
            <p>Información personal y configuración de cuenta</p>
          </div>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="btn btn-primary">
              ✏️ Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditMode(false)} className="btn btn-ghost">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                {saving ? 'Guardando...' : '💾 Guardar'}
              </button>
            </div>
          )}
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

        {/* Tarjeta de perfil principal */}
        <div className="card overflow-hidden">
          {/* Banner de color por rol */}
          <div className={`h-24 bg-gradient-to-r ${ROLE_COLORS[user?.rol_id ?? 3]} relative`}>
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end gap-5 -mt-10 mb-5">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${ROLE_COLORS[user?.rol_id ?? 3]} flex items-center justify-center text-3xl font-extrabold text-white border-4 border-dark-900 shadow-xl`}>
                {perfil?.nombre?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-white">{perfil?.nombre}</h2>
                <span className={`badge ${user?.rol_id === 1 ? 'badge-purple' : user?.rol_id === 2 ? 'badge-success' : 'badge-info'}`}>
                  {ROLE_LABELS[user?.rol_id ?? 3]}
                </span>
              </div>
            </div>

            {/* Info del perfil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="input-label">Nombre completo</label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-dark-200 font-medium">{perfil?.nombre || '—'}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="input-label">Correo electrónico</label>
                <p className="text-dark-400">{perfil?.email || '—'}</p>
                <p className="text-[10px] text-dark-600">El correo no se puede cambiar</p>
              </div>

              <div className="space-y-1">
                <label className="input-label">Teléfono Colombia</label>
                {editMode ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">🇨🇴 +57</span>
                    <input
                      type="text"
                      value={editForm.telefono}
                      onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                      className="input-field !pl-16"
                      placeholder="300 000 0000"
                      maxLength={10}
                    />
                  </div>
                ) : (
                  <p className="text-dark-200 font-medium">
                    {perfil?.telefono ? `🇨🇴 +57 ${formatTelCO(perfil.telefono)}` : '—'}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="input-label">Fecha de nacimiento</label>
                <p className="text-dark-400">{formatFecha(perfil?.fecha_nacimiento)}</p>
              </div>

              <div className="space-y-1">
                <label className="input-label">Estado de cuenta</label>
                <span className={`badge ${perfil?.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                  {perfil?.estado || '—'}
                </span>
              </div>

              {perfil?.entrenador_nombre && (
                <div className="space-y-1">
                  <label className="input-label">Entrenador asignado</label>
                  <div className="flex items-center gap-2">
                    <div className="avatar avatar-sm bg-gradient-to-br from-accent-emerald to-green-500 text-white">
                      {perfil.entrenador_nombre.charAt(0)}
                    </div>
                    <p className="text-dark-200 font-medium">{perfil.entrenador_nombre}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Membresía activa (solo clientes) */}
        {user?.rol_id === 3 && (
          <div className={`card p-6 border ${membresiaActiva ? 'border-accent-emerald/30' : 'border-accent-rose/30'}`}>
            <h3 className="text-sm font-bold text-dark-300 uppercase tracking-wider mb-4">🛡️ Mi Membresía</h3>
            {membresiaActiva ? (
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-dark-500">Plan</p>
                  <p className="font-bold text-dark-100 text-lg">{membresiaActiva.nombre_plan || 'Plan activo'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500">Precio</p>
                  <p className="font-bold text-accent-emerald">{formatCOP(membresiaActiva.precio)}<span className="text-dark-500 font-normal text-xs"> /mes</span></p>
                </div>
                <div>
                  <p className="text-xs text-dark-500">Inicio</p>
                  <p className="font-medium text-dark-200">{formatFecha(membresiaActiva.fecha_inicio)}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500">Vence</p>
                  <p className="font-medium text-dark-200">{formatFecha(membresiaActiva.fecha_fin)}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500">Estado</p>
                  <span className="badge badge-success">✅ Activa</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="font-semibold text-dark-200">Sin membresía activa</p>
                  <p className="text-sm text-dark-500">Contacta al administrador para renovar tu membresía</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Entrenamientos recientes (solo clientes) */}
        {user?.rol_id === 3 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-base font-bold text-dark-50">⚡ Mis Últimos Entrenamientos</h3>
              <span className="text-xs text-dark-500">{entrenamientos.length} en total</span>
            </div>
            {entrenamientos.length === 0 ? (
              <div className="p-10 text-center">
                <span className="text-4xl">🏋️</span>
                <p className="text-dark-400 mt-3">No tienes entrenamientos registrados aún</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {entrenamientos.slice(0, 10).map((e) => (
                  <div key={e.id_entrenamiento} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl flex-shrink-0">
                      {tipoIcons[e.tipo_entrenamiento] || '⚡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-100">{e.tipo_entrenamiento}</p>
                      <p className="text-xs text-dark-500">
                        {e.entrenador_nombre ? `Entrenador: ${e.entrenador_nombre}` : 'Sin entrenador asignado'}
                      </p>
                      {e.observaciones && (
                        <p className="text-xs text-dark-600 truncate mt-0.5">{e.observaciones}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {e.duracion_minutos && (
                        <span className="badge badge-info mr-2">{e.duracion_minutos} min</span>
                      )}
                      <span className="text-xs text-dark-500 block mt-1">{formatFecha(e.fecha)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historial de membresías (solo clientes) */}
        {user?.rol_id === 3 && membresias.length > 1 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-base font-bold text-dark-50">📋 Historial de Membresías</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Plan</th><th>Inicio</th><th>Fin</th><th>Precio</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {membresias.map((m) => (
                    <tr key={m.id_membresia}>
                      <td className="font-medium text-dark-200">{m.nombre_plan || `Plan #${m.id_plan}`}</td>
                      <td className="text-dark-400">{formatFecha(m.fecha_inicio)}</td>
                      <td className="text-dark-400">{formatFecha(m.fecha_fin)}</td>
                      <td className="text-accent-emerald font-semibold">{formatCOP(m.precio)}</td>
                      <td>
                        <span className={`badge ${
                          m.estado === 'activa' ? 'badge-success' :
                          m.estado === 'vencida' ? 'badge-warning' : 'badge-danger'
                        }`}>{m.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Perfil;
