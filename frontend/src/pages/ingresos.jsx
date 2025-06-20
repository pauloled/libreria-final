import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INGRESOS } from '../enpoints/endpoints';

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(INGRESOS)
      .then(res => setIngresos(res.data))
      .catch(() => setError('No se pudieron cargar los ingresos.'));
  }, []);

  return (
    <div>
      <h2>Página de Ingresos</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map(ing => (
            <tr key={ing.id_ingreso}>
              <td>{ing.fecha}</td>
              <td>{ing.producto}</td>
              <td>{ing.proveedor}</td>
              <td>{ing.cantidad}</td>
              <td>${ing.precio_unitario}</td>
              <td>${ing.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ingresos;