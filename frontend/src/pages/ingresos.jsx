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
      <ul>
        {ingresos.map(ing => (
          <li key={ing.id_ingreso || ing.id}>
            Producto: {ing.id_producto} - Cantidad: {ing.cantidad} - Proveedor: {ing.proveedor} - Total: ${ing.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingresos;