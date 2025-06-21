import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VENTAS, PRODUCTOS, USUARIOS } from '../enpoints/endpoints';
import useUserStore from '../store/userStore';

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

const tiposPago = ['Efectivo', 'Tarjeta', 'Transferencia'];

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
  const [filtroProducto, setFiltroProducto] = useState('');
  const [metodosPago, setMetodosPago] = useState([{ tipo: '', monto: '' }]);
  const [filtroMetodoPago, setFiltroMetodoPago] = useState(''); // Nuevo estado para filtro
  const usuario = useUserStore(state => state.usuario);

  useEffect(() => {
    cargarVentas();
    axios.get(PRODUCTOS).then(res => setProductos(res.data));
    axios.get(USUARIOS).then(res => setUsuarios(res.data));
    if (usuario?.rol === 'empleado') {
      setFiltros(f => ({ ...f, usuario: usuario.id_usuario }));
      setNuevo(n => ({ ...n, id_usuario: usuario.id_usuario }));
    }
    // eslint-disable-next-line
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

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const limpiarFiltros = () => {
    setFiltroMetodoPago('');
    if (usuario?.rol === 'empleado') {
      setFiltros({ fecha: '', usuario: usuario.id_usuario });
    } else {
      setFiltros({ fecha: '', usuario: '' });
    }
  };

  useEffect(() => {
    cargarVentas();
    // eslint-disable-next-line
  }, [filtros]);

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

  const handleRemoveDetalle = (idx) => {
    const detalles = [...nuevo.detalles];
    const [eliminado] = detalles.splice(idx, 1);
    setNuevo({
      ...nuevo,
      detalles,
      total: nuevo.total - eliminado.subtotal
    });
  };

  // Métodos de pago
  const handleMetodoPagoChange = (idx, field, value) => {
    const nuevos = [...metodosPago];
    nuevos[idx][field] = value;
    setMetodosPago(nuevos);
  };

  const agregarMetodoPago = () => {
    setMetodosPago([...metodosPago, { tipo: '', monto: '' }]);
  };

  const quitarMetodoPago = (idx) => {
    setMetodosPago(metodosPago.filter((_, i) => i !== idx));
  };

  const sumaPagos = metodosPago.reduce((acc, mp) => acc + Number(mp.monto || 0), 0);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    if (!nuevo.fecha || !nuevo.id_usuario || nuevo.detalles.length === 0) {
      setError('Completa todos los campos y agrega al menos un producto.');
      return;
    }
    if (sumaPagos !== nuevo.total) {
      setError('La suma de los métodos de pago debe ser igual al total de la venta.');
      return;
    }
    try {
      const fechaFormateada = nuevo.fecha.replace('T', ' ') + ':00';
      await axios.post(VENTAS, {
        fecha: fechaFormateada,
        id_usuario: nuevo.id_usuario,
        total: nuevo.total,
        detalles: nuevo.detalles,
        metodos_pago: metodosPago
      });
      setNuevo({ fecha: '', id_usuario: usuario.id_usuario, detalles: [], total: 0 });
      setMetodosPago([{ tipo: '', monto: '' }]);
      cargarVentas();
    } catch {
      setError('No se pudo crear la venta.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    try {
      await axios.delete(`${VENTAS}/${id}`);
      cargarVentas();
    } catch {
      setError('No se pudo eliminar la venta.');
    }
  };

  const stockSeleccionado = (() => {
    const prod = productos.find(p => p.id_producto === parseInt(detalle.id_producto));
    return prod ? prod.stock : 0;
  })();

  // Filtrado por usuario y método de pago
  const ventasFiltradas = (
    (usuario?.rol === 'empleado'
      ? ventas.filter(v => v.id_usuario === usuario.id_usuario)
      : ventas
    ).filter(v =>
      !filtroMetodoPago ||
      (v.metodos_pago && v.metodos_pago.toLowerCase().includes(filtroMetodoPago.toLowerCase()))
    )
  );

  return (
    <div>
      <h2>Gestión de Ventas</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} />
        {usuario?.rol !== 'empleado' && (
          <select name="usuario" value={filtros.usuario} onChange={handleFiltro}>
            <option value="">Todos los usuarios</option>
            {usuarios.map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
            ))}
          </select>
        )}
        {/* Filtro por método de pago */}
        <select value={filtroMetodoPago} onChange={e => setFiltroMetodoPago(e.target.value)}>
          <option value="">Todos los métodos</option>
          {tiposPago.map(tp => (
            <option key={tp} value={tp}>{tp}</option>
          ))}
        </select>
        <button onClick={limpiarFiltros}>Limpiar filtros</button>
      </div>

      {/* Formulario de crear venta */}
      {(usuario?.rol !== 'empleado' || usuario?.rol === 'empleado') && (
        <form onSubmit={handleCrear} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 12 }}>
          <input
            type="datetime-local"
            value={nuevo.fecha}
            onChange={e => setNuevo({ ...nuevo, fecha: e.target.value })}
            required
          />
          {usuario?.rol !== 'empleado' ? (
            <select value={nuevo.id_usuario} onChange={e => setNuevo({ ...nuevo, id_usuario: e.target.value })} required>
              <option value="">Usuario</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
              ))}
            </select>
          ) : (
            <input type="hidden" value={usuario.id_usuario} />
          )}
          {/* Detalle de productos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filtroProducto}
              onChange={e => setFiltroProducto(e.target.value)}
              style={{ width: 180 }}
            />
            <select
              value={detalle.id_producto}
              onChange={e => setDetalle({ id_producto: e.target.value, cantidad: 1 })}
              style={{ width: 200 }}
            >
              <option value="">Producto</option>
              {productos
                .filter(p => p.nombre.toLowerCase().includes(filtroProducto.toLowerCase()))
                .map(p => (
                  <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                ))}
            </select>
            {detalle.id_producto && (
              <span style={{ color: '#888' }}>
                Stock: {stockSeleccionado}
              </span>
            )}
            <input
              type="number"
              min={1}
              value={detalle.cantidad}
              onChange={e => setDetalle({ ...detalle, cantidad: parseInt(e.target.value) || 1 })}
              disabled={!detalle.id_producto}
              style={{ width: 60 }}
            />
            {detalle.id_producto && detalle.cantidad > stockSeleccionado && (
              <span style={{ color: 'red' }}>Stock insuficiente</span>
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
            >
              Agregar producto
            </button>
          </div>
          <ul>
            {nuevo.detalles.map((d, idx) => (
              <li key={idx}>
                {d.nombre} x{d.cantidad} - ${d.precio} c/u - Subtotal: ${d.subtotal}
                <button type="button" onClick={() => handleRemoveDetalle(idx)}>Quitar</button>
              </li>
            ))}
          </ul>
          <div>Total: ${nuevo.total}</div>
          {/* Métodos de pago */}
          <div style={{ marginTop: 16 }}>
            <strong>Métodos de pago:</strong>
            {metodosPago.map((mp, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <select
                  value={mp.tipo}
                  onChange={e => handleMetodoPagoChange(idx, 'tipo', e.target.value)}
                  required
                >
                  <option value="">Tipo</option>
                  {tiposPago.map(tp => (
                    <option key={tp} value={tp}>{tp}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Monto"
                  value={mp.monto}
                  onChange={e => handleMetodoPagoChange(idx, 'monto', e.target.value)}
                  required
                />
                {metodosPago.length > 1 && (
                  <button type="button" onClick={() => quitarMetodoPago(idx)}>Quitar</button>
                )}
              </div>
            ))}
            <button type="button" onClick={agregarMetodoPago} disabled={sumaPagos >= nuevo.total}>Agregar método</button>
            <div style={{ color: sumaPagos !== nuevo.total ? 'red' : 'green' }}>
              Total métodos: ${sumaPagos} / Total venta: ${nuevo.total}
            </div>
          </div>
          <button type="submit">Crear venta</button>
        </form>
      )}

      {/* Tabla de ventas */}
      <table border="1" cellPadding={8} style={{ width: '100%', background: 'white', color: 'black' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Artículos</th>
            <th>Total</th>
            <th>Usuario</th>
            <th>Métodos de pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.map(venta => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{formatearFecha(venta.fecha)}</td>
              <td>{venta.articulos}</td>
              <td>${venta.total}</td>
              <td>{venta.nombre_usuario}</td>
              <td>{venta.metodos_pago}</td>
              <td>
                {(usuario?.rol !== 'empleado' || venta.id_usuario === usuario.id_usuario) && (
                  <button onClick={() => handleEliminar(venta.id_venta)}>Eliminar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
 };

 export default Ventas; 