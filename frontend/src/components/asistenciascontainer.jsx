import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ASISTENCIAS, USUARIOS } from '../enpoints/endpoints';
import useUserStore from '../store/userStore';

// Formatea la fecha a dd/mm/yyyy
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Devuelve solo hh:mm de una hora
function formatearHora(horaStr) {
  return horaStr ? horaStr.slice(0, 5) : '';
}

// Ordena asistencias por fecha y hora de entrada descendente
function compararAsistencias(a, b) {
  const fechaHoraA = `${a.fecha}T${a.hora_entrada ? a.hora_entrada.slice(0,5) : '00:00'}`;
  const fechaHoraB = `${b.fecha}T${b.hora_entrada ? b.hora_entrada.slice(0,5) : '00:00'}`;
  return new Date(fechaHoraB) - new Date(fechaHoraA);
}

const AsistenciasContainer = () => {
  // Estados principales
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

  // Carga asistencias y usuarios al montar el componente
  useEffect(() => {
    cargarAsistencias();
    axios.get(USUARIOS).then(res => setUsuarios(res.data));
    if (usuario?.rol === 'empleado') {
      setFiltros(f => ({ ...f, usuario: usuario.id_usuario }));
    }
    // eslint-disable-next-line
  }, []);

  // Vuelve a cargar asistencias cuando cambian los filtros
  useEffect(() => {
    cargarAsistencias();
    // eslint-disable-next-line
  }, [filtros]);

  // Trae asistencias del backend según los filtros
  function cargarAsistencias() {
    let url = ASISTENCIAS;
    const params = [];
    if (filtros.fecha) params.push(`fecha=${filtros.fecha}`);
    if (filtros.usuario) params.push(`usuario=${filtros.usuario}`);
    if (params.length) url += '?' + params.join('&');
    axios.get(url)
      .then(res => setAsistencias(res.data))
      .catch(() => setError('No se pudieron cargar las asistencias.'));
  }

  // Maneja cambios en los filtros
  function handleFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  // Limpia los filtros (si es empleado, deja su usuario seleccionado)
  function limpiarFiltros() {
    if (usuario?.rol === 'empleado') {
      setFiltros({ fecha: '', usuario: usuario.id_usuario });
    } else {
      setFiltros({ fecha: '', usuario: '' });
    }
  }

  // Crea una nueva asistencia
  async function handleCrear(e) {
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
  }

  // Elimina una asistencia
  async function handleEliminar(id) {
    if (!window.confirm('¿Seguro que deseas eliminar esta asistencia?')) return;
    try {
      await axios.delete(`${ASISTENCIAS}/${id}`);
      cargarAsistencias();
    } catch {
      setError('No se pudo eliminar la asistencia.');
    }
  }

  // Activa el modo edición para una asistencia
  function handleEditar(asist) {
    setEditando(asist.id_asistencia);
    setEditData({ ...asist });
  }

  // Guarda los cambios de una asistencia editada
  async function handleGuardarEdicion(id) {
    try {
      await axios.put(`${ASISTENCIAS}/${id}`, editData);
      setEditando(null);
      cargarAsistencias();
    } catch {
      setError('No se pudo actualizar la asistencia.');
    }
  }

  // Cancela la edición
  function handleCancelarEdicion() {
    setEditando(null);
    setEditData({});
  }

  // --------- SOLO BOTONES Y FECHA ---------
  const hoy = new Date().toISOString().slice(0,10);

  // Filtra asistencias según el rol
  const asistenciasFiltradas = usuario?.rol === 'empleado'
    ? asistencias.filter(a => a.id_usuario === usuario.id_usuario)
    : asistencias;

  // Registrar ingreso
  async function handleIngreso() {
    setError('');
    try {
      const res = await axios.get(`${ASISTENCIAS}?usuario=${usuario.id_usuario}&fecha=${hoy}`);
      const pendiente = res.data.find(a => !a.hora_salida);
      if (pendiente) {
        setError('Ya tienes una asistencia pendiente de salida para hoy.');
        return;
      }
      const hora_entrada = new Date().toTimeString().slice(0,5);
      await axios.post(ASISTENCIAS, {
        id_usuario: usuario.id_usuario,
        fecha: hoy,
        hora_entrada,
        hora_salida: null,
        corregida: 'NO'
      });
      cargarAsistencias();
    } catch {
      setError('No se pudo registrar la asistencia.');
    }
  }

  // Registrar salida
  async function handleSalida() {
    setError('');
    try {
      const res = await axios.get(`${ASISTENCIAS}?usuario=${usuario.id_usuario}&fecha=${hoy}`);
      const pendiente = res.data.find(a => !a.hora_salida);
      if (!pendiente) {
        setError('No tienes una asistencia pendiente de salida.');
        return;
      }
      const hora_salida = new Date().toTimeString().slice(0,5);
      await axios.put(`${ASISTENCIAS}/${pendiente.id_asistencia}`, {
        ...pendiente,
        hora_salida,
        corregida: 'NO'
      });
      cargarAsistencias();
    } catch {
      setError('No se pudo registrar la salida.');
    }
  }

  // Render principal
  return (
    <div>
      <h2>Gestión de Asistencias</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: 16 }}>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} />
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

      {/* Solo fecha y botones de registro */}
      {usuario && (
        <div style={{
          marginBottom: 16,
          border: '1px solid #ccc',
          padding: 12,
          borderRadius: 8,
          background: '#f9f9f9',
          color: '#333'
        }}>
          <div>Fecha: {hoy}</div>
          <div style={{marginTop: 8}}>
            <button
              onClick={handleIngreso}
              style={{ marginRight: 8 }}
            >
              Registrar Ingreso
            </button>
            <button onClick={handleSalida}>Registrar Salida</button>
          </div>
        </div>
      )}

      {/* Formulario para crear asistencia (solo admins/encargados) */}
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
            {usuario?.rol !== 'empleado' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {[...asistenciasFiltradas]
            .sort(compararAsistencias)
            .map(asist => (
              <tr key={asist.id_asistencia}>
                {editando === asist.id_asistencia ? (
                  <>
                    {/* Fila en modo edición */}
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
                ) : (
                  <>
                    {/* Fila normal */}
                    <td>{asist.id_asistencia}</td>
                    <td>{usuarios.find(u => u.id_usuario === asist.id_usuario)?.nombre_usuario || asist.id_usuario}</td>
                    <td>{formatearFecha(asist.fecha)}</td>
                    <td>{formatearHora(asist.hora_entrada)}</td>
                    <td>{formatearHora(asist.hora_salida)}</td>
                    <td>{asist.corregida}</td>
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

export default AsistenciasContainer;