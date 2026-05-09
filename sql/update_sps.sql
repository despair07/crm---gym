-- ============================================================
-- SCRIPT DE ACTUALIZACIÓN v2 - Ejecutar en MySQL Workbench
-- Actualiza y agrega SPs necesarios para el CRM completo
-- ============================================================

USE gimnasio;

-- ── 1. SP Asistencia: acepta NULL para listar todos ──
DROP PROCEDURE IF EXISTS sp_listar_asistencia_usuario;

DELIMITER //
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
DELIMITER ;

-- ── 2. SP Pagos: acepta NULL para listar todos ──
DROP PROCEDURE IF EXISTS sp_listar_pagos;

DELIMITER //
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
DELIMITER ;

-- ── 3. SP Campañas: actualizar ──
DROP PROCEDURE IF EXISTS sp_actualizar_campana;

DELIMITER //
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
DELIMITER ;

-- ── 4. SP Campañas: eliminar ──
DROP PROCEDURE IF EXISTS sp_eliminar_campana;

DELIMITER //
CREATE PROCEDURE sp_eliminar_campana(
    IN p_id_campana INT
)
BEGIN
    DELETE FROM usuario_campana WHERE id_campana = p_id_campana;
    DELETE FROM campanas WHERE id_campana = p_id_campana;
    SELECT ROW_COUNT() as filas_eliminadas;
END //
DELIMITER ;

-- Verificar
SELECT 'SPs actualizados correctamente ✅' as resultado;
