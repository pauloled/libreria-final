import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from '../pages/adminhome';
import EmpleadoHome from '../pages/empleadohome';
import EncargadoHome from '../pages/encargadohome';
import Productos from '../pages/productos';
import Ventas from '../pages/ventas';
import Usuarios from '../pages/usuarios';
import Asistencias from '../pages/asistencias';
import Ingresos from '../pages/ingresos';

const AppRoutes = ({ usuario, logout }) => {
  if (!usuario) return <Navigate to="/" />;

  if (usuario.rol === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminHome usuario={usuario} logout={logout} />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  if (usuario.rol === 'empleado') {
    return (
      <Routes>
        <Route path="/" element={<EmpleadoHome usuario={usuario} logout={logout} />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  if (usuario.rol === 'encargado') {
    return (
      <Routes>
        <Route path="/" element={<EncargadoHome usuario={usuario} logout={logout} />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  return <div>Rol no reconocido</div>;
};

export default AppRoutes;