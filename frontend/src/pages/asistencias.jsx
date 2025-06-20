import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ASISTENCIAS } from '../enpoints/endpoints';

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(ASISTENCIAS)
      .then(res => setAsistencias(res.data))
      .catch(() => setError('No se pudieron cargar las asistencias.'));
  }, []);

  return (
    <div>
      <h2>Página de Asistencias</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {asistencias.map(asist => (
          <li key={asist.id_asistencia || asist.id}>
            Usuario: {asist.id_usuario} - Fecha: {asist.fecha} - Entrada: {asist.hora_entrada} - Salida: {asist.hora_salida} - Corregida: {asist.corregida}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Asistencias;