/**
 * Página de Registro
 * Formulario para crear nuevos usuarios (rol Cliente por defecto)
 * Redirige al login después de registro exitoso
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fecha_nacimiento: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Manejar cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Validaciones del formulario
  const validate = (): string | null => {
    if (!form.nombre.trim()) return 'El nombre es requerido';
    if (form.nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (!form.email.trim()) return 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email no válido';
    if (!form.password) return 'La contraseña es requerida';
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        nombre: form.nombre.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        telefono: form.telefono || undefined,
        fecha_nacimiento: form.fecha_nacimiento || undefined,
      });

      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      {/* Panel izquierdo - Branding */}
      <div className="auth-branding">
        <Link to="/" className="auth-back-link">← Volver al inicio</Link>
        <div className="auth-branding-content">
          <div className="auth-branding-icon">💪</div>
          <h1>Únete a FitGym Pro</h1>
          <p>Comienza tu transformación hoy mismo</p>
          <div className="auth-branding-features">
            <div className="auth-branding-feature">
              <span>🎯</span> Registro rápido y sencillo
            </div>
            <div className="auth-branding-feature">
              <span>🏆</span> Acceso inmediato al sistema
            </div>
            <div className="auth-branding-feature">
              <span>📱</span> Seguimiento de tu progreso
            </div>
            <div className="auth-branding-feature">
              <span>🆓</span> Primera semana gratis
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Crear Cuenta</h2>
            <p>Completa tus datos para registrarte como miembro</p>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="alert alert-error" id="register-error">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" id="register-success">
              ✅ ¡Registro exitoso! Redirigiendo al login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="register-form">
            <div className="auth-field">
              <label className="input-label" htmlFor="reg-nombre">Nombre completo *</label>
              <input
                id="reg-nombre"
                type="text"
                name="nombre"
                className="input-field"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={handleChange}
                minLength={3}
                required
              />
            </div>

            <div className="auth-field">
              <label className="input-label" htmlFor="reg-email">Email *</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                className="input-field"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-fields-row">
              <div className="auth-field">
                <label className="input-label" htmlFor="reg-password">Contraseña *</label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
              <div className="auth-field">
                <label className="input-label" htmlFor="reg-confirm">Confirmar contraseña *</label>
                <input
                  id="reg-confirm"
                  type="password"
                  name="confirmPassword"
                  className="input-field"
                  placeholder="Repite la contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="auth-fields-row">
              <div className="auth-field">
                <label className="input-label" htmlFor="reg-telefono">Teléfono</label>
                <input
                  id="reg-telefono"
                  type="tel"
                  name="telefono"
                  className="input-field"
                  placeholder="3001234567"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className="auth-field">
                <label className="input-label" htmlFor="reg-fecha">Fecha de nacimiento</label>
                <input
                  id="reg-fecha"
                  type="date"
                  name="fecha_nacimiento"
                  className="input-field"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading || success}
              id="register-submit-btn"
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-link" id="go-to-login">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
