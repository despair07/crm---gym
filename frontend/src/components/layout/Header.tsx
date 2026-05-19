/**
 * Header del panel de administración
 * Muestra el menú mobile, nombre de la sección, toggle de tema y estado del API
 */
import { useAuth, ROLE_NAMES } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30"
      style={{ background: 'var(--bg-header)' }}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Izquierda - Menú mobile + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--text-faint)' }}>🏋️</span>
            <span style={{ color: 'var(--text-muted)' }} className="font-medium">Sistema de Gestión</span>
          </div>
        </div>

        {/* Derecha - Toggle tema, Usuario y estado */}
        <div className="flex items-center gap-3">
          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-300 hover:scale-110"
            style={{
              background: theme === 'dark' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)',
              color: theme === 'dark' ? '#fbbf24' : '#6366f1',
              border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
            }}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

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