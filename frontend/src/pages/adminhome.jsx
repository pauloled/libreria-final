import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = ({ usuario, logout }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Bienvenido/a, {usuario.nombre_usuario} (Admin)</h2>
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => navigate('/productos')}>Gestión de Productos</button>
        <button onClick={() => navigate('/ventas')}>Ventas</button>
        <button onClick={() => navigate('/usuarios')}>Usuarios</button>
        <button onClick={() => navigate('/asistencias')}>Asistencias</button>
        <button onClick={() => navigate('/ingresos')}>Ingresos</button>
      </div>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default AdminHome;