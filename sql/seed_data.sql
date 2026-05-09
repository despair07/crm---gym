-- ============================================================
-- DATOS DE EJEMPLO PARA GIMNASIO CRM
-- Ejecutar DESPUÉS de crear tablas, procedimientos y triggers
-- NOTA: La contraseña de todos los usuarios es: 123456
-- Hash bcrypt: $2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS
-- ============================================================

USE gimnasio;

-- ===============================
-- 1. USUARIOS (15 total)
-- Roles: 1=Administrador, 2=Entrenador, 3=Cliente
-- Contraseña para todos: 123456
-- ===============================

INSERT INTO usuarios (nombre, email, password, telefono, fecha_nacimiento, estado, id_rol, id_entrenador) VALUES
-- Admin
('Admin Principal', 'admin@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3000000000', '1990-01-01', 'activo', 1, NULL),

-- Entrenadores
('Carlos Trainer', 'trainer1@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3001111111', '1985-05-10', 'activo', 2, NULL),
('Laura Trainer', 'trainer2@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3002222222', '1992-07-15', 'activo', 2, NULL),
('Andrés Coach', 'andres.coach@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3003333333', '1988-11-20', 'activo', 2, NULL),

-- Clientes
('Juan Perez', 'juan@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3011111111', '2000-03-20', 'activo', 3, 2),
('Maria Lopez', 'maria@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3022222222', '1998-08-25', 'activo', 3, 2),
('Pedro Gomez', 'pedro@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3033333333', '1995-11-30', 'activo', 3, 3),
('Ana Rodriguez', 'ana.rodriguez@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3044444444', '1997-04-12', 'activo', 3, 2),
('Santiago Martinez', 'santiago.m@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3055555555', '2001-06-18', 'activo', 3, 3),
('Camila Fernandez', 'camila.f@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3066666666', '1999-09-05', 'activo', 3, 4),
('Diego Ramirez', 'diego.r@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3077777777', '1996-12-28', 'inactivo', 3, 2),
('Valentina Herrera', 'vale.h@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3088888888', '2002-02-14', 'activo', 3, 3),
('Mateo Castro', 'mateo.c@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3099999999', '1994-07-22', 'activo', 3, 4),
('Isabella Torres', 'isa.torres@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3100000001', '2003-01-30', 'activo', 3, 2),
('Luis Mendoza', 'luis.m@gym.com', '$2b$12$vUg5OBhEaU/QuM0L3Kd66eGsR8Soeqi19YtLeQMLuauccSQFXZLLS', '3100000002', '1993-10-08', 'inactivo', 3, 3);


-- ===============================
-- 2. PLANES
-- ===============================

INSERT INTO planes (nombre_plan, precio, duracion_dias) VALUES
('Mensual', 80000, 30),
('Trimestral', 210000, 90),
('Anual', 650000, 365);


-- ===============================
-- 3. MEMBRESIAS (más variedad)
-- ===============================

INSERT INTO membresias (id_usuario, id_plan, fecha_inicio, fecha_fin, estado) VALUES
(5, 1, '2026-04-01', '2026-05-01', 'activa'),
(6, 2, '2026-03-01', '2026-06-01', 'activa'),
(7, 1, '2026-03-15', '2026-04-15', 'vencida'),
(8, 3, '2026-01-10', '2027-01-10', 'activa'),
(9, 1, '2026-04-15', '2026-05-15', 'activa'),
(10, 2, '2026-02-01', '2026-05-01', 'activa'),
(11, 1, '2026-01-01', '2026-02-01', 'vencida'),
(12, 1, '2026-04-20', '2026-05-20', 'activa'),
(13, 3, '2026-03-01', '2027-03-01', 'activa'),
(14, 1, '2026-04-25', '2026-05-25', 'activa'),
(15, 1, '2025-12-01', '2026-01-01', 'cancelada');


-- ===============================
-- 4. PAGOS (más registros)
-- ===============================

