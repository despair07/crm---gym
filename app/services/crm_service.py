from app.repositories import crm_repository as repo


def _first_or_none(rows):
    return rows[0] if rows else None


def login(email: str, password: str):
    return _first_or_none(repo.login(email, password))


def crear_usuario(payload):
    rows = repo.crear_usuario(
        payload.nombre,
        payload.email,
        payload.password,
        payload.telefono,
        payload.fecha_nacimiento,
        payload.estado,
        payload.id_rol,
        payload.id_entrenador,
    )
    return _first_or_none(rows)


def listar_usuarios(id_rol, estado):
    return repo.listar_usuarios(id_rol, estado)


def obtener_usuario(id_usuario):
    return _first_or_none(repo.obtener_usuario(id_usuario))


def actualizar_usuario(id_usuario, payload, current):
    rows = repo.actualizar_usuario(
        id_usuario,
        payload.nombre if payload.nombre is not None else current["nombre"],
        payload.telefono if payload.telefono is not None else current["telefono"],
        payload.fecha_nacimiento if payload.fecha_nacimiento is not None else current["fecha_nacimiento"],
        payload.estado if payload.estado is not None else current["estado"],
        payload.id_rol if payload.id_rol is not None else current["id_rol"],
        payload.id_entrenador if payload.id_entrenador is not None else current["id_entrenador"],
    )
    return _first_or_none(rows)


def eliminar_usuario(id_usuario):
    return _first_or_none(repo.eliminar_usuario(id_usuario))


def crear_membresia(payload):
    return _first_or_none(repo.crear_membresia(payload.id_usuario, payload.id_plan, payload.fecha_inicio))


def listar_membresias(estado):
    return repo.listar_membresias(estado)


def renovar_membresia(id_membresia):
    return _first_or_none(repo.renovar_membresia(id_membresia))


def cancelar_membresia(id_membresia):
    return _first_or_none(repo.cancelar_membresia(id_membresia))


def registrar_pago(payload):
    return _first_or_none(repo.registrar_pago(payload.id_membresia, payload.concepto, payload.monto))


def listar_pagos(id_membresia):
    return repo.listar_pagos(id_membresia)


def registrar_asistencia(payload):
    return _first_or_none(repo.registrar_asistencia(payload.id_usuario, payload.tipo_registro))


def listar_asistencia_usuario(id_usuario):
    return repo.listar_asistencia_usuario(id_usuario)


def listar_asistencia_todos():
    return repo.listar_asistencia_todos()


def crear_entrenamiento(payload):
    return _first_or_none(
        repo.crear_entrenamiento(
            payload.id_usuario,
            payload.id_entrenador,
            payload.tipo_entrenamiento,
            payload.duracion_minutos,
            payload.observaciones,
            payload.fecha,
        )
    )


def listar_entrenamientos_usuario(id_usuario):
    return repo.listar_entrenamientos_usuario(id_usuario)


def obtener_entrenamiento(id_entrenamiento):
    return _first_or_none(repo.obtener_entrenamiento(id_entrenamiento))


def actualizar_entrenamiento(id_entrenamiento, payload, current):
    return _first_or_none(
        repo.actualizar_entrenamiento(
            id_entrenamiento,
            payload.id_entrenador if payload.id_entrenador is not None else current["id_entrenador"],
            payload.tipo_entrenamiento if payload.tipo_entrenamiento is not None else current["tipo_entrenamiento"],
            payload.duracion_minutos if payload.duracion_minutos is not None else current["duracion_minutos"],
            payload.observaciones if payload.observaciones is not None else current["observaciones"],
            payload.fecha if payload.fecha is not None else current["fecha"],
        )
    )


def eliminar_entrenamiento(id_entrenamiento):
    return _first_or_none(repo.eliminar_entrenamiento(id_entrenamiento))


def crear_campana(payload):
    return _first_or_none(
        repo.crear_campana(payload.nombre, payload.descripcion, payload.fecha_inicio, payload.fecha_fin, payload.estado)
    )


def listar_campanas():
    return repo.listar_campanas()


def actualizar_campana(id_campana, payload):
    return repo.actualizar_campana(
        id_campana, payload.nombre, payload.descripcion,
        payload.fecha_inicio, payload.fecha_fin, payload.estado
    )


def eliminar_campana(id_campana):
    return repo.eliminar_campana(id_campana)


def asignar_usuarios_campana(id_campana, ids_usuarios):
    result = []
    for id_usuario in ids_usuarios:
        row = _first_or_none(repo.asignar_usuario_campana(id_usuario, id_campana))
        if row:
            result.append(row)
    return result


def listar_usuarios_campana(id_campana):
    return repo.listar_usuarios_campana(id_campana)


def crear_seguimiento(payload):
    return _first_or_none(
        repo.crear_seguimiento(payload.id_usuario, payload.id_registrado_por, payload.comentario, payload.tipo)
    )


def listar_seguimiento_usuario(id_usuario):
    return repo.listar_seguimiento_usuario(id_usuario)


# ==================== FUNCIONES DE AUTENTICACIÓN ====================

def obtener_usuario_por_email(email: str):
    """
    Obtiene un usuario por su email
    
    Args:
        email: Email del usuario
        
    Returns:
        Lista con los datos del usuario
    """
    return repo.obtener_usuario_por_email(email)


def crear_usuario_completo(nombre, email, password, telefono, fecha_nacimiento, estado, id_rol, id_entrenador):
    """
    Crea un nuevo usuario con contraseña hasheada
    
    Args:
        nombre: Nombre del usuario
        email: Email único
        password: Contraseña hasheada
        telefono: Teléfono (opcional)
        fecha_nacimiento: Fecha de nacimiento (opcional)
        estado: Estado del usuario
        id_rol: ID del rol
        id_entrenador: ID del entrenador (opcional)
        
    Returns:
        Datos del usuario creado
    """
    return _first_or_none(
        repo.crear_usuario(nombre, email, password, telefono, fecha_nacimiento, estado, id_rol, id_entrenador)
    )


def dashboard_stats():
    """Obtiene estadísticas generales del dashboard"""
    return _first_or_none(repo.dashboard_stats())


def listar_todos_pagos():
    """Lista todos los pagos sin filtro"""
    return repo.listar_todos_pagos()


def eliminar_pago(id_pago):
    """Elimina un pago por su ID"""
    return repo.eliminar_pago(id_pago)

