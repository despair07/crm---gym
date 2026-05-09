/**
 * Sidebar de navegación
 * Muestra las secciones según el rol del usuario
 * Incluye info del usuario logueado y botón de logout
 */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, ROLE_NAMES } from '../../context/AuthContext';

// Definición de navegación con roles permitidos
const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    roles: [ROLES.ADMIN, ROLES.ENTRENADOR, ROLES.CLIENTE], // Todos
  },
  {
    name: 'Usuarios',
    href: '/usuarios',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    roles: [ROLES.ADMIN], // Solo admin
  },
  {
    name: 'Membresías',
    href: '/membresias',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    roles: [ROLES.ADMIN], // Solo admin
  },
  {
    name: 'Pagos',
    href: '/pagos',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    roles: [ROLES.ADMIN], // Solo admin
  },
  {
    name: 'Entrenamientos',
    href: '/entrenamientos',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    roles: [ROLES.ADMIN, ROLES.ENTRENADOR], // Admin y entrenadores
  },
  {
    name: 'Asistencia',
    href: '/asistencia',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    roles: [ROLES.ADMIN, ROLES.ENTRENADOR], // Admin y entrenadores
  },
  {
    name: 'Campañas',
    href: '/campanas',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    roles: [ROLES.ADMIN], // Solo admin
  },
  {
    name: 'Seguimiento',
    href: '/seguimiento',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    roles: [ROLES.ADMIN, ROLES.ENTRENADOR], // Admin y entrenadores
  },
  {
    name: 'Mi Perfil',
    href: '/perfil',
    icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    roles: [ROLES.ADMIN, ROLES.ENTRENADOR, ROLES.CLIENTE], // Todos
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  // Filtrar navegación según el rol del usuario
  const filteredNav = navigation.filter((item) =>
    user ? item.roles.some((r) => hasRole(r)) : false
  );

  // Manejar logout
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Color del avatar según el rol
  const avatarGradient = () => {
    if (!user) return 'from-dark-500 to-dark-600';
    switch (user.rol_id) {
      case ROLES.ADMIN: return 'from-accent-violet to-purple-600';
      case ROLES.ENTRENADOR: return 'from-accent-emerald to-green-600';
      case ROLES.CLIENTE: return 'from-accent-cyan to-blue-600';
      default: return 'from-primary-500 to-primary-600';
    }
  };

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-dark-950/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/5 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">CRM Gym</h1>
              <p className="text-[10px] text-dark-400 font-medium tracking-wider uppercase">Panel de Control</p>
            </div>
          </Link>
        </div>

        {/* Navegación - scrollable */}
        <nav className="p-3 space-y-0.5 mt-2 flex-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-2">Menú Principal</p>
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href || (item.href === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-300 shadow-sm shadow-primary-500/5'
                    : 'text-dark-400 hover:bg-white/5 hover:text-dark-200'
                }`}
              >
                <svg
                  className={`mr-3 h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                    isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-dark-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
                </svg>
                {item.name}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-lg shadow-primary-400/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sección inferior - Usuario y logout */}
        <div className="p-4 border-t border-white/5 flex-shrink-0 space-y-2">
          {/* Info del usuario */}
          <div className="glass-card p-3 !rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradient()} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">
                  {user?.nombre?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-dark-200 truncate">{user?.nombre || 'Usuario'}</p>
                <p className="text-[10px] text-dark-500">{user?.rol_id ? ROLE_NAMES[user.rol_id] : 'Sin rol'}</p>
              </div>
            </div>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-dark-400 hover:text-accent-rose hover:bg-accent-rose/10 rounded-xl transition-all duration-200"
            id="logout-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;