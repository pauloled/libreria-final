import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../Styles/adminhome.css';
import { FaBook, FaClipboardList, FaUserCheck, FaSignOutAlt } from 'react-icons/fa';
import useUserStore from '../store/userStore';

const empleadoItems = [
  { icon: <FaBook />, label: 'Productos', path: '/productos' },
  { icon: <FaClipboardList />, label: 'Mis Ventas', path: '/ventas' },
  { icon: <FaUserCheck />, label: 'Mi Asistencia', path: '/asistencias' }
];

const EmpleadoLayoutContainer = () => {
  const navigate = useNavigate();
  const logout = useUserStore(state => state.logout);

  return (
    <div className="admin-panel-fullscreen">
      <nav className="admin-navbar">
        <ul>
          <li onClick={() => navigate('/')}> {/* Navega internamente sin cerrar sesión */}
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </li>
          {empleadoItems.map((item, idx) => (
            <li key={idx} onClick={() => navigate(item.path)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
          <li onClick={logout}>
            <span className="nav-icon"><FaSignOutAlt /></span>
            <span>Cerrar sesión</span>
          </li>
        </ul>
      </nav>
      <div style={{width: '100%'}}>
        <Outlet />
      </div>
    </div>
  );
};

export default EmpleadoLayoutContainer;