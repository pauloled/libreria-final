import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../Styles/adminhome.css';
import { FaUserCheck, FaUsers, FaBook, FaClipboardList, FaFileAlt, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import useUserStore from '../store/userStore';

const navItems = [
  { icon: <FaUserCheck />, label: 'Asistencias', path: '/asistencias' },
  { icon: <FaUsers />, label: 'Usuarios', path: '/usuarios' },
  { icon: <FaBook />, label: 'Productos', path: '/productos' },
  { icon: <FaClipboardList />, label: 'Ventas', path: '/ventas' },
  { icon: <FaFileAlt />, label: 'Ingresos', path: '/ingresos' },
  { icon: <FaTruck />, label: 'Proveedores', path: '/proveedores' },
];

const AdminLayoutContainer = () => {
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
          {navItems.map((item, idx) => (
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

export default AdminLayoutContainer;