import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ASISTENCIAS, USUARIOS } from '../enpoints/endpoints';
import useUserStore from '../store/userStore';

// Función para formatear fecha
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Función para formatear hora (hh:mm)
function formatearHora(horaStr) {
  if (!horaStr) return '';
  return horaStr.slice(0, 5);
}

// Función para comparar fechas y horas correctamente
function compararAsistencias(a, b) {
  const fechaHoraA = `${a.fecha}T${a.hora_entrada ? a.hora_entrada.slice(0,5) : '00:00'}`;
  const fechaHoraB = `${b.fecha}T${b.hora_entrada ? b.hora_entrada.slice(0,5) : '00:00'}`;
  return new Date(fechaHoraB) - new Date(fechaHoraA);
}

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ fecha: '', usuario: '' });
  const [nuevo, setNuevo] = useState({
    id_usuario: '',
    fecha: '',
    hora_entrada: '',
    hora_salida: '',
    corregida: 'NO'
  });
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({});
  const usuario = useUserStore(state => state.usuario);

  useEffect(() => {
    cargarAsistencias();
    axios.get(USUARIOS).then(res => setUsuarios(res.data));
    // Si es empleado, filtra por su usuario
    if (usuario?.rol === 'empleado') {
      setFiltros(f => ({ ...f, usuario: usuario.id_usuario }));
    }
    // eslint-disable-next-line
  }, []);

  const cargarAsistencias = () => {
    let url = ASISTENCIAS;
    const params = [];
    if (filtros.fecha) params.push(`fecha=${filtros.fecha}`);
    if (filtros.usuario) params.push(`usuario=${filtros.usuario}`);
    if (params.length) url += '?' + params.join('&');
    axios.get(url)
      .then(res => setAsistencias(res.data))
      .catch(() => setError('No se pudieron cargar las asistencias.'));
  };

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    if (usuario?.rol === 'empleado') {
      setFiltros({ fecha: '', usuario: usuario.id_usuario });
    } else {
      setFiltros({ fecha: '', usuario: '' });
    }
  };

  useEffect(() => {
    cargarAsistencias();
    // eslint-disable-next-line
  }, [filtros]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(ASISTENCIAS, nuevo);
      setNuevo({
        id_usuario: '',
        fecha: '',
        hora_entrada: '',
        hora_salida: '',
        corregida: 'NO'
      });
      cargarAsistencias();
    } catch {
      setError('No se pudo crear la asistencia.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta asistencia?')) return;
    try {
      await axios.delete(`${ASISTENCIAS}/${id}`);
      cargarAsistencias();
    } catch {
      setError('No se pudo eliminar la asistencia.');
    }
  };

  const handleEditar = (asist) => {
    setEditando(asist.id_asistencia);
    setEditData({ ...asist });
  };

  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`${ASISTENCIAS}/${id}`, editData);
      setEditando(null);
      cargarAsistencias();
    } catch {
      setError('No se pudo actualizar la asistencia.');
    }
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setEditData({});
  };

  // --- BLOQUE DE INGRESO/SALIDA PARA EL USUARIO LOGUEADO ---
  const hoy = new Date().toISOString().slice(0,10);
  const asistenciaPendiente = asistencias.find(a =>
    a.id_usuario === usuario?.id_usuario &&
    a.fecha === hoy &&
    !a.hora_salida
  );

  const handleIngreso = async () => {
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0,10);
    const hora_entrada = ahora.toTimeString().slice(0,5);
    try {
      await axios.post(ASISTENCIAS, {
        id_usuario: usuario.id_usuario,
        fecha,
        hora_entrada,
        hora_salida: null,
        corregida: 'NO'
      });
      cargarAsistencias();
    } catch {
      setError('No se pudo registrar la asistencia.');
    }
  };

  const handleSalida = async () => {
    const ahora = new Date();
    const hora_salida = ahora.toTimeString().slice(0,5);
    try {
      await axios.put(`${ASISTENCIAS}/${asistenciaPendiente.id_asistencia}`, {
        ...asistenciaPendiente,
        hora_salida,
        corregida: 'NO'
      });
      cargarAsistencias();
    } catch {
      setError('No se pudo registrar la salida.');
    }
  };

  // Solo mostrar asistencias propias si es empleado
  const asistenciasFiltradas = usuario?.rol === 'empleado'
    ? asistencias.filter(a => a.id_usuario === usuario.id_usuario)
    : asistencias;

  return (
    <div>
      <h2>Gestión de Asistencias</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: 16 }}>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} />
        {/* Solo admins/encargados pueden filtrar por usuario */}
        {usuario?.rol !== 'empleado' && (
          <select name="usuario" value={filtros.usuario} onChange={handleFiltro}>
            <option value="">Todos los usuarios</option>
            {usuarios.map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
            ))}
          </select>
        )}
        <button onClick={limpiarFiltros} style={{ marginLeft: 8 }}>Limpiar filtros</button>
      </div>

      {/* Botones de ingreso/salida para el usuario logueado */}
      {usuario && (
        <div style={{ marginBottom: 16 }}>
          {!asistenciaPendiente ? (
            <button onClick={handleIngreso}>Registrar Ingreso</button>
          ) : (
            <button onClick={handleSalida}>Registrar Salida</button>
          )}
          {asistenciaPendiente && (
            <div style={{ color: 'orange', marginTop: 8 }}>
              Asistencia pendiente: {asistenciaPendiente.fecha} - Ingreso: {formatearHora(asistenciaPendiente.hora_entrada)}
            </div>
          )}
        </div>
      )}

      {/* Solo admins/encargados pueden crear asistencias para otros */}
      {usuario?.rol !== 'empleado' && (
        <form onSubmit={handleCrear} style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={nuevo.id_usuario} onChange={e => setNuevo({ ...nuevo, id_usuario: e.target.value })} required>
            <option value="">Usuario</option>
            {usuarios.map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
            ))}
          </select>
          <input type="date" value={nuevo.fecha} onChange={e => setNuevo({ ...nuevo, fecha: e.target.value })} required />
          <input type="time" value={nuevo.hora_entrada} onChange={e => setNuevo({ ...nuevo, hora_entrada: e.target.value })} required />
          <input type="time" value={nuevo.hora_salida} onChange={e => setNuevo({ ...nuevo, hora_salida: e.target.value })} required />
          <select value={nuevo.corregida} onChange={e => setNuevo({ ...nuevo, corregida: e.target.value })}>
            <option value="NO">No corregida</option>
            <option value="SI">Corregida</option>
          </select>
          <button type="submit">Registrar asistencia</button>
        </form>
      )}

      {/* Tabla de asistencias */}
      <table border="1" cellPadding={8} style={{ width: '100%', background: 'white', color: 'black' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Hora Entrada</th>
            <th>Hora Salida</th>
            <th>Corregida</th>
            {/* Solo admins/encargados pueden editar/eliminar */}
            {usuario?.rol !== 'empleado' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {[...asistenciasFiltradas]
            .sort(compararAsistencias)
            .filter(asist =>
              !(usuario && asist.id_usuario === usuario.id_usuario && asist.fecha === hoy && !asist.hora_salida)
            )
            .map(asist => (
            <tr key={asist.id_asistencia}>
              {editando === asist.id_asistencia ? (
                usuario?.rol !== 'empleado' && (
                  <>
                    <td>{asist.id_asistencia}</td>
                    <td>
                      <select value={editData.id_usuario} onChange={e => setEditData({ ...editData, id_usuario: e.target.value })}>
                        {usuarios.map(u => (
                          <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="date" value={editData.fecha} onChange={e => setEditData({ ...editData, fecha: e.target.value })} /></td>
                    <td><input type="time" value={editData.hora_entrada} onChange={e => setEditData({ ...editData, hora_entrada: e.target.value })} /></td>
                    <td><input type="time" value={editData.hora_salida} onChange={e => setEditData({ ...editData, hora_salida: e.target.value })} /></td>
                    <td>
                      <select value={editData.corregida} onChange={e => setEditData({ ...editData, corregida: e.target.value })}>
                        <option value="NO">No corregida</option>
                        <option value="SI">Corregida</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleGuardarEdicion(asist.id_asistencia)}>Guardar</button>
                      <button onClick={handleCancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                )
              ) : (
                <>
                  <td>{asist.id_asistencia}</td>
                  <td>{usuarios.find(u => u.id_usuario === asist.id_usuario)?.nombre_usuario || asist.id_usuario}</td>
                  <td>{formatearFecha(asist.fecha)}</td>
                  <td>{formatearHora(asist.hora_entrada)}</td>
                  <td>{formatearHora(asist.hora_salida)}</td>
                  <td>{asist.corregida === 'SI' ? 'SI' : ''}</td>
                  {usuario?.rol !== 'empleado' && (
                    <td>
                      <button onClick={() => handleEditar(asist)}>Editar</button>
                      <button onClick={() => handleEliminar(asist.id_asistencia)}>Eliminar</button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asistencias;