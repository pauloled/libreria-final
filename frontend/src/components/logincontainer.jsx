import React, { useState } from 'react';
import axios from 'axios';
import { LOGIN } from '../enpoints/endpoints';
import '../Styles/login.css';

const LoginContainer = ({ onLogin }) => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
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
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error de conexión o servidor. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>Bienvenido a Libreria Escolarium!</h1>
          <h3>Este espacio está diseñado para facilitar tu trabajo y mejorar la organización interna.
          </h3>
          
        </div>
        <div className="login-right">
<img src="/assets/logopng.png" alt="Logo Librería" className="login-logo" />
          <h2>Iniciar Sesion</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User Name"
              value={nombre_usuario}
              onChange={e => setNombreUsuario(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
            />
            <button type="submit">Ingresar</button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
