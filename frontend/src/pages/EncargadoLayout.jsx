import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../Styles/adminhome.css';
import { FaBook, FaClipboardList, FaUserCheck, FaFileAlt, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import useUserStore from '../store/userStore';

const encargadoItems = [
  { icon: <FaBook />, label: 'Productos', path: '/productos' },
  { icon: <FaClipboardList />, label: 'Ventas', path: '/ventas' },
  { icon: <FaUserCheck />, label: 'Asistencias', path: '/asistencias' },
  { icon: <FaFileAlt />, label: 'Ingresos', path: '/ingresos' },
  { icon: <FaTruck />, label: 'Proveedores', path: '/proveedores' }
];

const EncargadoLayout = () => {
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
          {encargadoItems.map((item, idx) => (
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

export default EncargadoLayout;
