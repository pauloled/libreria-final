import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await axios.post('http://localhost:3001/api/login', {
      nombre_usuario,
      contrasena,
    });
    if (res.data && res.data.usuario) {
      onLogin(res.data.usuario);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  } catch (error) {
    // Puedes mostrar un mensaje genérico o uno más específico si existe respuesta del backend
    if (error.response && error.response.data && error.response.data.error) {
      setError(error.response.data.error);
    } else {
      setError('Error de conexión o servidor. Intenta nuevamente.');
    }
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={nombre_usuario}
        onChange={e => setNombreUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
};

export default Login