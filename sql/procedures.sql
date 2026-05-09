USE gimnasio;

DELIMITER //

-- ============================================================
-- PROCEDIMIENTOS ALMACENADOS PARA GIMNASIO CRM
-- ============================================================

-- ===============================
-- 1. USUARIOS
-- ===============================

CREATE PROCEDURE sp_login_usuario(
    IN p_email VARCHAR(120),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT u.id_usuario, u.nombre, u.email, u.telefono, u.fecha_nacimiento,
           u.estado, u.id_rol, r.nombre as rol_nombre, u.id_entrenador
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.email = p_email AND u.password = p_password AND u.estado = 'activo';
END //

-- Obtener usuario por email (para autenticación con bcrypt)
CREATE PROCEDURE sp_obtener_usuario_por_email(
    IN p_email VARCHAR(120)
)
BEGIN
    SELECT u.id_usuario, u.nombre, u.email, u.password, u.telefono, 
           u.fecha_nacimiento, u.estado, u.id_rol, r.nombre as rol_nombre, 
           u.id_entrenador
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.email = p_email;
END //

CREATE PROCEDURE sp_crear_usuario(
    IN p_nombre VARCHAR(120),
    IN p_email VARCHAR(120),
    IN p_password VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_estado VARCHAR(20),
    IN p_id_rol INT,
    IN p_id_entrenador INT
)
BEGIN
    INSERT INTO usuarios (nombre, email, password, telefono, fecha_nacimiento, estado, id_rol, id_entrenador)
    VALUES (p_nombre, p_email, p_password, p_telefono, p_fecha_nacimiento, p_estado, p_id_rol, p_id_entrenador);

    SELECT LAST_INSERT_ID() as id_usuario;
END //

CREATE PROCEDURE sp_listar_usuarios(
    IN p_id_rol INT,
    IN p_estado VARCHAR(20)
)
BEGIN
    SELECT u.id_usuario, u.nombre, u.email, u.telefono, u.fecha_nacimiento,
           u.estado, u.id_rol, r.nombre as rol_nombre, u.id_entrenador,
           e.nombre as entrenador_nombre
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    LEFT JOIN usuarios e ON u.id_entrenador = e.id_usuario
    WHERE (p_id_rol IS NULL OR u.id_rol = p_id_rol)
      AND (p_estado IS NULL OR u.estado = p_estado)
    ORDER BY u.nombre;
END //

CREATE PROCEDURE sp_obtener_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT u.id_usuario, u.nombre, u.email, u.telefono, u.fecha_nacimiento,
           u.estado, u.id_rol, r.nombre as rol_nombre, u.id_entrenador,
           e.nombre as entrenador_nombre
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    LEFT JOIN usuarios e ON u.id_entrenador = e.id_usuario
    WHERE u.id_usuario = p_id_usuario;
END //

CREATE PROCEDURE sp_actualizar_usuario(
    IN p_id_usuario INT,
    IN p_nombre VARCHAR(120),
    IN p_telefono VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_estado VARCHAR(20),
    IN p_id_rol INT,
    IN p_id_entrenador INT
)
BEGIN
    UPDATE usuarios
    SET nombre = p_nombre,
        telefono = p_telefono,
        fecha_nacimiento = p_fecha_nacimiento,
        estado = p_estado,
        id_rol = p_id_rol,
        id_entrenador = p_id_entrenador
    WHERE id_usuario = p_id_usuario;
    
    SELECT ROW_COUNT() as filas_actualizadas;
END //

CREATE PROCEDURE sp_eliminar_usuario(
    IN p_id_usuario INT
)
BEGIN
    UPDATE usuarios SET estado = 'inactivo' WHERE id_usuario = p_id_usuario;
    
    SELECT ROW_COUNT() as filas_eliminadas;
END //

-- ===============================
-- 2. MEMBRESIAS
-- ===============================

CREATE PROCEDURE sp_crear_membresia(
    IN p_id_usuario INT,
    IN p_id_plan INT,
    IN p_fecha_inicio DATE
)
BEGIN
    DECLARE v_duracion_dias INT;
    DECLARE v_fecha_fin DATE;

    -- Obtener duración del plan
    SELECT duracion_dias INTO v_duracion_dias
    FROM planes WHERE id_plan = p_id_plan;

    -- Calcular fecha fin
    SET v_fecha_fin = DATE_ADD(p_fecha_inicio, INTERVAL v_duracion_dias DAY);

    -- Crear membresía
    INSERT INTO membresias (id_usuario, id_plan, fecha_inicio, fecha_fin, estado)
    VALUES (p_id_usuario, p_id_plan, p_fecha_inicio, v_fecha_fin, 'activa');

    SELECT LAST_INSERT_ID() as id_membresia;
END //

CREATE PROCEDURE sp_listar_membresias(
    IN p_estado VARCHAR(20)
)
BEGIN
    SELECT m.id_membresia, m.id_usuario, u.nombre as usuario_nombre,
           m.id_plan, p.nombre_plan, p.precio, m.fecha_inicio, m.fecha_fin, m.estado
    FROM membresias m
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    INNER JOIN planes p ON m.id_plan = p.id_plan
    WHERE (p_estado IS NULL OR m.estado = p_estado)
    ORDER BY m.fecha_inicio DESC;
END //

CREATE PROCEDURE sp_renovar_membresia(
    IN p_id_membresia INT
)
BEGIN
    DECLARE v_id_plan INT;
    DECLARE v_fecha_actual DATE;
    DECLARE v_duracion_dias INT;
    DECLARE v_nueva_fecha_fin DATE;

    -- Obtener información actual
    SELECT id_plan, fecha_fin INTO v_id_plan, v_fecha_actual
    FROM membresias WHERE id_membresia = p_id_membresia;

    -- Obtener duración del plan
    SELECT duracion_dias INTO v_duracion_dias
    FROM planes WHERE id_plan = v_id_plan;

    -- Si la membresía ya venció, renovar desde hoy
    IF v_fecha_actual < CURDATE() THEN
        SET v_nueva_fecha_fin = DATE_ADD(CURDATE(), INTERVAL v_duracion_dias DAY);
    ELSE
        -- Si aún está activa, extender desde la fecha actual de fin
        SET v_nueva_fecha_fin = DATE_ADD(v_fecha_actual, INTERVAL v_duracion_dias DAY);
    END IF;

    -- Actualizar membresía
    UPDATE membresias
    SET fecha_fin = v_nueva_fecha_fin, estado = 'activa'
    WHERE id_membresia = p_id_membresia;
END //

CREATE PROCEDURE sp_cancelar_membresia(
    IN p_id_membresia INT
)
BEGIN
    UPDATE membresias SET estado = 'cancelada' WHERE id_membresia = p_id_membresia;
END //

-- ===============================
-- 3. PAGOS
-- ===============================

CREATE PROCEDURE sp_registrar_pago(
    IN p_id_membresia INT,
    IN p_concepto VARCHAR(200),
    IN p_monto DECIMAL(10,2)
)
BEGIN
    INSERT INTO pagos (id_membresia, concepto, monto, fecha_pago)
    VALUES (p_id_membresia, p_concepto, p_monto, CURDATE());

    SELECT LAST_INSERT_ID() as id_pago;
END //

CREATE PROCEDURE sp_listar_pagos(
    IN p_id_membresia INT
)
BEGIN
    SELECT p.id_pago, p.id_membresia, p.concepto, p.monto, p.fecha_pago,
           m.id_usuario, u.nombre as usuario_nombre
    FROM pagos p
    INNER JOIN membresias m ON p.id_membresia = m.id_membresia
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    WHERE (p_id_membresia IS NULL OR p.id_membresia = p_id_membresia)
    ORDER BY p.fecha_pago DESC;
END //

-- ===============================
-- 4. ASISTENCIA
-- ===============================

CREATE PROCEDURE sp_registrar_asistencia(
    IN p_id_usuario INT,
    IN p_tipo_registro VARCHAR(10)
)
BEGIN
    INSERT INTO asistencia (id_usuario, fecha_hora, tipo_registro)
    VALUES (p_id_usuario, NOW(), p_tipo_registro);

    SELECT LAST_INSERT_ID() as id_asistencia;
END //

CREATE PROCEDURE sp_listar_asistencia_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT a.id_asistencia, a.id_usuario, u.nombre as usuario_nombre,
           a.fecha_hora, a.tipo_registro
    FROM asistencia a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    WHERE (p_id_usuario IS NULL OR a.id_usuario = p_id_usuario)
    ORDER BY a.fecha_hora DESC;
END //

-- ===============================
-- 5. ENTRENAMIENTOS
-- ===============================

CREATE PROCEDURE sp_crear_entrenamiento(
    IN p_id_usuario INT,
    IN p_id_entrenador INT,
    IN p_tipo_entrenamiento VARCHAR(80),
    IN p_duracion_minutos INT,
    IN p_observaciones TEXT,
    IN p_fecha DATE
)
BEGIN
    INSERT INTO entrenamientos (id_usuario, id_entrenador, tipo_entrenamiento, duracion_minutos, observaciones, fecha)
    VALUES (p_id_usuario, p_id_entrenador, p_tipo_entrenamiento, p_duracion_minutos, p_observaciones, p_fecha);

    SELECT LAST_INSERT_ID() as id_entrenamiento;
END //

CREATE PROCEDURE sp_listar_entrenamientos_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT e.id_entrenamiento, e.id_usuario, u.nombre as usuario_nombre,
           e.id_entrenador, ent.nombre as entrenador_nombre,
           e.tipo_entrenamiento, e.duracion_minutos, e.observaciones, e.fecha
    FROM entrenamientos e
    INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN usuarios ent ON e.id_entrenador = ent.id_usuario
    WHERE e.id_usuario = p_id_usuario
    ORDER BY e.fecha DESC;
END //

CREATE PROCEDURE sp_obtener_entrenamiento(
    IN p_id_entrenamiento INT
)
BEGIN
    SELECT e.id_entrenamiento, e.id_usuario, u.nombre as usuario_nombre,
           e.id_entrenador, ent.nombre as entrenador_nombre,
           e.tipo_entrenamiento, e.duracion_minutos, e.observaciones, e.fecha
    FROM entrenamientos e
    INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
    LEFT JOIN usuarios ent ON e.id_entrenador = ent.id_usuario
    WHERE e.id_entrenamiento = p_id_entrenamiento;
END //

CREATE PROCEDURE sp_actualizar_entrenamiento(
    IN p_id_entrenamiento INT,
    IN p_id_entrenador INT,
    IN p_tipo_entrenamiento VARCHAR(80),
    IN p_duracion_minutos INT,
    IN p_observaciones TEXT,
    IN p_fecha DATE
)
BEGIN
    UPDATE entrenamientos
    SET id_entrenador = p_id_entrenador,
        tipo_entrenamiento = p_tipo_entrenamiento,
        duracion_minutos = p_duracion_minutos,
        observaciones = p_observaciones,
        fecha = p_fecha
    WHERE id_entrenamiento = p_id_entrenamiento;
END //

CREATE PROCEDURE sp_eliminar_entrenamiento(
    IN p_id_entrenamiento INT
)
BEGIN
    DELETE FROM entrenamientos WHERE id_entrenamiento = p_id_entrenamiento;
END //

-- ===============================
-- 6. CAMPAÑAS
-- ===============================

CREATE PROCEDURE sp_crear_campana(
    IN p_nombre VARCHAR(120),
    IN p_descripcion TEXT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_estado VARCHAR(20)
)
BEGIN
    INSERT INTO campanas (nombre, descripcion, fecha_inicio, fecha_fin, estado)
    VALUES (p_nombre, p_descripcion, p_fecha_inicio, p_fecha_fin, p_estado);

    SELECT LAST_INSERT_ID() as id_campana;
END //

CREATE PROCEDURE sp_listar_campanas()
BEGIN
    SELECT id_campana, nombre, descripcion, fecha_inicio, fecha_fin, estado
    FROM campanas
    ORDER BY fecha_inicio DESC;
END //

CREATE PROCEDURE sp_actualizar_campana(
    IN p_id_campana INT,
    IN p_nombre VARCHAR(120),
    IN p_descripcion TEXT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_estado VARCHAR(20)
)
BEGIN
    UPDATE campanas
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin,
        estado = p_estado
    WHERE id_campana = p_id_campana;
    SELECT ROW_COUNT() as filas_actualizadas;
END //

CREATE PROCEDURE sp_eliminar_campana(
    IN p_id_campana INT
)
BEGIN
    DELETE FROM usuario_campana WHERE id_campana = p_id_campana;
    DELETE FROM campanas WHERE id_campana = p_id_campana;
    SELECT ROW_COUNT() as filas_eliminadas;
END //

CREATE PROCEDURE sp_asignar_usuario_campana(
    IN p_id_usuario INT,
    IN p_id_campana INT
)
BEGIN
    INSERT INTO usuario_campana (id_usuario, id_campana, estado)
    VALUES (p_id_usuario, p_id_campana, 'enviado')
    ON DUPLICATE KEY UPDATE estado = 'enviado';
END //

CREATE PROCEDURE sp_listar_usuarios_campana(
    IN p_id_campana INT
)
BEGIN
    SELECT uc.id, uc.id_usuario, u.nombre as usuario_nombre, u.email,
           uc.estado, c.nombre as campana_nombre
    FROM usuario_campana uc
    INNER JOIN usuarios u ON uc.id_usuario = u.id_usuario
    INNER JOIN campanas c ON uc.id_campana = c.id_campana
    WHERE uc.id_campana = p_id_campana
    ORDER BY u.nombre;
END //

-- ===============================
-- 7. SEGUIMIENTO
-- ===============================

CREATE PROCEDURE sp_crear_seguimiento(
    IN p_id_usuario INT,
    IN p_id_registrado_por INT,
    IN p_comentario TEXT,
    IN p_tipo VARCHAR(30)
)
BEGIN
    INSERT INTO seguimiento_cliente (id_usuario, id_registrado_por, comentario, tipo)
    VALUES (p_id_usuario, p_id_registrado_por, p_comentario, p_tipo);

    SELECT LAST_INSERT_ID() as id_seguimiento;
END //

CREATE PROCEDURE sp_listar_seguimiento_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT s.id_seguimiento, s.id_usuario, u.nombre as usuario_nombre,
           s.id_registrado_por, r.nombre as registrado_por_nombre,
           s.comentario, s.tipo, s.fecha
    FROM seguimiento_cliente s
    INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
    LEFT JOIN usuarios r ON s.id_registrado_por = r.id_usuario
    WHERE s.id_usuario = p_id_usuario
    ORDER BY s.fecha DESC;
END //

-- ===============================
-- 8. ESTADÍSTICAS DASHBOARD
-- ===============================

CREATE PROCEDURE sp_dashboard_stats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM usuarios WHERE estado = 'activo') as usuarios_activos,
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM membresias WHERE estado = 'activa') as membresias_activas,
        (SELECT COUNT(*) FROM membresias WHERE estado = 'vencida') as membresias_vencidas,
        (SELECT COUNT(*) FROM pagos) as total_pagos,
        (SELECT COALESCE(SUM(monto), 0) FROM pagos) as ingresos_totales,
        (SELECT COUNT(*) FROM entrenamientos) as total_entrenamientos,
        (SELECT COUNT(*) FROM asistencia WHERE DATE(fecha_hora) = CURDATE()) as asistencia_hoy;
END //

DELIMITER ;