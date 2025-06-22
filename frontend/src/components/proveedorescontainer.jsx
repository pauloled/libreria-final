import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PROVEEDORES } from '../enpoints/endpoints';

const ProveedoresContainer = () => {
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
    <div className="container-fluid mt-4 px-4">
      <h2 className="mb-3 display-5">Gestión de Proveedores</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Barra de filtros */}
      <div className="row g-2 mb-3 align-items-end flex-wrap">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
            style={{ width: 160 }}
          />
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por email"
            value={filtroEmail}
            onChange={e => setFiltroEmail(e.target.value)}
            style={{ width: 160 }}
          />
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por teléfono"
            value={filtroTelefono}
            onChange={e => setFiltroTelefono(e.target.value)}
            style={{ width: 140 }}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>
      </div>

      <form onSubmit={handleCrear} className="p-3 bg-light rounded border mb-4 d-flex flex-wrap gap-2 align-items-end">
        <input type="text" className="form-control" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} required style={{ maxWidth: 180 }} />
        <input type="email" className="form-control" placeholder="Email" value={nuevo.email} onChange={e => setNuevo({ ...nuevo, email: e.target.value })} style={{ maxWidth: 200 }} />
        <input type="text" className="form-control" placeholder="Teléfono" value={nuevo.telefono} onChange={e => setNuevo({ ...nuevo, telefono: e.target.value })} style={{ maxWidth: 140 }} />
        <button type="submit" className="btn btn-success">Crear proveedor</button>
      </form>

      <table className="table table-bordered table-striped table-lg w-100">
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
                  <td><input type="text" className="form-control" value={editData.nombre} onChange={e => setEditData({ ...editData, nombre: e.target.value })} /></td>
                  <td><input type="email" className="form-control" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></td>
                  <td><input type="text" className="form-control" value={editData.telefono} onChange={e => setEditData({ ...editData, telefono: e.target.value })} /></td>
                  <td>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleGuardarEdicion(prov.id_proveedor)}>Guardar</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelarEdicion}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{prov.id_proveedor}</td>
                  <td>{prov.nombre}</td>
                  <td>{prov.email}</td>
                  <td>{prov.telefono}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(prov)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prov.id_proveedor)}>Eliminar</button>
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

export default ProveedoresContainer;