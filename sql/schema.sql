-- ============================================================
--  GIMNASIO - Script completo para MySQL
--  Cómo usar:
--  1. Abre MySQL Workbench
--  2. Abre este archivo o copia y pega todo el contenido
--  3. Ejecuta con el rayo ⚡
-- ============================================================

CREATE DATABASE IF NOT EXISTS gimnasio;
USE gimnasio;

-- ------------------------------------------------------------
-- 1. roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id_rol  INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre  VARCHAR(50)  NOT NULL UNIQUE
);

INSERT INTO roles (nombre) VALUES 
    ('Administrador'), 
    ('Entrenador'), 
    ('Cliente');


-- ------------------------------------------------------------
-- 2. usuarios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario       INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(120) NOT NULL,
    email            VARCHAR(120) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    telefono         VARCHAR(20),
    fecha_nacimiento DATE,
    estado           VARCHAR(20)  NOT NULL DEFAULT 'activo',
    id_rol           INT          NOT NULL,
    id_entrenador    INT,
    CONSTRAINT fk_usuario_rol      FOREIGN KEY (id_rol)        REFERENCES roles(id_rol),
    CONSTRAINT fk_usuario_entrena  FOREIGN KEY (id_entrenador) REFERENCES usuarios(id_usuario)
);

CREATE INDEX idx_usuarios_email      ON usuarios(email);
CREATE INDEX idx_usuarios_rol        ON usuarios(id_rol);
CREATE INDEX idx_usuarios_entrenador ON usuarios(id_entrenador);


-- ------------------------------------------------------------
-- 3. planes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planes (
    id_plan       INT            NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_plan   VARCHAR(80)    NOT NULL,
    precio        DECIMAL(10,2)  NOT NULL,
    duracion_dias INT            NOT NULL
);


-- ------------------------------------------------------------
-- 4. membresias
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS membresias (
    id_membresia INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario   INT         NOT NULL,
    id_plan      INT         NOT NULL,
    fecha_inicio DATE        NOT NULL,
    fecha_fin    DATE        NOT NULL,
    estado       VARCHAR(20) NOT NULL DEFAULT 'activa',
    CONSTRAINT fk_membresia_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_membresia_plan    FOREIGN KEY (id_plan)    REFERENCES planes(id_plan)
);

CREATE INDEX idx_membresias_usuario ON membresias(id_usuario);
CREATE INDEX idx_membresias_estado  ON membresias(estado);


-- ------------------------------------------------------------
-- 5. pagos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
    id_pago      INT            NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_membresia INT            NOT NULL,
    concepto     VARCHAR(200),
    monto        DECIMAL(10,2)  NOT NULL,
    fecha_pago   DATE           NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_pago_membresia FOREIGN KEY (id_membresia) REFERENCES membresias(id_membresia)
);

CREATE INDEX idx_pagos_membresia ON pagos(id_membresia);


-- ------------------------------------------------------------
-- 6. asistencia
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS asistencia (
    id_asistencia INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario    INT         NOT NULL,
    fecha_hora    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_registro VARCHAR(10) NOT NULL DEFAULT 'entrada',
    CONSTRAINT fk_asistencia_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE INDEX idx_asistencia_usuario ON asistencia(id_usuario);
CREATE INDEX idx_asistencia_fecha   ON asistencia(fecha_hora);


-- ------------------------------------------------------------
-- 7. entrenamientos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entrenamientos (
    id_entrenamiento   INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario         INT         NOT NULL,
    id_entrenador      INT,
    tipo_entrenamiento VARCHAR(80) NOT NULL,
    duracion_minutos   INT,
    observaciones      TEXT,
    fecha              DATE        NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_entrenamiento_usuario   FOREIGN KEY (id_usuario)   REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_entrenamiento_entrena   FOREIGN KEY (id_entrenador) REFERENCES usuarios(id_usuario)
);

CREATE INDEX idx_entrenamientos_usuario    ON entrenamientos(id_usuario);
CREATE INDEX idx_entrenamientos_entrenador ON entrenamientos(id_entrenador);


-- ------------------------------------------------------------
-- 8. notificaciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notificaciones (
    id_notificacion    INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario         INT          NOT NULL,
    mensaje            TEXT         NOT NULL,
    tipo               VARCHAR(50)  NOT NULL,
    fecha_notificacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leida              TINYINT(1)   NOT NULL DEFAULT 0,
    CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notificaciones_leida   ON notificaciones(leida);


-- ------------------------------------------------------------
-- 9. campanas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campanas (
    id_campana   INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(120) NOT NULL,
    descripcion  TEXT,
    fecha_inicio DATE         NOT NULL,
    fecha_fin    DATE,
    estado       VARCHAR(20)  NOT NULL DEFAULT 'activa'
);


-- ------------------------------------------------------------
-- 10. usuario_campana
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_campana (
    id         INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT         NOT NULL,
    id_campana INT         NOT NULL,
    estado     VARCHAR(20) NOT NULL DEFAULT 'enviado',
    UNIQUE KEY uq_usuario_campana (id_usuario, id_campana),
    CONSTRAINT fk_uc_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_uc_campana FOREIGN KEY (id_campana) REFERENCES campanas(id_campana)
);


-- ------------------------------------------------------------
-- 11. seguimiento_cliente
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seguimiento_cliente (
    id_seguimiento    INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario        INT         NOT NULL,
    id_registrado_por INT,
    fecha             DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comentario        TEXT,
    tipo              VARCHAR(30) NOT NULL,
    CONSTRAINT fk_seguimiento_usuario  FOREIGN KEY (id_usuario)        REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_seguimiento_registro FOREIGN KEY (id_registrado_por) REFERENCES usuarios(id_usuario)
);

CREATE INDEX idx_seguimiento_usuario ON seguimiento_cliente(id_usuario);


-- ============================================================
--  Verificar tablas creadas
-- ============================================================
SHOW TABLES;
