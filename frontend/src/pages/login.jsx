import React, { useState } from 'react';
import axios from 'axios';
import { LOGIN } from '../enpoints/endpoints';
import '../Styles/login.css';


const Login = ({ onLogin }) => {
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
          <h1>Bienvenido!</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          
        </div>
        <div className="login-right">
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

export default Login;
