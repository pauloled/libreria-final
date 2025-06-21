import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VENTAS, PRODUCTOS, USUARIOS } from '../enpoints/endpoints';

// Función para formatear la fecha
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ fecha: '', usuario: '' });
  const [nuevo, setNuevo] = useState({
    fecha: '',
    id_usuario: '',
    detalles: [],
    total: 0
  });
  const [detalle, setDetalle] = useState({ id_producto: '', cantidad: 1 });

  // Cargar ventas, productos y usuarios
  useEffect(() => {
    cargarVentas();
    axios.get(PRODUCTOS).then(res => setProductos(res.data));
    axios.get(USUARIOS).then(res => setUsuarios(res.data));
  }, []);

  const cargarVentas = () => {
    let url = VENTAS;
    const params = [];
    if (filtros.fecha) params.push(`fecha=${filtros.fecha}`);
    if (filtros.usuario) params.push(`usuario=${filtros.usuario}`);
    if (params.length) url += '?' + params.join('&');
    axios.get(url)
      .then(res => setVentas(res.data))
      .catch(() => setError('No se pudieron cargar las ventas.'));
  };

  // Filtrar ventas (en tiempo real)
  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({ fecha: '', usuario: '' });
  };

  useEffect(() => {
    cargarVentas();
    // eslint-disable-next-line
  }, [filtros]);

  // Añadir producto al detalle de la venta nueva
  const handleAddDetalle = () => {
    if (!detalle.id_producto || !detalle.cantidad) return;
    const prod = productos.find(p => p.id_producto === parseInt(detalle.id_producto));
    if (!prod) return;
    setNuevo({
      ...nuevo,
      detalles: [
        ...nuevo.detalles,
        {
          id_producto: prod.id_producto,
          nombre: prod.nombre,
          cantidad: detalle.cantidad,
          precio: prod.precio,
          subtotal: prod.precio * detalle.cantidad
        }
      ],
      total: nuevo.total + prod.precio * detalle.cantidad
    });
    setDetalle({ id_producto: '', cantidad: 1 });
  };

  // Eliminar producto del detalle
  const handleRemoveDetalle = (idx) => {
    const detalles = [...nuevo.detalles];
    const [eliminado] = detalles.splice(idx, 1);
    setNuevo({
      ...nuevo,
      detalles,
      total: nuevo.total - eliminado.subtotal
    });
  };

  // Crear venta
  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    if (!nuevo.fecha || !nuevo.id_usuario || nuevo.detalles.length === 0) {
      setError('Completa todos los campos y agrega al menos un producto.');
      return;
    }
    try {
      // Si el input es datetime-local, el valor es "YYYY-MM-DDTHH:mm"
      // MySQL espera "YYYY-MM-DD HH:mm:ss", así que reemplazamos la T por un espacio
      const fechaFormateada = nuevo.fecha.replace('T', ' ') + ':00';
      await axios.post(VENTAS, {
        fecha: fechaFormateada,
        id_usuario: nuevo.id_usuario,
        total: nuevo.total,
        detalles: nuevo.detalles
      });
      setNuevo({ fecha: '', id_usuario: '', detalles: [], total: 0 });
      cargarVentas();
    } catch {
      setError('No se pudo crear la venta.');
    }
  };

  // Eliminar venta
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    try {
      await axios.delete(`${VENTAS}/${id}`);
      cargarVentas();
    } catch {
      setError('No se pudo eliminar la venta.');
    }
  };

  // Obtener stock del producto seleccionado
  const stockSeleccionado = (() => {
    const prod = productos.find(p => p.id_producto === parseInt(detalle.id_producto));
    return prod ? prod.stock : 0;
  })();

  return (
    <div>
      <h2>Gestión de Ventas</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} />
        <select name="usuario" value={filtros.usuario} onChange={handleFiltro}>
          <option value="">Todos los usuarios</option>
          {usuarios.map(u => (
            <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
          ))}
        </select>
        <button onClick={limpiarFiltros}>Limpiar filtros</button>
      </div>

      {/* Formulario para crear venta */}
      <form onSubmit={handleCrear} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 12 }}>
        <input
          type="datetime-local"
          value={nuevo.fecha}
          onChange={e => setNuevo({ ...nuevo, fecha: e.target.value })}
          required
        />
        <select value={nuevo.id_usuario} onChange={e => setNuevo({ ...nuevo, id_usuario: e.target.value })} required>
          <option value="">Usuario</option>
          {usuarios.map(u => (
            <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
          ))}
        </select>
        {/* Detalle de productos */}
        <div>
          <select
            value={detalle.id_producto}
            onChange={e => setDetalle({ id_producto: e.target.value, cantidad: 1 })}
          >
            <option value="">Producto</option>
            {productos.map(p => (
              <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
            ))}
          </select>
          {/* Mostrar stock disponible */}
          {detalle.id_producto && (
            <span style={{ marginLeft: 8, color: '#888' }}>
              Stock: {stockSeleccionado}
            </span>
          )}
          {/* Input manual de cantidad */}
          <input
            type="number"
            min={1}
            value={detalle.cantidad}
            onChange={e => setDetalle({ ...detalle, cantidad: parseInt(e.target.value) || 1 })}
            disabled={!detalle.id_producto}
            style={{ marginLeft: 8, width: 60 }}
          />
          {/* Mensaje de stock insuficiente */}
          {detalle.id_producto && detalle.cantidad > stockSeleccionado && (
            <span style={{ color: 'red', marginLeft: 8 }}>Stock insuficiente</span>
          )}
          <button
            type="button"
            onClick={handleAddDetalle}
            disabled={
              !detalle.id_producto ||
              !detalle.cantidad ||
              detalle.cantidad < 1 ||
              detalle.cantidad > stockSeleccionado
            }
            style={{ marginLeft: 8 }}
          >
            Agregar producto
          </button>
        </div>
        {/* Lista de productos agregados */}
        <ul>
          {nuevo.detalles.map((d, idx) => (
            <li key={idx}>
              {d.nombre} x{d.cantidad} - ${d.precio} c/u - Subtotal: ${d.subtotal}
              <button type="button" onClick={() => handleRemoveDetalle(idx)}>Quitar</button>
            </li>
          ))}
        </ul>
        <div>Total: ${nuevo.total}</div>
        <button type="submit">Crear venta</button>
      </form>

      {/* Tabla de ventas */}
      <table border="1" cellPadding={8} style={{ width: '100%', background: 'white', color: 'black' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Artículos</th>
            <th>Total</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(venta => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{formatearFecha(venta.fecha)}</td>
              <td>{venta.articulos}</td>
              <td>${venta.total}</td>
              <td>{venta.nombre_usuario}</td>
              <td>
                <button onClick={() => handleEliminar(venta.id_venta)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;