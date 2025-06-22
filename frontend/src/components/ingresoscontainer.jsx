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
    <div>
      <h2>Página de Ingresos</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Barra de filtros */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="date"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />
        <select
          value={filtroProveedor}
          onChange={e => setFiltroProveedor(e.target.value)}
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map(pr => (
            <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>
          ))}
        </select>
        <button onClick={() => { setFiltroFecha(''); setFiltroProveedor(''); }}>Limpiar filtros</button>
      </div>

      {/* Formulario para crear ingreso */}
      <form onSubmit={handleCrear} style={{marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input type="date" value={nuevo.fecha} onChange={e => setNuevo({ ...nuevo, fecha: e.target.value })} required />
        <select value={nuevo.id_producto} onChange={e => setNuevo({ ...nuevo, id_producto: e.target.value })} required>
          <option value="">Producto</option>
          {productos.map(p => (
            <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
          ))}
        </select>
        <select value={nuevo.id_proveedor} onChange={e => setNuevo({ ...nuevo, id_proveedor: e.target.value })} required>
          <option value="">Proveedor</option>
          {proveedores.map(pr => (
            <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>
          ))}
        </select>
        <input type="number" min={1} placeholder="Cantidad" value={nuevo.cantidad} onChange={e => setNuevo({ ...nuevo, cantidad: e.target.value })} required />
        <input type="number" min={0} step="0.01" placeholder="Precio Unitario" value={nuevo.precio_unitario} onChange={e => setNuevo({ ...nuevo, precio_unitario: e.target.value })} required />
        <button type="submit">Registrar ingreso</button>
      </form>

      <table border="1" cellPadding={8} style={{ width: '100%', background: 'white', color: 'black' }}>
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
                  <td><input type="date" value={editData.fecha} onChange={e => setEditData({ ...editData, fecha: e.target.value })} /></td>
                  <td>
                    <select value={editData.id_producto} onChange={e => setEditData({ ...editData, id_producto: e.target.value })}>
                      {productos.map(p => (
                        <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={editData.id_proveedor} onChange={e => setEditData({ ...editData, id_proveedor: e.target.value })}>
                      {proveedores.map(pr => (
                        <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" min={1} value={editData.cantidad} onChange={e => setEditData({ ...editData, cantidad: e.target.value })} /></td>
                  <td><input type="number" min={0} step="0.01" value={editData.precio_unitario} onChange={e => setEditData({ ...editData, precio_unitario: e.target.value })} /></td>
                  <td>${(editData.cantidad && editData.precio_unitario) ? (parseFloat(editData.cantidad) * parseFloat(editData.precio_unitario)).toFixed(2) : ''}</td>
                  <td>
                    <button onClick={() => handleGuardarEdicion(ing.id_ingreso)}>Guardar</button>
                    <button onClick={handleCancelarEdicion}>Cancelar</button>
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
                    <button onClick={() => handleEditar(ing)}>Editar</button>
                    <button onClick={() => handleEliminar(ing.id_ingreso)}>Eliminar</button>
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

export default IngresosContainer;