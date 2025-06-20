import React, { useState } from 'react';
import axios from 'axios';
import { LOGIN } from '../enpoints/endpoints';

const Login = ({ onLogin }) => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Cambia los nombres de los campos si tu backend espera username y password
      const res = await axios.post(LOGIN, {
        username: nombre_usuario,
        password: contrasena,
      });
      if (res.data && res.data.user) {
        onLogin(res.data.user);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
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

export default Login;