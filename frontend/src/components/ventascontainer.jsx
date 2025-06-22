import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VENTAS, PRODUCTOS, USUARIOS } from '../enpoints/endpoints';
import useUserStore from '../store/userStore';

// Formatea la fecha a dd/mm/yyyy
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
}

const tiposPago = ['Efectivo', 'Tarjeta', 'Transferencia'];

const VentasContainer = () => {
  // Estados principales
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ fecha: '', usuario: '' });
  const [nuevo, setNuevo] = useState({ fecha: '', id_usuario: '', detalles: [], total: 0 });
  const [detalle, setDetalle] = useState({ id_producto: '', cantidad: 1 });
  const [filtroProducto, setFiltroProducto] = useState('');
  const [metodosPago, setMetodosPago] = useState([{ tipo: '', monto: '' }]);
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('');
  const usuario = useUserStore(state => state.usuario);

  // Carga ventas, productos y usuarios al montar el componente
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

  // Vuelve a cargar ventas cuando cambian los filtros
  useEffect(() => {
    cargarVentas();
    // eslint-disable-next-line
  }, [filtros]);

  // Trae ventas del backend según los filtros
  function cargarVentas() {
    let url = VENTAS;
    const params = [];
    if (filtros.fecha) params.push(`fecha=${filtros.fecha}`);
    if (filtros.usuario) params.push(`usuario=${filtros.usuario}`);
    if (params.length) url += '?' + params.join('&');
    axios.get(url)
      .then(res => setVentas(res.data))
      .catch(() => setError('No se pudieron cargar las ventas.'));
  }

  // Maneja cambios en los filtros
  function handleFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  // Limpia los filtros (si es empleado, deja su usuario seleccionado)
  function limpiarFiltros() {
    setFiltroMetodoPago('');
    if (usuario?.rol === 'empleado') {
      setFiltros({ fecha: '', usuario: usuario.id_usuario });
    } else {
      setFiltros({ fecha: '', usuario: '' });
    }
  }

  // Agrega un producto al detalle de la venta
  function handleAddDetalle() {
    if (!detalle.id_producto || !detalle.cantidad) return;
    const prod = productos.find(p => p.id_producto === parseInt(detalle.id_producto));
    if (!prod) return;
    const cantidad = Number(detalle.cantidad); // Asegura que sea número
    const subtotal = prod.precio * cantidad;
    setNuevo(prev => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          id_producto: prod.id_producto,
          nombre: prod.nombre,
          cantidad,
          precio: prod.precio,
          subtotal
        }
      ],
      total: prev.total + subtotal
    }));
    setDetalle({ id_producto: '', cantidad: 1 });
  }

  // Quita un producto del detalle de la venta
  function handleRemoveDetalle(idx) {
    setNuevo(prev => {
      const detalles = [...prev.detalles];
      const [eliminado] = detalles.splice(idx, 1);
      return {
        ...prev,
        detalles,
        total: prev.total - (eliminado ? eliminado.subtotal : 0)
      };
    });
  }

  // Maneja cambios en los métodos de pago
  function handleMetodoPagoChange(idx, field, value) {
    setMetodosPago(prev => {
      const nuevos = [...prev];
      nuevos[idx][field] = value;
      return nuevos;
    });
  }

  // Agrega un método de pago
  function agregarMetodoPago() {
    setMetodosPago(prev => [...prev, { tipo: '', monto: '' }]);
  }

  // Quita un método de pago
  function quitarMetodoPago(idx) {
    setMetodosPago(prev => prev.filter((_, i) => i !== idx));
  }

  // Suma total de los métodos de pago
  const sumaPagos = metodosPago.reduce((acc, mp) => acc + Number(mp.monto || 0), 0);

  // Crea una nueva venta
  async function handleCrear(e) {
    e.preventDefault();
    setError('');
    if (!nuevo.id_usuario || nuevo.detalles.length === 0) {
      setError('Completa todos los campos y agrega al menos un producto.');
      return;
    }
    if (sumaPagos !== nuevo.total) {
      setError('La suma de los métodos de pago debe ser igual al total de la venta.');
      return;
    }
    try {
      // Asignar fecha y hora automáticamente
      const now = new Date();
      const pad = n => n.toString().padStart(2, '0');
      const fecha = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const hora = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      await axios.post(VENTAS, {
        fecha,
        hora,
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
  }

  // Elimina una venta
  async function handleEliminar(id) {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    try {
      await axios.delete(`${VENTAS}/${id}`);
      cargarVentas();
    } catch {
      setError('No se pudo eliminar la venta.');
    }
  }

  // Stock disponible del producto seleccionado
  const stockSeleccionado = (() => {
    const prod = productos.find(p => p.id_producto === parseInt(detalle.id_producto));
    return prod ? prod.stock : 0;
  })();

  // Filtra ventas según usuario y método de pago
  const ventasFiltradas = (
    (usuario?.rol === 'empleado'
      ? ventas.filter(v => v.id_usuario === usuario.id_usuario)
      : ventas
    ).filter(v =>
      !filtroMetodoPago ||
      (Array.isArray(v.metodos_pago)
        ? v.metodos_pago.some(mp => mp.tipo && mp.tipo.toLowerCase().includes(filtroMetodoPago.toLowerCase()))
        : (typeof v.metodos_pago === 'string' && v.metodos_pago.toLowerCase().includes(filtroMetodoPago.toLowerCase())))
    )
  );

  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="mb-3 display-5">Gestión de Ventas</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filtros */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-auto">
          <label className="form-label">Fecha</label>
          <input type="date" name="fecha" className="form-control" value={filtros.fecha} onChange={handleFiltro} />
        </div>
        {usuario?.rol !== 'empleado' && (
          <div className="col-auto">
            <label className="form-label">Usuario</label>
            <select name="usuario" className="form-select" value={filtros.usuario} onChange={handleFiltro}>
              <option value="">Todos los usuarios</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
              ))}
            </select>
          </div>
        )}
        <div className="col-auto">
          <label className="form-label">Método de pago</label>
          <select className="form-select" value={filtroMetodoPago} onChange={e => setFiltroMetodoPago(e.target.value)}>
            <option value="">Todos</option>
            {tiposPago.map(tp => (
              <option key={tp} value={tp}>{tp}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>
      </div>

      {/* Formulario de crear venta */}
      <form onSubmit={handleCrear} className="p-4 bg-white rounded border mb-4">
        {usuario?.rol !== 'empleado' && (
          <div className="mb-4">
            <label className="form-label">Usuario</label>
            <select
              className="form-select"
              value={nuevo.id_usuario}
              onChange={e => setNuevo({ ...nuevo, id_usuario: e.target.value })}
              required
            >
              <option value="">Usuario</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
              ))}
            </select>
          </div>
        )}

        <div className="row justify-content-center gap-4">
          {/* Sección productos */}
          <div className="col-md-5">
            <div className="p-3 bg-light border h-100 text-dark">
              <h5 className="mb-3" >Agregar Productos</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar producto..."
                value={filtroProducto}
                onChange={e => setFiltroProducto(e.target.value)}
              />
              <select
                className="form-select mb-2"
                value={detalle.id_producto}
                onChange={e => setDetalle({ id_producto: e.target.value, cantidad: 1 })}
              >
                <option value="">Producto</option>
                {productos
                  .filter(p => p.nombre.toLowerCase().includes(filtroProducto.toLowerCase()))
                  .map(p => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre} (${p.precio})
                    </option>
                  ))}
              </select>
              {detalle.id_producto && (
                <div className="mb-2 text-muted">Stock: {stockSeleccionado}</div>
              )}
              <input
                type="number"
                className="form-control mb-2"
                min={1}
                value={detalle.cantidad}
                onChange={e => setDetalle({ ...detalle, cantidad: parseInt(e.target.value) || 1 })}
                disabled={!detalle.id_producto}
              />
              {detalle.id_producto && detalle.cantidad > stockSeleccionado && (
                <div className="text-danger mb-2">Stock insuficiente</div>
              )}
              <button
                type="button"
                className="btn btn-primary w-100 mb-3"
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

              <ul className="list-group mb-2">
                {nuevo.detalles.map((d, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {d.nombre} x{d.cantidad} - ${d.subtotal}
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveDetalle(idx)}>Quitar</button>
                  </li>
                ))}
              </ul>

              <div className="fw-bold">Total: ${nuevo.total}</div>
            </div>
          </div>

          {/* Sección métodos de pago */}
          <div className="col-md-5">
            <div className="p-3 bg-light border h-100 text-dark">
              <h5 className="mb-3">Métodos de Pago</h5>
              {metodosPago.map((mp, idx) => (
                <div key={idx} className="input-group mb-2">
                  <select
                    className="form-select"
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
                    className="form-control"
                    value={mp.monto}
                    onChange={e => handleMetodoPagoChange(idx, 'monto', e.target.value)}
                    required
                  />
                  {metodosPago.length > 1 && (
                    <button type="button" className="btn btn-outline-danger" onClick={() => quitarMetodoPago(idx)}>Quitar</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary w-100 mb-3" onClick={agregarMetodoPago} disabled={sumaPagos >= nuevo.total}>Agregar método</button>
              <div className={`fw-bold ${sumaPagos !== nuevo.total ? 'text-danger' : 'text-success'}`}>
                Total métodos: ${sumaPagos} &nbsp;|&nbsp;
                Total faltante: ${Math.max(0, nuevo.total - sumaPagos)} &nbsp;|&nbsp;
                Total venta: ${nuevo.total}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success mt-4 w-100">Crear venta</button>
      </form>

      {/* Tabla de ventas */}
      <table className="table table-bordered table-striped table-lg w-100">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
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
              <td>{venta.hora}</td>
              <td>{venta.articulos}</td>
              <td>${venta.total}</td>
              <td>{venta.nombre_usuario}</td>
              <td>
                {Array.isArray(venta.metodos_pago)
                  ? venta.metodos_pago.map((mp, idx) => (
                      <span key={idx}>
                        {mp.tipo}: ${mp.monto}
                        {idx < venta.metodos_pago.length - 1 ? ' | ' : ''}
                      </span>
                    ))
                  : venta.metodos_pago}
              </td>
              <td>
                {(usuario?.rol !== 'empleado' || venta.id_usuario === usuario.id_usuario) && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(venta.id_venta)}>Eliminar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasContainer;