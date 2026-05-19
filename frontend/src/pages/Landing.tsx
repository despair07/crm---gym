/**
 * Landing Page - Gym Popayán, Cauca, Colombia
 * Página pública con planes en COP, clases, ejercicios y testimonios
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { PlanLanding, EjercicioLanding, ClaseLanding, TestimonioLanding } from '../types/api';

/** Formatea precio en pesos colombianos */
const copFormat = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const [planes, setPlanes] = useState<PlanLanding[]>([]);
  const [ejercicios, setEjercicios] = useState<EjercicioLanding[]>([]);
  const [clases, setClases] = useState<ClaseLanding[]>([]);
  const [testimonios, setTestimonios] = useState<TestimonioLanding[]>([]);

  useEffect(() => {
    const load = async () => {
      const [p, e, c, t] = await Promise.allSettled([
        api.get('/api/v1/landing/planes'),
        api.get('/api/v1/landing/ejercicios'),
        api.get('/api/v1/landing/clases'),
        api.get('/api/v1/landing/testimonios'),
      ]);
      if (p.status === 'fulfilled') setPlanes(p.value.data.planes || []);
      if (e.status === 'fulfilled') setEjercicios(e.value.data.ejercicios || []);
      if (c.status === 'fulfilled') setClases(c.value.data.clases || []);
      if (t.status === 'fulfilled') setTestimonios(t.value.data.testimonios || []);
    };
    load();
  }, []);

  const diffIcon = (d: string) =>
    d === 'Principiante' ? '🟢' : d === 'Intermedio' ? '🟡' : '🔴';

  return (
    <div className="landing-page">
      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <div className="landing-logo-icon">G</div>
            <div>
              <span className="landing-logo-text">Gym Popayán</span>
              <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
                📍 Popayán · Colombia
              </span>
            </div>
          </Link>
          <div className="landing-nav-links">
            <a href="#planes">Planes</a>
            <a href="#ejercicios">Ejercicios</a>
            <a href="#clases">Clases</a>
            <a href="#testimonios">Testimonios</a>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost" id="nav-login-btn">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-primary" id="nav-register-btn">Registrarse</Link>
          </div>
          <button className="landing-mobile-menu" onClick={() => {
            document.querySelector('.landing-mobile-dropdown')?.classList.toggle('show');
          }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="landing-mobile-dropdown">
          <a href="#planes">Planes</a>
          <a href="#ejercicios">Ejercicios</a>
          <a href="#clases">Clases</a>
          <a href="#testimonios">Testimonios</a>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing-hero" style={{ position: 'relative' }}>
        <div className="landing-hero-bg" />
        {/* Imagen de fondo del gym */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/img/gym-hero.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.18,
        }} />
        <div className="landing-hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="landing-hero-badge">🏋️ Gym Popayán · La Ciudad Blanca</div>
          <h1 className="landing-hero-title">
            Transforma Tu Cuerpo,<br />
            <span className="landing-hero-gradient">Transforma Tu Vida</span>
          </h1>
          <p className="landing-hero-subtitle">
            El gimnasio más completo de Popayán, Cauca. Equipos premium, entrenadores certificados
            y un ambiente que te motiva a superar tus metas cada día.
          </p>
          <div className="landing-hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
              Comenzar Ahora →
            </Link>
            <a href="#planes" className="btn btn-ghost btn-lg">Ver Planes COP</a>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">500+</span>
              <span className="landing-hero-stat-label">Miembros activos</span>
            </div>
            <div className="landing-hero-stat-divider" />
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">15+</span>
              <span className="landing-hero-stat-label">Entrenadores</span>
            </div>
            <div className="landing-hero-stat-divider" />
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">24/7</span>
              <span className="landing-hero-stat-label">Acceso disponible</span>
            </div>
            <div className="landing-hero-stat-divider" />
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-num">5★</span>
              <span className="landing-hero-stat-label">Calificación</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-section" style={{ paddingTop: '3rem' }}>
        <div className="landing-container">
          <div className="landing-features-grid">
            {[
              { icon: '💪', title: 'Equipos Premium', desc: 'Máquinas de última generación para cada grupo muscular. Popayán al nivel internacional.' },
              { icon: '👨‍🏫', title: 'Entrenadores Certificados', desc: 'Profesionales caucanos dedicados a ayudarte a alcanzar tus metas personales.' },
              { icon: '📊', title: 'Seguimiento Digital', desc: 'Monitorea tu progreso con nuestro sistema CRM. App web accesible desde cualquier dispositivo.' },
              { icon: '🧘', title: 'Clases Grupales', desc: 'Yoga, Spinning, Zumba, Pilates y mucho más. Horarios flexibles para tu agenda.' },
            ].map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES (precios en COP) ── */}
      <section className="landing-section" id="planes">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">💎 Membresías</span>
            <h2>Elige Tu Plan Ideal</h2>
            <p>Planes flexibles en <strong>Pesos Colombianos (COP)</strong> que se adaptan a tu presupuesto</p>
          </div>
          <div className="landing-plans-grid">
            {planes.map((plan) => (
              <div
                key={plan.id}
                className={`landing-plan-card ${plan.popular ? 'popular' : ''}`}
                style={{ '--plan-color': plan.color } as React.CSSProperties}
              >
                {plan.popular && <div className="landing-plan-badge">⭐ Más Popular</div>}
                <h3 className="landing-plan-name">{plan.nombre}</h3>
                <p className="landing-plan-desc">{plan.descripcion}</p>
                <div className="landing-plan-price">
                  <span className="landing-plan-currency" style={{ fontSize: '1rem' }}>COP</span>
                  <span className="landing-plan-amount">
                    {plan.precio_mensual.toLocaleString('es-CO')}
                  </span>
                  <span className="landing-plan-period">/mes</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                  {copFormat(plan.precio_mensual)} · {plan.duracion_dias} días
                </p>
                <ul className="landing-plan-features">
                  {plan.beneficios.map((b, i) => (
                    <li key={i}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn btn-primary landing-plan-btn">
                  Elegir Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EJERCICIOS ── */}
      <section className="landing-section landing-section-alt" id="ejercicios">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">⚡ Entrenamiento</span>
            <h2>Ejercicios Disponibles</h2>
            <p>Variedad de ejercicios para todos los niveles de condición física</p>
          </div>

          {/* Imagen de entrenamiento */}
          <div style={{
            width: '100%', maxHeight: '360px', borderRadius: '20px', overflow: 'hidden',
            marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          }}>
            <img
              src="/img/gym-training.jpeg"
              alt="Entrenamiento en Gym Popayán"
              style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div className="landing-exercises-grid">
            {ejercicios.map((ej) => (
              <div key={ej.id} className="landing-exercise-card">
                <div className="landing-exercise-header">
                  <span className="landing-exercise-muscle">{ej.grupo_muscular}</span>
                  <span className="landing-exercise-diff">{diffIcon(ej.dificultad)} {ej.dificultad}</span>
                </div>
                <h3>{ej.nombre}</h3>
                <p>{ej.descripcion}</p>
                <div className="landing-exercise-footer">
                  <span className="landing-exercise-type">{ej.tipo}</span>
                  <span className="landing-exercise-series">📋 {ej.serie_recomendada}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLASES ── */}
      <section className="landing-section" id="clases">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">🧘 Grupales</span>
            <h2>Clases que Te Encantarán</h2>
            <p>Instructores expertos y horarios flexibles para tu comodidad en Popayán</p>
          </div>
          <div className="landing-classes-grid">
            {clases.map((cl) => (
              <div key={cl.id} className="landing-class-card">
                <div className="landing-class-info">
                  <h3>{cl.nombre}</h3>
                  <p className="landing-class-desc">{cl.descripcion}</p>
                  <div className="landing-class-meta">
                    <span>👤 {cl.instructor}</span>
                    <span>⏱️ {cl.duracion_minutos} min</span>
                    <span>📊 {cl.nivel}</span>
                    <span>👥 {cl.capacidad} cupos</span>
                  </div>
                  <div className="landing-class-schedules">
                    {cl.horarios.map((h, i) => (
                      <span key={i} className="landing-class-schedule-tag">{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="landing-section landing-section-alt" id="testimonios">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">💬 Opiniones</span>
            <h2>Lo Que Dicen Nuestros Miembros</h2>
            <p>Historias reales de popayanejos que transformaron su vida en nuestro gimnasio</p>
          </div>

          {/* Imagen de comunidad */}
          <div style={{
            width: '100%', maxHeight: '340px', borderRadius: '20px', overflow: 'hidden',
            marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          }}>
            <img
              src="/img/gym-community.jpg"
              alt="Comunidad Gym Popayán"
              style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div className="landing-testimonials-grid">
            {testimonios.map((t) => (
              <div key={t.id} className="landing-testimonial-card">
                <div className="landing-testimonial-stars">{'⭐'.repeat(t.calificacion)}</div>
                <p className="landing-testimonial-text">"{t.texto}"</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">{t.cliente.charAt(0)}</div>
                  <div>
                    <strong>{t.cliente}</strong>
                    <span>{t.fecha}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-content">
            <h2>¿Listo Para Tu Transformación en Popayán?</h2>
            <p>Únete hoy al mejor gimnasio del Cauca. Planes desde <strong>$ 80.000 COP / mes</strong>. Sin excusas.</p>
            <div className="landing-cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
                Registrarme Ahora →
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg" id="cta-login-btn">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-grid">
            <div className="landing-footer-brand">
              <div className="landing-logo" style={{ marginBottom: '0.75rem' }}>
                <div className="landing-logo-icon">G</div>
                <span className="landing-logo-text">Gym Popayán</span>
              </div>
              <p>El gimnasio más completo de la Ciudad Blanca. Popayán, Cauca, Colombia.</p>
            </div>
            <div className="landing-footer-col">
              <h4>Contacto</h4>
              <p>📧 info@gympopayan.com.co</p>
              <p>📞 +57 (2) 824 0000</p>
              <p>📱 317 000 0000</p>
              <p>📍 Cra 6 # 5-35, Popayán, Cauca</p>
            </div>
            <div className="landing-footer-col">
              <h4>Horario de Atención</h4>
              <p>Lun – Vie: 06:00 – 22:00</p>
              <p>Sábado: 07:00 – 20:00</p>
              <p>Domingo: 08:00 – 14:00</p>
              <p>🇨🇴 Zona horaria: UTC-5 (Bogotá)</p>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <p>© 2026 Gym Popayán · Popayán, Cauca, Colombia · Todos los derechos reservados · NIT: 123.456.789-0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
