import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VENTAS } from '../enpoints/endpoints';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(VENTAS)
      .then(res => setVentas(res.data))
      .catch(() => setError('No se pudieron cargar las ventas.'));
  }, []);

  return (
    <div>
      <h2>Página de Ventas</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {ventas.map(venta => (
          <li key={venta.id_venta || venta.id}>
            {venta.fecha} - Total: ${venta.total} - Usuario: {venta.id_usuario}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ventas;