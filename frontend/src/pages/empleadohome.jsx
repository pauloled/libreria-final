import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmpleadoHome = ({ usuario, logout }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Bienvenido/a, {usuario.nombre_usuario} (Empleado)</h2>
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => navigate('/productos')}>Productos</button>
        <button onClick={() => navigate('/ventas')}>Mis Ventas</button>
        <button onClick={() => navigate('/asistencias')}>Mi Asistencia</button>
      </div>
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => alert('Registrar Ingreso')}>Ingreso</button>
        <button onClick={() => alert('Registrar Salida')}>Salida</button>
      </div>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default EmpleadoHome;