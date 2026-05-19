/**
 * Dashboard adaptado por rol:
 *  - Admin: estadísticas globales + acciones rápidas + tablas de usuarios y pagos recientes
 *  - Entrenador: su info + lista de clientes asignados
 *  - Cliente: su perfil + sus entrenamientos recientes
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { membresiaService } from '../services/membresiaService';
import { pagoService } from '../services/pagoService';
import { entrenamientoService } from '../services/entrenamientoService';
import { formatCOP, formatTelCO, formatFecha } from '../utils/format';
import type { UsuarioResponse, MembresiaResponse, PagoResponse, EntrenamientoResponse } from '../types/api';

// ──────────────────────────────────────────────
// SUB-DASHBOARD ADMIN
// ──────────────────────────────────────────────
const DashboardAdmin = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [membresias, setMembresias] = useState<MembresiaResponse[]>([]);
  const [pagos, setPagos] = useState<PagoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [u, m, p] = await Promise.allSettled([
        usuarioService.listar(),
        membresiaService.listar(),
        pagoService.listar(),
      ]);
      if (u.status === 'fulfilled') setUsuarios(u.value);
      if (m.status === 'fulfilled') setMembresias(m.value);
      if (p.status === 'fulfilled') setPagos(p.value);
      setLoading(false);
    };
    fetchData();
  }, []);

  const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;
  const membresiasActivas = membresias.filter(m => m.estado === 'activa').length;
  const membresiasVencidas = membresias.filter(m => m.estado === 'vencida').length;
  const ingresosTotales = pagos.reduce((s, p) => s + (p.monto || 0), 0);

  const stats = [
    {
      label: 'Total Usuarios', value: usuarios.length, sub: `${usuariosActivos} activos`,
      color: 'blue', gradient: 'from-primary-500 to-primary-600', link: '/usuarios',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
    {
      label: 'Membresías Activas', value: membresiasActivas, sub: `${membresiasVencidas} vencidas`,
      color: 'green', gradient: 'from-accent-emerald to-green-600', link: '/membresias',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      label: 'Total Pagos', value: pagos.length, sub: 'registrados',
      color: 'amber', gradient: 'from-accent-amber to-orange-500', link: '/pagos',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      label: 'Ingresos Totales', value: formatCOP(ingresosTotales), sub: 'acumulado',
      color: 'purple', gradient: 'from-accent-violet to-purple-600', link: '',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ];

  const quickActions = [
    { label: 'Gestionar Usuarios', href: '/usuarios', icon: '👥' },
    { label: 'Nueva Membresía', href: '/membresias', icon: '🛡️' },
    { label: 'Registrar Pago', href: '/pagos', icon: '💳' },
    { label: 'Entrenamientos', href: '/entrenamientos', icon: '⚡' },
    { label: 'Asistencia', href: '/asistencia', icon: '📋' },
    { label: 'Campañas', href: '/campanas', icon: '📢' },
  ];

  const getRoleBadge = (id: number) =>
    ({ 1: 'badge-purple', 2: 'badge-info', 3: 'badge-success' }[id] ?? 'badge-neutral');
  const getRoleName = (id: number) =>
    ({ 1: 'Admin', 2: 'Entrenador', 3: 'Cliente' }[id] ?? `Rol ${id}`);

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-cyan p-8 shadow-2xl shadow-primary-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Panel de Administración 🏋️
            </h1>
            <p className="text-primary-100 text-lg max-w-xl">
              Visión general del gimnasio. Todo bajo control.
            </p>
          </div>
          <div className="hidden lg:block animate-float">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <span className="text-5xl">💪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const card = (
            <div key={stat.label} className={`stat-card ${stat.color} group cursor-pointer`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{loading ? '—' : stat.value}</p>
              <p className="text-xs text-dark-400 font-medium mt-0.5">{stat.label}</p>
              <p className="text-[11px] text-dark-500 mt-1">{loading ? '' : stat.sub}</p>
            </div>
          );
          return stat.link
            ? <Link to={stat.link} key={stat.label} className="block">{card}</Link>
            : <div key={stat.label}>{card}</div>;
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-base font-bold text-dark-50">⚡ Acciones Rápidas</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.href}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-white/5 hover:border-primary-500/20 transition-all duration-200 group hover:-translate-y-0.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">{a.icon}</span>
                <span className="text-xs font-medium text-dark-300 group-hover:text-white text-center transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Usuarios recientes */}
      {!loading && usuarios.length > 0 && (
        <div className="card animate-slide-up">
          <div className="card-header">
            <h2 className="text-base font-bold text-dark-50">👥 Usuarios Recientes</h2>
            <Link to="/usuarios" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">Ver todos →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr>
                <th>Usuario</th><th>Teléfono</th><th>Rol</th><th>Estado</th>
              </tr></thead>
              <tbody>
                {usuarios.slice(0, 6).map((u) => (
                  <tr key={u.id_usuario}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm bg-gradient-to-br from-primary-500 to-accent-cyan text-white">{u.nombre.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-dark-100">{u.nombre}</p>
                          <p className="text-xs text-dark-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-dark-400">{formatTelCO(u.telefono)}</td>
                    <td><span className={`badge ${getRoleBadge(u.id_rol)}`}>{getRoleName(u.id_rol)}</span></td>
                    <td><span className={`badge ${u.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>{u.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagos recientes */}
      {!loading && pagos.length > 0 && (
        <div className="card animate-slide-up">
          <div className="card-header">
            <h2 className="text-base font-bold text-dark-50">💰 Últimos Pagos</h2>
            <Link to="/pagos" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">Ver todos →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr>
                <th>ID</th><th>Usuario</th><th>Concepto</th><th>Monto</th><th>Fecha</th>
              </tr></thead>
              <tbody>
                {pagos.slice(0, 5).map((p) => (
                  <tr key={p.id_pago}>
                    <td className="font-mono text-dark-400">#{p.id_pago}</td>
                    <td className="text-dark-300">{p.usuario_nombre || `Membresía #${p.id_membresia}`}</td>
                    <td className="text-dark-400">{p.concepto || '—'}</td>
                    <td><span className="font-semibold text-accent-emerald">{formatCOP(p.monto)}</span></td>
                    <td className="text-dark-400">{formatFecha(p.fecha_pago)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// SUB-DASHBOARD ENTRENADOR
// ──────────────────────────────────────────────
const DashboardEntrenador = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carga todos los usuarios y filtra los asignados a este entrenador
    usuarioService.listar(3).then((data) => {
      const misClientes = data.filter((u) => u.id_entrenador === user?.id_usuario);
      setClientes(misClientes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-emerald via-green-500 to-accent-cyan p-8 shadow-2xl shadow-accent-emerald/20">
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">¡Hola, {user?.nombre?.split(' ')[0]}! 👋</h1>
            <p className="text-green-100 text-lg">Panel del Entrenador · Gestiona tus clientes y sesiones</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <span className="text-4xl">🏋️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Entrenamientos', href: '/entrenamientos', icon: '⚡', desc: 'Registrar sesiones', color: 'from-accent-amber to-orange-500' },
          { label: 'Asistencia', href: '/asistencia', icon: '📋', desc: 'Entradas y salidas', color: 'from-accent-cyan to-blue-500' },
          { label: 'Seguimiento', href: '/seguimiento', icon: '📊', desc: 'Progreso de clientes', color: 'from-accent-violet to-purple-600' },
        ].map((a) => (
          <Link key={a.label} to={a.href}
            className="group card p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-white/5 hover:border-primary-500/20">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-2xl">{a.icon}</span>
            </div>
            <div>
              <p className="font-bold text-dark-100">{a.label}</p>
              <p className="text-xs text-dark-400">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mis clientes */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-base font-bold text-dark-50">👥 Mis Clientes Asignados</h2>
          <span className="badge badge-success">{loading ? '...' : `${clientes.length} clientes`}</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner" /></div>
        ) : clientes.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">👤</span>
            <p className="text-dark-400 mt-3 font-medium">No tienes clientes asignados aún</p>
            <p className="text-dark-500 text-sm mt-1">El administrador debe asignarte clientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr>
                <th>Cliente</th><th>Teléfono</th><th>Estado</th><th>Acción</th>
              </tr></thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id_usuario}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm bg-gradient-to-br from-accent-cyan to-blue-500 text-white">{c.nombre.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-dark-100">{c.nombre}</p>
                          <p className="text-xs text-dark-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-dark-400">{formatTelCO(c.telefono)}</td>
                    <td><span className={`badge ${c.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>{c.estado}</span></td>
                    <td>
                      <Link to={`/entrenamientos`}
                        className="action-btn action-btn-edit text-xs">
                        Ver entrenamientos
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// SUB-DASHBOARD CLIENTE
// ──────────────────────────────────────────────
const DashboardCliente = () => {
  const { user } = useAuth();
  const [entrenamientos, setEntrenamientos] = useState<EntrenamientoResponse[]>([]);
  const [membresias, setMembresias] = useState<MembresiaResponse[]>([]);
  const [entrenadorInfo, setEntrenadorInfo] = useState<UsuarioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.allSettled([
      entrenamientoService.listarPorUsuario(user.id_usuario),
      membresiaService.listar(),
      usuarioService.listar(2), // Cargar entrenadores
    ]).then(([e, m, entrenadores]) => {
      if (e.status === 'fulfilled') setEntrenamientos(e.value);
      if (m.status === 'fulfilled')
        setMembresias(m.value.filter((mb) => mb.id_usuario === user.id_usuario));
      // Buscar el entrenador asignado del propio usuario
      if (entrenadores.status === 'fulfilled') {
        // Necesitamos obtener el id_entrenador del usuario
        usuarioService.obtener(user.id_usuario).then((userData) => {
          if (userData.id_entrenador) {
            const miEntrenador = (entrenadores.value as UsuarioResponse[]).find(
              (ent) => ent.id_usuario === userData.id_entrenador
            );
            if (miEntrenador) setEntrenadorInfo(miEntrenador);
          }
        }).catch(() => {});
      }
      setLoading(false);
    });
  }, [user]);

  const tipoIcons: Record<string, string> = {
    Pesas: '🏋️', Cardio: '🏃', Crossfit: '💪', Yoga: '🧘', Natación: '🏊', Funcional: '🔥',
  };

  const membresiaActiva = membresias.find((m) => m.estado === 'activa');

  // Quick action links for client
  const quickActions = [
    { label: 'Mis Entrenamientos', href: '/entrenamientos', icon: '⚡', desc: 'Ver historial', color: 'from-accent-amber to-orange-500' },
    { label: 'Mi Membresía', href: '/membresias', icon: '🛡️', desc: 'Estado y plan', color: 'from-accent-emerald to-green-600' },
    { label: 'Promociones', href: '/campanas', icon: '📢', desc: 'Ofertas del gym', color: 'from-accent-violet to-purple-600' },
    { label: 'Mi Seguimiento', href: '/seguimiento', icon: '📊', desc: 'Progreso personal', color: 'from-accent-cyan to-blue-500' },
  ];

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-cyan via-blue-500 to-primary-600 p-8 shadow-2xl shadow-accent-cyan/20">
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">¡Hola, {user?.nombre?.split(' ')[0]}! 💪</h1>
            <p className="text-blue-100 text-lg">Tu panel personal del gimnasio</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Entrenador asignado */}
      {!loading && (
        <div className="card p-5 border border-primary-500/20" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-emerald to-green-500 flex items-center justify-center text-2xl shadow-lg">
              🏋️
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-faint)' }}>
                Tu Entrenador Asignado
              </p>
              {entrenadorInfo ? (
                <div>
                  <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {entrenadorInfo.nombre}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    📧 {entrenadorInfo.email}
                    {entrenadorInfo.telefono && <span className="ml-3">📱 {entrenadorInfo.telefono}</span>}
                  </p>
                </div>
              ) : (
                <p className="font-medium" style={{ color: 'var(--text-muted)' }}>
                  No tienes un entrenador asignado aún. Contacta al administrador.
                </p>
              )}
            </div>
            {entrenadorInfo && (
              <div className="hidden sm:flex">
                <div className="avatar bg-gradient-to-br from-accent-emerald to-green-500 text-white text-lg w-12 h-12 rounded-xl flex items-center justify-center font-bold">
                  {entrenadorInfo.nombre.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Membresía activa */}
      {!loading && (
        <div className={`card p-6 border ${membresiaActiva ? 'border-accent-emerald/30' : 'border-accent-rose/30'}`}
          style={{ background: membresiaActiva ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)' }}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${membresiaActiva ? 'bg-accent-emerald/20' : 'bg-accent-rose/20'}`}>
              {membresiaActiva ? '✅' : '⚠️'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {membresiaActiva ? `Membresía ${membresiaActiva.nombre_plan || 'Activa'}` : 'Sin membresía activa'}
              </p>
              {membresiaActiva && (
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Válida hasta: <span className="text-accent-emerald font-semibold">{formatFecha(membresiaActiva.fecha_fin)}</span>
                  {membresiaActiva.precio && (
                    <span className="ml-3" style={{ color: 'var(--text-faint)' }}>· {formatCOP(membresiaActiva.precio)} / mes</span>
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

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link key={a.label} to={a.href}
            className="group card p-4 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-white/5 hover:border-primary-500/20 text-center">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-2xl">{a.icon}</span>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>{a.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card blue">
          <p className="text-3xl font-extrabold text-white">{loading ? '—' : entrenamientos.length}</p>
          <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Entrenamientos totales</p>
        </div>
        <div className="stat-card green">
          <p className="text-3xl font-extrabold text-white">{loading ? '—' : membresias.length}</p>
          <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Membresías históricas</p>
        </div>
        <div className="stat-card amber">
          <p className="text-3xl font-extrabold text-white">
            {loading ? '—' : entrenamientos.filter(e => {
              const d = new Date(e.fecha);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Entrenamientos este mes</p>
        </div>
      </div>

      {/* Entrenamientos recientes */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>⚡ Mis Entrenamientos Recientes</h2>
          <Link to="/entrenamientos" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">Ver todos →</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner" /></div>
        ) : entrenamientos.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">🏋️</span>
            <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Aún no tienes entrenamientos registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {entrenamientos.slice(0, 8).map((e) => (
              <div key={e.id_entrenamiento} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent-amber/15 flex items-center justify-center text-xl flex-shrink-0">
                  {tipoIcons[e.tipo_entrenamiento] || '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{e.tipo_entrenamiento}</p>
                  {e.entrenador_nombre && (
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>🏋️ {e.entrenador_nombre}</p>
                  )}
                  {e.observaciones && (
                    <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{e.observaciones}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {e.duracion_minutos && (
                    <span className="badge badge-info mr-2">{e.duracion_minutos} min</span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatFecha(e.fecha)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// DASHBOARD PRINCIPAL (selecciona por rol)
// ──────────────────────────────────────────────
const Dashboard = () => {
  const { isAdmin, isEntrenador, isCliente } = useAuth();

  return (
    <Layout>
      {isAdmin && <DashboardAdmin />}
      {isEntrenador && <DashboardEntrenador />}
      {isCliente && <DashboardCliente />}
    </Layout>
  );
};

export default Dashboard;