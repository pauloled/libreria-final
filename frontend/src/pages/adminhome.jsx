import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/adminhome.css';
import {
  FaUserCheck, FaUsers, FaBook, FaClipboardList, FaFileAlt, FaSignOutAlt
} from 'react-icons/fa';
import useUserStore from '../store/userStore';

const AdminHome = () => {
  const navigate = useNavigate();
  const usuario = useUserStore(state => state.usuario);
  const logout = useUserStore(state => state.logout);

  useEffect(() => {
    if (!usuario) {
      navigate('/');
    }
  }, [usuario, navigate]);

  const cards = [
    { icon: <FaUserCheck />, label: 'Asistencias', path: '/asistencias' },
    { icon: <FaUsers />, label: 'Usuarios', path: '/usuarios' },
    { icon: <FaBook />, label: 'Productos', path: '/productos' },
    { icon: <FaClipboardList />, label: 'Ventas', path: '/ventas' },
    { icon: <FaFileAlt />, label: 'Ingresos', path: '/ingresos' },
    { icon: <FaSignOutAlt />, label: 'Cerrar sesión', action: () => { logout(); } },
  ];

  if (!usuario) return null;

  return (
    <div className="admin-panel-fullscreen">
      <h2 className="admin-title">Bienvenido/a, {usuario.nombre_usuario}</h2>
      <div className="card-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className="card"
            onClick={() => card.action ? card.action() : navigate(card.path)}
          >
            <div className="icon">{card.icon}</div>
            <div className="label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
