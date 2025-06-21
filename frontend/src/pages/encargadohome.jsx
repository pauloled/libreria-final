import React from 'react';
import { useNavigate } from 'react-router-dom';

const EncargadoHome = ({ usuario, logout }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Bienvenido/a, {usuario.nombre_usuario} (Encargado)</h2>
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => navigate('/productos')}>Productos</button>
        <button onClick={() => navigate('/ventas')}>Ventas</button>
        <button onClick={() => navigate('/asistencias')}>Asistencias</button>
        <button onClick={() => navigate('/ingresos')}>Ingresos</button>
        <button onClick={() => navigate('/proveedores')}>Proveedores</button>
      </div>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default EncargadoHome;