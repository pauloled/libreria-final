import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PRODUCTOS } from '../enpoints/endpoints';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(PRODUCTOS)
      .then(res => setProductos(res.data))
      .catch(() => setError('No se pudieron cargar los productos.'));
  }, []);

  return (
    <div>
      <h2>Página de Productos</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {productos.map(prod => (
          <li key={prod.id_producto || prod.id}>
            {prod.nombre} - ${prod.precio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;