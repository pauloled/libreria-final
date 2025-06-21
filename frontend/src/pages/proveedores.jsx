import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PROVEEDORES } from '../enpoints/endpoints';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState('');
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', telefono: '' });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroTelefono, setFiltroTelefono] = useState('');

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = () => {
    axios.get(PROVEEDORES)
      .then(res => setProveedores(res.data))
      .catch(() => setError('No se pudieron cargar los proveedores.'));
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(PROVEEDORES, nuevo);
      setNuevo({ nombre: '', email: '', telefono: '' });
      cargarProveedores();
    } catch {
      setError('No se pudo crear el proveedor.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proveedor?')) return;
    try {
      await axios.delete(`${PROVEEDORES}/${id}`);
      cargarProveedores();
    } catch {
      setError('No se pudo eliminar el proveedor.');
    }
  };

  const handleEditar = (prov) => {
    setEditando(prov.id_proveedor);
    setEditData({ ...prov });
  };

  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`${PROVEEDORES}/${id}`, editData);
      setEditando(null);
      cargarProveedores();
    } catch {
      setError('No se pudo actualizar el proveedor.');
    }
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setEditData({});
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroEmail('');
    setFiltroTelefono('');
  };

  // Filtrado en tiempo real
  const proveedoresFiltrados = proveedores.filter(prov =>
    prov.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
    prov.email.toLowerCase().includes(filtroEmail.toLowerCase()) &&
    prov.telefono.toLowerCase().includes(filtroTelefono.toLowerCase())
  );

  return (
    <div>
      <h2>Gestión de Proveedores</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={e => setFiltroNombre(e.target.value)}
          style={{ width: 160 }}
        />
        <input
          type="text"
          placeholder="Buscar por email"
          value={filtroEmail}
          onChange={e => setFiltroEmail(e.target.value)}
          style={{ width: 160 }}
        />
        <input
          type="text"
          placeholder="Buscar por teléfono"
          value={filtroTelefono}
          onChange={e => setFiltroTelefono(e.target.value)}
          style={{ width: 140 }}
        />
        <button onClick={limpiarFiltros}>Limpiar filtros</button>
      </div>

      <form onSubmit={handleCrear} style={{marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input type="text" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} required />
        <input type="email" placeholder="Email" value={nuevo.email} onChange={e => setNuevo({ ...nuevo, email: e.target.value })} />
        <input type="text" placeholder="Teléfono" value={nuevo.telefono} onChange={e => setNuevo({ ...nuevo, telefono: e.target.value })} />
        <button type="submit">Crear proveedor</button>
      </form>

      <table border="1" cellPadding={8} style={{width: '100%', background: 'white', color: 'black'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresFiltrados.map(prov => (
            <tr key={prov.id_proveedor}>
              {editando === prov.id_proveedor ? (
                <>
                  <td>{prov.id_proveedor}</td>
                  <td><input type="text" value={editData.nombre} onChange={e => setEditData({ ...editData, nombre: e.target.value })} /></td>
                  <td><input type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></td>
                  <td><input type="text" value={editData.telefono} onChange={e => setEditData({ ...editData, telefono: e.target.value })} /></td>
                  <td>
                    <button onClick={() => handleGuardarEdicion(prov.id_proveedor)}>Guardar</button>
                    <button onClick={handleCancelarEdicion}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{prov.id_proveedor}</td>
                  <td>{prov.nombre}</td>
                  <td>{prov.email}</td>
                  <td>{prov.telefono}</td>
                  <td>
                    <button onClick={() => handleEditar(prov)}>Editar</button>
                    <button onClick={() => handleEliminar(prov.id_proveedor)}>Eliminar</button>
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

export default Proveedores;