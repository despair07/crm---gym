USE gimnasio;

DROP TRIGGER IF EXISTS trg_asistencia_tipo_valido;
DROP TRIGGER IF EXISTS trg_membresia_fechas_validas_insert;
DROP TRIGGER IF EXISTS trg_membresia_fechas_validas_update;
DROP TRIGGER IF EXISTS trg_pago_notificacion;
DROP TRIGGER IF EXISTS trg_pago_reactiva_membresia;
DROP TRIGGER IF EXISTS trg_membresia_notificacion_cancelacion;

DELIMITER //

CREATE TRIGGER trg_asistencia_tipo_valido
BEFORE INSERT ON asistencia
FOR EACH ROW
BEGIN
    IF NEW.tipo_registro NOT IN ('entrada', 'salida') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'tipo_registro solo permite entrada o salida';
    END IF;
END //

CREATE TRIGGER trg_membresia_fechas_validas_insert
BEFORE INSERT ON membresias
FOR EACH ROW
BEGIN
    IF NEW.fecha_fin < NEW.fecha_inicio THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'fecha_fin no puede ser menor que fecha_inicio';
    END IF;
END //

CREATE TRIGGER trg_membresia_fechas_validas_update
BEFORE UPDATE ON membresias
FOR EACH ROW
BEGIN
    IF NEW.fecha_fin < NEW.fecha_inicio THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'fecha_fin no puede ser menor que fecha_inicio';
    END IF;
END //

CREATE TRIGGER trg_pago_notificacion
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_mensaje TEXT;

    SELECT m.id_usuario INTO v_id_usuario
    FROM membresias m
    WHERE m.id_membresia = NEW.id_membresia;

    SET v_mensaje = CONCAT('Pago registrado por monto ', NEW.monto, ' para la membresía ', NEW.id_membresia);

    INSERT INTO notificaciones (id_usuario, mensaje, tipo)
    VALUES (v_id_usuario, v_mensaje, 'pago');
END //

CREATE TRIGGER trg_pago_reactiva_membresia
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    UPDATE membresias
    SET estado = 'activa'
    WHERE id_membresia = NEW.id_membresia
      AND estado <> 'activa';
END //

CREATE TRIGGER trg_membresia_notificacion_cancelacion
AFTER UPDATE ON membresias
FOR EACH ROW
BEGIN
    IF NEW.estado = 'cancelada' AND OLD.estado <> 'cancelada' THEN
        INSERT INTO notificaciones (id_usuario, mensaje, tipo)
        VALUES (NEW.id_usuario, 'Tu membresía fue cancelada', 'membresia');
    END IF;
END //

DELIMITER ;
