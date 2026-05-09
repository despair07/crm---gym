// ============================================================
// Tipos de la API - Definiciones de interfaces TypeScript
// ============================================================

// ==================== AUTH ====================

/** Datos para hacer login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Datos para registrarse */
export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  fecha_nacimiento?: string; // YYYY-MM-DD
}

/** Respuesta del servidor al hacer login */
export interface LoginResponse {
  mensaje: string;
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
  rol_id: number;
  access_token: string;
  token_type: string;
}

// ==================== USUARIO ====================

export interface UsuarioBase {
  nombre: string;
  email: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  estado: string;
  id_rol: number;
  id_entrenador?: number | null;
}

export interface UsuarioCreate extends UsuarioBase {
  password: string;
}

export interface UsuarioUpdate {
  nombre?: string | null;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  estado?: string | null;
  id_rol?: number | null;
  id_entrenador?: number | null;
}

export interface UsuarioResponse extends UsuarioBase {
  id_usuario: number;
  rol_nombre?: string;
  entrenador_nombre?: string;
}

// ==================== MEMBRESÍA ====================

export interface MembresiaCreate {
  id_usuario: number;
  id_plan: number;
  fecha_inicio: string;
}

export interface MembresiaResponse {
  id_membresia: number;
  id_usuario: number;
  usuario_nombre?: string;
  id_plan: number;
  nombre_plan?: string;
  precio?: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

// ==================== PAGO ====================

export interface PagoCreate {
  id_membresia: number;
  concepto?: string | null;
  monto: number;
}

export interface PagoResponse {
  id_pago: number;
  id_membresia: number;
  concepto?: string | null;
  monto: number;
  fecha_pago: string;
  id_usuario?: number;
  usuario_nombre?: string;
}

// ==================== ASISTENCIA ====================

export interface AsistenciaCreate {
  id_usuario: number;
  tipo_registro: string;
}

export interface AsistenciaResponse {
  id_asistencia: number;
  id_usuario: number;
  usuario_nombre?: string;
  fecha_hora: string;
  tipo_registro: string;
}

// ==================== ENTRENAMIENTO ====================

export interface EntrenamientoCreate {
  id_usuario: number;
  id_entrenador?: number | null;
  tipo_entrenamiento: string;
  duracion_minutos?: number | null;
  observaciones?: string | null;
  fecha: string;
}

export interface EntrenamientoUpdate {
  id_entrenador?: number | null;
  tipo_entrenamiento?: string | null;
  duracion_minutos?: number | null;
  observaciones?: string | null;
  fecha?: string | null;
}

export interface EntrenamientoResponse {
  id_entrenamiento: number;
  id_usuario: number;
  usuario_nombre?: string;
  id_entrenador?: number | null;
  entrenador_nombre?: string;
  tipo_entrenamiento: string;
  duracion_minutos?: number | null;
  observaciones?: string | null;
  fecha: string;
}

// ==================== CAMPAÑA ====================

export interface CampanaCreate {
  nombre: string;
  descripcion?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: string;
}

export interface CampanaResponse {
  id_campana: number;
  nombre: string;
  descripcion?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: string;
}

export interface CampanaAsignarUsuarios {
  ids_usuarios: number[];
}

// ==================== SEGUIMIENTO ====================

export interface SeguimientoCreate {
  id_usuario: number;
  id_registrado_por?: number | null;
  comentario?: string | null;
  tipo: string;
}

export interface SeguimientoResponse {
  id_seguimiento: number;
  id_usuario: number;
  usuario_nombre?: string;
  id_registrado_por?: number | null;
  registrado_por_nombre?: string;
  fecha: string;
  comentario?: string | null;
  tipo: string;
}

// ==================== LANDING ====================

export interface PlanLanding {
  id: number;
  nombre: string;
  descripcion: string;
  precio_mensual: number;
  duracion_dias: number;
  beneficios: string[];
  color: string;
  popular?: boolean;
}

export interface EjercicioLanding {
  id: number;
  nombre: string;
  tipo: string;
  grupo_muscular: string;
  dificultad: string;
  descripcion: string;
  serie_recomendada: string;
}

export interface ClaseLanding {
  id: number;
  nombre: string;
  instructor: string;
  horarios: string[];
  capacidad: number;
  duracion_minutos: number;
  nivel: string;
  descripcion: string;
}

export interface TestimonioLanding {
  id: number;
  cliente: string;
  calificacion: number;
  texto: string;
  fecha: string;
}