INSERT INTO pagos (id_membresia, concepto, monto, fecha_pago) VALUES
(1, 'Pago mensual abril', 80000, '2026-04-01'),
(2, 'Pago trimestral', 210000, '2026-03-01'),
(3, 'Pago mensual marzo', 80000, '2026-03-15'),
(4, 'Pago plan anual', 650000, '2026-01-10'),
(5, 'Pago mensual abril', 80000, '2026-04-15'),
(6, 'Pago trimestral', 210000, '2026-02-01'),
(7, 'Pago mensual enero', 80000, '2026-01-01'),
(8, 'Pago mensual abril', 80000, '2026-04-20'),
(9, 'Pago plan anual', 650000, '2026-03-01'),
(10, 'Pago mensual abril', 80000, '2026-04-25'),
(11, 'Pago mensual diciembre', 80000, '2025-12-01'),
(1, 'Inscripción inicial', 50000, '2026-04-01'),
(5, 'Clase personalizada', 35000, '2026-04-20');


-- ===============================
-- 5. ASISTENCIA (más registros)
-- ===============================

INSERT INTO asistencia (id_usuario, fecha_hora, tipo_registro) VALUES
(5, '2026-04-28 06:30:00', 'entrada'),
(5, '2026-04-28 08:15:00', 'salida'),
(6, '2026-04-28 07:00:00', 'entrada'),
(6, '2026-04-28 08:45:00', 'salida'),
(8, '2026-04-28 16:00:00', 'entrada'),
(8, '2026-04-28 17:30:00', 'salida'),
(9, '2026-04-29 06:15:00', 'entrada'),
(9, '2026-04-29 07:45:00', 'salida'),
(10, '2026-04-29 09:00:00', 'entrada'),
(12, '2026-04-29 17:00:00', 'entrada'),
(12, '2026-04-29 18:30:00', 'salida'),
(5, '2026-04-30 06:30:00', 'entrada'),
(6, '2026-04-30 07:15:00', 'entrada'),
(13, '2026-04-30 08:00:00', 'entrada'),
(14, '2026-04-30 09:30:00', 'entrada');


-- ===============================
-- 6. ENTRENAMIENTOS (más registros)
-- ===============================

INSERT INTO entrenamientos (id_usuario, id_entrenador, tipo_entrenamiento, duracion_minutos, observaciones, fecha) VALUES
(5, 2, 'Pesas', 60, 'Entrenamiento de fuerza, press de banca y sentadillas', '2026-04-28'),
(6, 2, 'Cardio', 45, 'Trote en cinta 30 min + bicicleta 15 min', '2026-04-28'),
(7, 3, 'Crossfit', 50, 'WOD: Alta intensidad, 5 rondas', '2026-04-28'),
(8, 2, 'Pesas', 75, 'Día de pierna: Sentadillas, prensa, extensiones', '2026-04-28'),
(9, 3, 'Funcional', 40, 'Circuito con kettlebells y TRX', '2026-04-29'),
(10, 4, 'Yoga', 60, 'Clase de yoga Vinyasa', '2026-04-29'),
(12, 3, 'Cardio', 30, 'HIIT en bicicleta estática', '2026-04-29'),
(5, 2, 'Pesas', 65, 'Día de espalda y bíceps', '2026-04-29'),
(13, 4, 'Crossfit', 55, 'Metcon: Thrusters + pull-ups', '2026-04-30'),
(14, 2, 'Funcional', 45, 'Entrenamiento de core y estabilidad', '2026-04-30'),
(6, 2, 'Pesas', 70, 'Día de hombros y tríceps', '2026-04-30');


-- ===============================
-- 7. NOTIFICACIONES (más registros)
-- ===============================

