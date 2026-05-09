/**
 * Login - Gym Popayán
 * Autenticación con JWT, localización colombiana
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login({ email: form.email, password: form.password });
      login(response);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail || 'Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email: string) => setForm({ email, password: '123456' });

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      {/* Panel izquierdo – Branding Popayán */}
      <div className="auth-branding">
        <Link to="/" className="auth-back-link">← Volver al inicio</Link>
        <div className="auth-branding-content">
          <div className="auth-branding-icon">🏋️</div>
          <h1>Gym Popayán</h1>
          <p className="text-sm opacity-80 mb-1">📍 Popayán, Cauca · Colombia</p>
          <p className="text-xs opacity-60 mb-6">Sistema CRM de Gestión Integral</p>
          <div className="auth-branding-features">
            <div className="auth-branding-feature"><span>✅</span> Gestión de membresías (COP)</div>
            <div className="auth-branding-feature"><span>✅</span> Control de asistencia</div>
            <div className="auth-branding-feature"><span>✅</span> Entrenamientos personalizados</div>
            <div className="auth-branding-feature"><span>✅</span> Seguimiento de clientes</div>
            <div className="auth-branding-feature"><span>✅</span> Campañas de marketing</div>
          </div>

          {/* Info local */}
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>🇨🇴 Colombia · Zona horaria</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>America/Bogota (UTC-5)</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Moneda: Peso Colombiano (COP $)</p>
          </div>
        </div>
      </div>

      {/* Panel derecho – Formulario */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
              }}>🏋️</div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Iniciar Sesión</h2>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.5 }}>Gym Popayán · Sistema CRM</p>
              </div>
            </div>
            <p>Ingresa tus credenciales para acceder al panel</p>
          </div>

          {error && (
            <div className="alert alert-error" id="login-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="login-form">
            <div className="auth-field">
              <label className="input-label" htmlFor="login-email">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="input-field"
                placeholder="correo@gympopayan.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="input-label" htmlFor="login-password">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  minLength={6}
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.4)', padding: '4px'
                  }}
                  title={showPass ? 'Ocultar' : 'Mostrar'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <><span className="auth-spinner" />Ingresando...</>
              ) : (
                '🔐 Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link" id="go-to-register">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Accesos rápidos de demo */}
          <div className="auth-demo">
            <p className="auth-demo-title">🔑 Acceso rápido (demo · contraseña: 123456)</p>
            <div className="auth-demo-credentials">
              <button type="button" className="auth-demo-btn" onClick={() => quickLogin('admin@gym.com')}>
                <span className="auth-demo-role">👑 Admin</span>
                <span className="auth-demo-email">admin@gym.com</span>
              </button>
              <button type="button" className="auth-demo-btn" onClick={() => quickLogin('trainer1@gym.com')}>
                <span className="auth-demo-role">🏋️ Entrenador</span>
                <span className="auth-demo-email">trainer1@gym.com</span>
              </button>
              <button type="button" className="auth-demo-btn" onClick={() => quickLogin('juan@gym.com')}>
                <span className="auth-demo-role">👤 Cliente</span>
                <span className="auth-demo-email">juan@gym.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;