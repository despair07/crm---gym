from app.database import execute_sp


def login(email: str, password: str):
    return execute_sp("sp_login_usuario", [email, password])


def crear_usuario(nombre, email, password, telefono, fecha_nacimiento, estado, id_rol, id_entrenador):
    return execute_sp(
        "sp_crear_usuario",
        [nombre, email, password, telefono, fecha_nacimiento, estado, id_rol, id_entrenador],
    )


def listar_usuarios(id_rol, estado):
    return execute_sp("sp_listar_usuarios", [id_rol, estado])


def obtener_usuario(id_usuario):
    return execute_sp("sp_obtener_usuario", [id_usuario])


def actualizar_usuario(id_usuario, nombre, telefono, fecha_nacimiento, estado, id_rol, id_entrenador):
    return execute_sp(
        "sp_actualizar_usuario",
        [id_usuario, nombre, telefono, fecha_nacimiento, estado, id_rol, id_entrenador],
    )


def eliminar_usuario(id_usuario):
    return execute_sp("sp_eliminar_usuario", [id_usuario])


def crear_membresia(id_usuario, id_plan, fecha_inicio):
    return execute_sp("sp_crear_membresia", [id_usuario, id_plan, fecha_inicio])


def listar_membresias(estado):
    return execute_sp("sp_listar_membresias", [estado])


def renovar_membresia(id_membresia):
    return execute_sp("sp_renovar_membresia", [id_membresia])


def cancelar_membresia(id_membresia):
    return execute_sp("sp_cancelar_membresia", [id_membresia])


def registrar_pago(id_membresia, concepto, monto):
    return execute_sp("sp_registrar_pago", [id_membresia, concepto, monto])


def listar_pagos(id_membresia):
    return execute_sp("sp_listar_pagos", [id_membresia])


def registrar_asistencia(id_usuario, tipo_registro):
    return execute_sp("sp_registrar_asistencia", [id_usuario, tipo_registro])


def listar_asistencia_usuario(id_usuario):
    return execute_sp("sp_listar_asistencia_usuario", [id_usuario])


def listar_asistencia_todos():
    return execute_sp("sp_listar_asistencia_usuario", [None])


def crear_entrenamiento(id_usuario, id_entrenador, tipo_entrenamiento, duracion_minutos, observaciones, fecha):
    return execute_sp(
        "sp_crear_entrenamiento",
        [id_usuario, id_entrenador, tipo_entrenamiento, duracion_minutos, observaciones, fecha],
    )


def listar_entrenamientos_usuario(id_usuario):
    return execute_sp("sp_listar_entrenamientos_usuario", [id_usuario])


def obtener_entrenamiento(id_entrenamiento):
    return execute_sp("sp_obtener_entrenamiento", [id_entrenamiento])


def actualizar_entrenamiento(id_entrenamiento, id_entrenador, tipo_entrenamiento, duracion_minutos, observaciones, fecha):
    return execute_sp(
        "sp_actualizar_entrenamiento",
        [id_entrenamiento, id_entrenador, tipo_entrenamiento, duracion_minutos, observaciones, fecha],
    )


def eliminar_entrenamiento(id_entrenamiento):
    return execute_sp("sp_eliminar_entrenamiento", [id_entrenamiento])


def crear_campana(nombre, descripcion, fecha_inicio, fecha_fin, estado):
    return execute_sp("sp_crear_campana", [nombre, descripcion, fecha_inicio, fecha_fin, estado])


def listar_campanas():
    return execute_sp("sp_listar_campanas")


def actualizar_campana(id_campana, nombre, descripcion, fecha_inicio, fecha_fin, estado):
    return execute_sp("sp_actualizar_campana", [id_campana, nombre, descripcion, fecha_inicio, fecha_fin, estado])


def eliminar_campana(id_campana):
    return execute_sp("sp_eliminar_campana", [id_campana])



def asignar_usuario_campana(id_usuario, id_campana):
    return execute_sp("sp_asignar_usuario_campana", [id_usuario, id_campana])


def listar_usuarios_campana(id_campana):
    return execute_sp("sp_listar_usuarios_campana", [id_campana])


def crear_seguimiento(id_usuario, id_registrado_por, comentario, tipo):
    return execute_sp("sp_crear_seguimiento", [id_usuario, id_registrado_por, comentario, tipo])


def listar_seguimiento_usuario(id_usuario):
    return execute_sp("sp_listar_seguimiento_usuario", [id_usuario])


def obtener_usuario_por_email(email: str):
    """
    Obtiene un usuario por su email para autenticación
    
    Args:
        email: Email del usuario
        
    Returns:
        Resultado del procedimiento almacenado
    """
    return execute_sp("sp_obtener_usuario_por_email", [email])


def dashboard_stats():
    """Obtiene estadísticas generales del dashboard"""
    return execute_sp("sp_dashboard_stats")


def listar_todos_pagos():
    """Lista todos los pagos sin filtro de membresía"""
    return execute_sp("sp_listar_pagos", [None])

