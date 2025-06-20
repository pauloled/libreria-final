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
import Proveedores from '../pages/proveedores';
import EmpleadoLayout from '../pages/EmpleadoLayout';
import EncargadoLayout from '../pages/EncargadoLayout';
import AdminLayout from '../pages/AdminLayout';

const AppRoutes = ({ usuario, logout }) => {
  if (!usuario) return <Navigate to="/" />;

  if (usuario.rol === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminHome usuario={usuario} logout={logout} />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="asistencias" element={<Asistencias />} />
          <Route path="ingresos" element={<Ingresos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  }
  if (usuario.rol === 'empleado') {
    return (
      <Routes>
        <Route path="/" element={<EmpleadoLayout />}>
          <Route index element={<EmpleadoHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="asistencias" element={<Asistencias />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  }
  if (usuario.rol === 'encargado') {
    return (
      <Routes>
        <Route path="/" element={<EncargadoLayout />}>
          <Route index element={<EncargadoHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="asistencias" element={<Asistencias />} />
          <Route path="ingresos" element={<Ingresos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    );
  }
  return <div>Rol no reconocido</div>;
};

export default AppRoutes;