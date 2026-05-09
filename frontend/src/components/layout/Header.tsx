/**
 * Header del panel de administración
 * Muestra el menú mobile, nombre de la sección y estado del API
 */
import { useAuth, ROLE_NAMES } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-dark-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Izquierda - Menú mobile + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-dark-500">🏋️</span>
            <span className="text-dark-400 font-medium">Sistema de Gestión</span>
          </div>
        </div>

        {/* Derecha - Usuario y estado */}
        <div className="flex items-center gap-3">
          {/* Badge del rol */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
              <span className="text-primary-400 text-xs font-semibold">
                {user.nombre} · {ROLE_NAMES[user.rol_id] || 'Usuario'}
              </span>
            </div>
          )}
          {/* Estado del API */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20">
            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-accent-emerald text-xs font-semibold">API Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;