INSERT INTO notificaciones (id_usuario, mensaje, tipo, fecha_notificacion, leida) VALUES
(5, 'Bienvenido al gimnasio, Juan!', 'sistema', '2026-04-01 10:00:00', 1),
(6, 'Tu membresía trimestral está activa', 'membresia', '2026-03-01 09:00:00', 1),
(7, 'Tu membresía ha vencido. ¡Renueva ahora!', 'alerta', '2026-04-16 08:00:00', 0),
(8, 'Felicidades! Tu plan anual está activo', 'membresia', '2026-01-10 10:00:00', 1),
(9, 'Nuevo entrenamiento programado para mañana', 'sistema', '2026-04-28 18:00:00', 0),
(10, 'Recuerda tu clase de yoga mañana a las 9:00', 'recordatorio', '2026-04-28 20:00:00', 0),
(11, 'Tu membresía ha vencido. Contáctanos para renovar', 'alerta', '2026-02-02 08:00:00', 0),
(12, 'Bienvenida Valentina! Tu plan mensual está activo', 'sistema', '2026-04-20 10:00:00', 1),
(5, 'Hoy es día de espalda y bíceps. ¡A entrenar!', 'recordatorio', '2026-04-29 06:00:00', 1),
(13, 'Tu progreso ha mejorado un 15% este mes', 'seguimiento', '2026-04-25 12:00:00', 0);


-- ===============================
-- 8. CAMPAÑAS (más campañas)
-- ===============================

INSERT INTO campanas (nombre, descripcion, fecha_inicio, fecha_fin, estado) VALUES
('Promo Abril', 'Descuento del 10% en plan mensual para nuevos clientes', '2026-04-01', '2026-04-30', 'activa'),
('Promo Verano', 'Clases grupales gratis con cualquier membresía', '2026-06-01', '2026-06-30', 'activa'),
('Black Friday Gym', 'Hasta 40% de descuento en planes anuales', '2026-11-25', '2026-11-30', 'activa'),
('Reto 30 Días', 'Desafío de transformación corporal. Premios para los 3 primeros', '2026-05-01', '2026-05-31', 'activa'),
('Referidos Mayo', 'Trae un amigo y obtén 1 mes gratis', '2026-05-01', '2026-05-31', 'activa');


-- ===============================
-- 9. USUARIO_CAMPAÑA (más asignaciones)
-- ===============================

INSERT INTO usuario_campana (id_usuario, id_campana, estado) VALUES
(5, 1, 'enviado'),
(6, 1, 'enviado'),
(7, 2, 'enviado'),
(8, 1, 'visto'),
(9, 1, 'respondido'),
(10, 2, 'enviado'),
(12, 4, 'enviado'),
(13, 4, 'visto'),
(14, 5, 'enviado'),
(5, 4, 'respondido'),
(6, 5, 'enviado');


-- ===============================
-- 10. SEGUIMIENTO CLIENTE (más registros)
-- ===============================

INSERT INTO seguimiento_cliente (id_usuario, id_registrado_por, comentario, tipo) VALUES
(5, 2, 'Buen progreso en entrenamiento de fuerza. Aumentar peso en press de banca.', 'evaluacion'),
(6, 2, 'Debe mejorar resistencia cardiovascular. Recomendar más sesiones de cardio.', 'seguimiento'),
(7, 3, 'Cliente inactivo desde hace 2 semanas. Llamar para seguimiento.', 'alerta'),
(8, 2, 'Excelente dedicación. Asiste 5 veces por semana.', 'evaluacion'),
(9, 3, 'Primer mes completado. Buena adaptación al entrenamiento funcional.', 'seguimiento'),
(10, 4, 'Interesada en clases de yoga avanzado. Programar evaluación.', 'nota'),
(11, 2, 'Membresía vencida. Intentar contacto para renovación.', 'alerta'),
(12, 3, 'Nuevo cliente. Realizar evaluación física inicial.', 'nota'),
(13, 4, 'Progreso notable en crossfit. Considerar para competencias.', 'evaluacion'),
(5, 2, 'Revisión de rutina semanal. Ajustar volumen de entrenamiento.', 'seguimiento'),
(6, 2, 'Llamada de seguimiento - Confirma asistencia regular', 'llamada');