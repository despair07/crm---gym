import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioResponse, UsuarioCreate, UsuarioUpdate } from '../types/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [createForm, setCreateForm] = useState<UsuarioCreate>({
    nombre: '', email: '', password: '', telefono: '', fecha_nacimiento: '', estado: 'activo', id_rol: 3,
  });
  const [editForm, setEditForm] = useState<UsuarioUpdate>({});

  const fetchUsuarios = async () => {
    try { setLoading(true); const data = await usuarioService.listar(); setUsuarios(data); setError(null); }
    catch (err: any) { setError(err.response?.data?.detail || 'Error al cargar usuarios'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    try {
      await usuarioService.crear(createForm);
      setShowCreateModal(false);
      setCreateForm({ nombre: '', email: '', password: '', telefono: '', fecha_nacimiento: '', estado: 'activo', id_rol: 3 });
      setSuccess('✅ Usuario creado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      fetchUsuarios();
    } catch (err: any) { setError(err.response?.data?.detail || 'Error al crear usuario'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (user: UsuarioResponse) => {
    setEditingUser(user);
    setEditForm({ nombre: user.nombre, telefono: user.telefono, estado: user.estado, id_rol: user.id_rol });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingUser) return; setSubmitting(true); setError(null);
    try {
      await usuarioService.actualizar(editingUser.id_usuario, editForm);
      setShowEditModal(false); setEditingUser(null);
      setSuccess('✅ Usuario actualizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      fetchUsuarios();
    } catch (err: any) { setError(err.response?.data?.detail || 'Error al actualizar usuario'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Seguro que deseas eliminar a "${nombre}"?`)) return;
    try {
      await usuarioService.eliminar(id);
      setSuccess('✅ Usuario eliminado');
      setTimeout(() => setSuccess(null), 3000);
      fetchUsuarios();
    } catch (err: any) { setError(err.response?.data?.detail || 'Error al eliminar usuario'); }
  };

  const getRoleName = (id_rol: number) => {
    const roles: Record<number, string> = { 1: 'Admin', 2: 'Entrenador', 3: 'Cliente' };
    return roles[id_rol] || `Rol ${id_rol}`;
  };

  const getRoleBadge = (id_rol: number) => {
    const badges: Record<number, string> = { 1: 'badge-purple', 2: 'badge-info', 3: 'badge-success' };
    return badges[id_rol] || 'badge-neutral';
  };

  const avatarColors = [
    'from-primary-500 to-accent-cyan',
    'from-accent-emerald to-green-400',
    'from-accent-amber to-orange-400',
    'from-accent-violet to-purple-400',
    'from-accent-rose to-pink-400',
    'from-accent-cyan to-blue-400',
  ];

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="page-header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>Administra todos los usuarios del sistema</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Usuario
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Search */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !bg-transparent !border-0 !shadow-none !ring-0 focus:!shadow-none"
            />
            <span className="text-xs text-dark-500 whitespace-nowrap">{filteredUsuarios.length} usuarios</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">No hay usuarios registrados</td></tr>
                  ) : filteredUsuarios.map((u, idx) => (
                    <tr key={u.id_usuario}>
                      <td className="font-mono text-dark-500 text-xs">#{u.id_usuario}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`avatar avatar-sm bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} text-white`}>
                            {u.nombre.charAt(0)}
                          </div>
                          <span className="font-medium text-dark-100">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="text-dark-400">{u.email}</td>
                      <td className="text-dark-400">{u.telefono || '—'}</td>
                      <td><span className={`badge ${getRoleBadge(u.id_rol)}`}>{getRoleName(u.id_rol)}</span></td>
                      <td><span className={`badge ${u.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>{u.estado}</span></td>
                      <td className="text-right space-x-1">
                        <button onClick={() => handleEdit(u)} className="action-btn action-btn-edit">Editar</button>
                        <button onClick={() => handleDelete(u.id_usuario, u.nombre)} className="action-btn action-btn-delete">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Crear */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-5">✨ Nuevo Usuario</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Nombre *</label>
                    <input type="text" required value={createForm.nombre} onChange={(e) => setCreateForm({...createForm, nombre: e.target.value})} className="input-field" placeholder="Nombre completo" />
                  </div>
                  <div>
                    <label className="input-label">Email *</label>
                    <input type="email" required value={createForm.email} onChange={(e) => setCreateForm({...createForm, email: e.target.value})} className="input-field" placeholder="correo@gym.com" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Contraseña *</label>
                  <input type="password" required value={createForm.password} onChange={(e) => setCreateForm({...createForm, password: e.target.value})} className="input-field" placeholder="••••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Teléfono</label>
                    <input type="text" value={createForm.telefono || ''} onChange={(e) => setCreateForm({...createForm, telefono: e.target.value})} className="input-field" placeholder="300 000 0000" />
                  </div>
                  <div>
                    <label className="input-label">Fecha Nacimiento</label>
                    <input type="date" value={createForm.fecha_nacimiento || ''} onChange={(e) => setCreateForm({...createForm, fecha_nacimiento: e.target.value || null})} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Estado</label>
                    <select value={createForm.estado} onChange={(e) => setCreateForm({...createForm, estado: e.target.value})} className="input-field">
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Rol *</label>
                    <select value={createForm.id_rol} onChange={(e) => setCreateForm({...createForm, id_rol: parseInt(e.target.value)})} className="input-field">
                      <option value={1}>Administrador</option>
                      <option value={2}>Entrenador</option>
                      <option value={3}>Cliente</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Creando...' : 'Crear Usuario'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {showEditModal && editingUser && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-5">✏️ Editar: {editingUser.nombre}</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="input-label">Nombre</label>
                  <input type="text" value={editForm.nombre || ''} onChange={(e) => setEditForm({...editForm, nombre: e.target.value})} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Teléfono</label>
                    <input type="text" value={editForm.telefono || ''} onChange={(e) => setEditForm({...editForm, telefono: e.target.value})} className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Estado</label>
                    <select value={editForm.estado || 'activo'} onChange={(e) => setEditForm({...editForm, estado: e.target.value})} className="input-field">
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Rol</label>
                  <select value={editForm.id_rol || 3} onChange={(e) => setEditForm({...editForm, id_rol: parseInt(e.target.value)})} className="input-field">
                    <option value={1}>Administrador</option>
                    <option value={2}>Entrenador</option>
                    <option value={3}>Cliente</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-ghost">Cancelar</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Guardando...' : 'Guardar Cambios'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Usuarios;