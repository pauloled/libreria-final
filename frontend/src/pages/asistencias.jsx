import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ASISTENCIAS, USUARIOS } from '../enpoints/endpoints';

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
  // Si la hora está vacía, usar '00:00'
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

  // Cargar asistencias y usuarios
  useEffect(() => {
    cargarAsistencias();
    axios.get(USUARIOS).then(res => setUsuarios(res.data));
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

  // Filtrar asistencias
  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    cargarAsistencias();
    // eslint-disable-next-line
  }, [filtros]);

  // Crear asistencia
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

  // Eliminar asistencia
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta asistencia?')) return;
    try {
      await axios.delete(`${ASISTENCIAS}/${id}`);
      cargarAsistencias();
    } catch {
      setError('No se pudo eliminar la asistencia.');
    }
  };

  // Iniciar edición
  const handleEditar = (asist) => {
    setEditando(asist.id_asistencia);
    setEditData({ ...asist });
  };

  // Guardar edición
  const handleGuardarEdicion = async (id) => {
    try {
      await axios.put(`${ASISTENCIAS}/${id}`, editData);
      setEditando(null);
      cargarAsistencias();
    } catch {
      setError('No se pudo actualizar la asistencia.');
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = () => {
    setEditando(null);
    setEditData({});
  };

  return (
    <div>
      <h2>Gestión de Asistencias</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: 16 }}>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} />
        <select name="usuario" value={filtros.usuario} onChange={handleFiltro}>
          <option value="">Todos los usuarios</option>
          {usuarios.map(u => (
            <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
          ))}
        </select>
        <button onClick={cargarAsistencias}>Filtrar</button>
      </div>

      {/* Formulario para crear asistencia */}
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {[...asistencias]
            .sort(compararAsistencias)
            .map(asist => (
            <tr key={asist.id_asistencia}>
              {editando === asist.id_asistencia ? (
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
              ) : (
                <>
                  <td>{asist.id_asistencia}</td>
                  <td>{usuarios.find(u => u.id_usuario === asist.id_usuario)?.nombre_usuario || asist.id_usuario}</td>
                  <td>{formatearFecha(asist.fecha)}</td>
                  <td>{formatearHora(asist.hora_entrada)}</td>
                  <td>{formatearHora(asist.hora_salida)}</td>
                  <td>{asist.corregida === 'SI' ? 'SI' : ''}</td>
                  <td>
                    <button onClick={() => handleEditar(asist)}>Editar</button>
                    <button onClick={() => handleEliminar(asist.id_asistencia)}>Eliminar</button>
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

export default Asistencias;