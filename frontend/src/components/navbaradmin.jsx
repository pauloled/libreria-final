// components/NavbarAdmin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserCheck, FaUsers, FaBook, FaClipboardList, FaFileAlt, FaSignOutAlt
} from 'react-icons/fa';
import useUserStore from '../store/userStore';
import './NavbarAdmin.css';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const logout = useUserStore(state => state.logout);

  const items = [
    { icon: <FaUserCheck />, label: 'Asistencias', path: '/asistencias' },
    { icon: <FaUsers />, label: 'Usuarios', path: '/usuarios' },
    { icon: <FaBook />, label: 'Productos', path: '/productos' },
    { icon: <FaClipboardList />, label: 'Ventas', path: '/ventas' },
    { icon: <FaFileAlt />, label: 'Ingresos', path: '/ingresos' },
    { icon: <FaSignOutAlt />, label: 'Cerrar sesión', action: () => logout() },
  ];

  return (
    <div className="navbar-admin">
      {items.map((item, index) => (
        <div
          key={index}
          className="navbar-item"
          onClick={() => item.action ? item.action() : navigate(item.path)}
        >
          <div>{item.icon}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default NavbarAdmin;
