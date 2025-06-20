import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USUARIOS } from '../enpoints/endpoints';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(USUARIOS)
      .then(res => setUsuarios(res.data))
      .catch(() => setError('No se pudieron cargar los usuarios.'));
  }, []);

  return (
    <div>
      <h2>Página de Usuarios</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {usuarios.map(user => (
          <li key={user.id_usuario || user.id}>
            {user.nombre_usuario} - {user.rol}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;