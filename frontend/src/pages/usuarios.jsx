import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USUARIOS } from '../enpoints/endpoints';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [nuevo, setNuevo] = useState({
    nombre_usuario: '',
    correo: '',
    contrasena: '',
    rol: 'empleado'
  });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCorreo, setFiltroCorreo] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const navigate = useNavigate();

  const cargarUsuarios = () => {
    axios.get(USUARIOS)
      .then(res => setUsuarios(res.data))
      .catch(() => setError('No se pudieron cargar los usuarios.'));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Crear usuario
  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(USUARIOS, nuevo);
      setNuevo({
        nombre_usuario: '',
        correo: '',
        contrasena: '',
        rol: 'empleado'
      });
      cargarUsuarios();
    } catch {
      setError('No se pudo crear el usuario.');
    }
  };

  // Eliminar usuario
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await axios.delete(`${USUARIOS}/${id}`);
      cargarUsuarios();
    } catch {
      setError('No se pudo eliminar el usuario.');
    }
  };

  // Iniciar edición
  const handleEditar = (user) => {
    setEditando(user.id_usuario);
    setEditData({ ...user, contrasena: '' });
  };

  // Guardar edición
  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`${USUARIOS}/${id}`, editData);
      setEditando(null);
      cargarUsuarios();
    } catch {
      setError('No se pudo actualizar el usuario.');
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = () => {
    setEditando(null);
    setEditData({});
  };

  // Ir a ventas de usuario
  const verVentas = (id_usuario) => {
    navigate(`/ventas?usuario=${id_usuario}`);
  };

  // Ir a asistencias de usuario
  const verAsistencias = (id_usuario) => {
    navigate(`/asistencias?usuario=${id_usuario}`);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroCorreo('');
    setFiltroRol('');
  };

  // Filtrado en tiempo real
  const usuariosFiltrados = usuarios.filter(user =>
    user.nombre_usuario.toLowerCase().includes(filtroNombre.toLowerCase()) &&
    user.correo.toLowerCase().includes(filtroCorreo.toLowerCase()) &&
    (filtroRol === '' || user.rol === filtroRol)
  );

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={e => setFiltroNombre(e.target.value)}
          style={{ width: 180 }}
        />
        <input
          type="text"
          placeholder="Buscar por correo"
          value={filtroCorreo}
          onChange={e => setFiltroCorreo(e.target.value)}
          style={{ width: 180 }}
        />
        <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="empleado">Empleado</option>
          <option value="encargado">Encargado</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={limpiarFiltros}>Limpiar filtros</button>
      </div>

      <form onSubmit={handleCrear} style={{marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input type="text" placeholder="Nombre de usuario" value={nuevo.nombre_usuario} onChange={e => setNuevo({ ...nuevo, nombre_usuario: e.target.value })} required />
        <input type="email" placeholder="Correo" value={nuevo.correo} onChange={e => setNuevo({ ...nuevo, correo: e.target.value })} required />
        <input type="password" placeholder="Contraseña" value={nuevo.contrasena} onChange={e => setNuevo({ ...nuevo, contrasena: e.target.value })} required />
        <select value={nuevo.rol} onChange={e => setNuevo({ ...nuevo, rol: e.target.value })}>
          <option value="empleado">Empleado</option>
          <option value="encargado">Encargado</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Crear usuario</button>
      </form>

      <table border="1" cellPadding={8} style={{width: '100%', background: 'white', color: 'black'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de usuario</th>
            <th>Correo</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(user => (
            <tr key={user.id_usuario}>
              {editando === user.id_usuario ? (
                <>
                  <td>{user.id_usuario}</td>
                  <td><input type="text" value={editData.nombre_usuario} onChange={e => setEditData({ ...editData, nombre_usuario: e.target.value })} /></td>
                  <td><input type="email" value={editData.correo} onChange={e => setEditData({ ...editData, correo: e.target.value })} /></td>
                  <td><input type="password" value={editData.contrasena} onChange={e => setEditData({ ...editData, contrasena: e.target.value })} /></td>
                  <td>
                    <select value={editData.rol} onChange={e => setEditData({ ...editData, rol: e.target.value })}>
                      <option value="empleado">Empleado</option>
                      <option value="encargado">Encargado</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleGuardarEdicion(user.id_usuario)}>Guardar</button>
                    <button onClick={handleCancelarEdicion}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.id_usuario}</td>
                  <td>{user.nombre_usuario}</td>
                  <td>{user.correo}</td>
                  <td>••••••</td>
                  <td>{user.rol}</td>
                  <td>
                    <button onClick={() => verVentas(user.id_usuario)}>Ventas</button>
                    <button onClick={() => verAsistencias(user.id_usuario)}>Asistencias</button>
                    <button onClick={() => handleEditar(user)}>Editar</button>
                    <button onClick={() => handleEliminar(user.id_usuario)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;