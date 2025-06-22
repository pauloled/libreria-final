import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INGRESOS, PRODUCTOS } from '../enpoints/endpoints';
import { PROVEEDORES } from '../enpoints/endpoints';

// Formatear fecha
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const IngresosContainer = () => {
  const [ingresos, setIngresos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState('');
  const [nuevo, setNuevo] = useState({
    fecha: '',
    id_producto: '',
    id_proveedor: '',
    cantidad: '',
    precio_unitario: '',
    subtotal: ''
  });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});
  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroProveedor, setFiltroProveedor] = useState('');

  useEffect(() => {
    cargarIngresos();
    axios.get(PRODUCTOS).then(res => setProductos(res.data));
    if (PROVEEDORES) {
      axios.get(PROVEEDORES).then(res => setProveedores(res.data));
    }
  }, []);

  const cargarIngresos = () => {
    axios.get(INGRESOS)
      .then(res => {
        setIngresos(res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      })
      .catch(() => setError('No se pudieron cargar los ingresos.'));
  };

  // Crear ingreso
  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(INGRESOS, {
        ...nuevo,
        cantidad: parseInt(nuevo.cantidad),
        precio_unitario: parseFloat(nuevo.precio_unitario),
        subtotal: parseFloat(nuevo.cantidad) * parseFloat(nuevo.precio_unitario)
      });
      setNuevo({
        fecha: '',
        id_producto: '',
        id_proveedor: '',
        cantidad: '',
        precio_unitario: '',
        subtotal: ''
      });
      cargarIngresos();
    } catch {
      setError('No se pudo crear el ingreso.');
    }
  };

  // Eliminar ingreso
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ingreso?')) return;
    try {
      await axios.delete(`${INGRESOS}/${id}`);
      cargarIngresos();
    } catch {
      setError('No se pudo eliminar el ingreso.');
    }
  };

  // Iniciar edición
  const handleEditar = (ing) => {
    setEditando(ing.id_ingreso);
    setEditData({ ...ing });
  };

  // Guardar edición
  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`${INGRESOS}/${id}`, {
        ...editData,
        cantidad: parseInt(editData.cantidad),
        precio_unitario: parseFloat(editData.precio_unitario),
        subtotal: parseFloat(editData.cantidad) * parseFloat(editData.precio_unitario)
      });
      setEditando(null);
      cargarIngresos();
    } catch {
      setError('No se pudo actualizar el ingreso.');
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = () => {
    setEditando(null);
    setEditData({});
  };

  // Filtrado de ingresos
  const ingresosFiltrados = ingresos.filter(ing =>
    (!filtroFecha || ing.fecha.slice(0, 10) === filtroFecha) &&
    (!filtroProveedor || String(ing.id_proveedor) === String(filtroProveedor))
);

  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="mb-3 display-5">Gestión de Ingresos</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Barra de filtros */}
      <div className="row g-2 mb-3 align-items-end flex-wrap">
        <div className="col-auto">
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={filtroProveedor}
            onChange={e => setFiltroProveedor(e.target.value)}
          >
            <option value="">Todos los proveedores</option>
            {proveedores.map(pr => (
              <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={() => { setFiltroFecha(''); setFiltroProveedor(''); }}>Limpiar filtros</button>
        </div>
      </div>

      {/* Formulario para crear ingreso */}
      <form
        onSubmit={handleCrear}
        className="p-4 bg-white rounded border mb-4 d-flex flex-wrap gap-2 align-items-end"
        style={{ maxWidth: 1200 }}
      >
        <input type="date" className="form-control" value={nuevo.fecha} onChange={e => setNuevo({ ...nuevo, fecha: e.target.value })} required style={{ maxWidth: 140 }} />
        <select className="form-select" value={nuevo.id_producto} onChange={e => setNuevo({ ...nuevo, id_producto: e.target.value })} required style={{ maxWidth: 180 }}>
          <option value="">Producto</option>
          {productos.map(p => (
            <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
          ))}
        </select>
        <select className="form-select" value={nuevo.id_proveedor} onChange={e => setNuevo({ ...nuevo, id_proveedor: e.target.value })} required style={{ maxWidth: 180 }}>
          <option value="">Proveedor</option>
          {proveedores.map(pr => (
            <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>
          ))}
        </select>
        <input type="number" className="form-control" min={1} placeholder="Cantidad" value={nuevo.cantidad} onChange={e => setNuevo({ ...nuevo, cantidad: e.target.value })} required style={{ maxWidth: 120 }} />
        <input type="number" className="form-control" min={0} step="0.01" placeholder="Precio Unitario" value={nuevo.precio_unitario} onChange={e => setNuevo({ ...nuevo, precio_unitario: e.target.value })} required style={{ maxWidth: 140 }} />
        <button type="submit" className="btn btn-success">Registrar ingreso</button>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-lg w-100">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Proveedor</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingresosFiltrados.map(ing => (
              <tr key={ing.id_ingreso}>
                {editando === ing.id_ingreso ? (
                  <>
                    <td><input type="date" className="form-control" value={editData.fecha} onChange={e => setEditData({ ...editData, fecha: e.target.value })} /></td>
                    <td>
                      <select className="form-select" value={editData.id_producto} onChange={e => setEditData({ ...editData, id_producto: e.target.value })}>
                        {productos.map(p => (
                          <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className="form-select" value={editData.id_proveedor} onChange={e => setEditData({ ...editData, id_proveedor: e.target.value })}>
                        {proveedores.map(pr => (
                          <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" className="form-control" min={1} value={editData.cantidad} onChange={e => setEditData({ ...editData, cantidad: e.target.value })} /></td>
                    <td><input type="number" className="form-control" min={0} step="0.01" value={editData.precio_unitario} onChange={e => setEditData({ ...editData, precio_unitario: e.target.value })} /></td>
                    <td>${(editData.cantidad && editData.precio_unitario) ? (parseFloat(editData.cantidad) * parseFloat(editData.precio_unitario)).toFixed(2) : ''}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-1" onClick={() => handleGuardarEdicion(ing.id_ingreso)}>Guardar</button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{formatearFecha(ing.fecha)}</td>
                    <td>{ing.producto}</td>
                    <td>{ing.proveedor}</td>
                    <td>{ing.cantidad}</td>
                    <td>${ing.precio_unitario}</td>
                    <td>${ing.subtotal}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(ing)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(ing.id_ingreso)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngresosContainer;