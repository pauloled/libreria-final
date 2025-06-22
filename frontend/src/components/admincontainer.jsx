import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/adminhome.css';
import {
  FaUserCheck, FaUsers, FaBook, FaClipboardList, FaFileAlt, FaTruck, FaSignOutAlt
} from 'react-icons/fa';
import useUserStore from '../store/userStore';

const navItems = [
  { icon: <FaUserCheck />, label: 'Asistencias', path: '/asistencias' },
  { icon: <FaUsers />, label: 'Usuarios', path: '/usuarios' },
  { icon: <FaBook />, label: 'Productos', path: '/productos' },
  { icon: <FaClipboardList />, label: 'Ventas', path: '/ventas' },
  { icon: <FaFileAlt />, label: 'Ingresos', path: '/ingresos' },
  { icon: <FaTruck />, label: 'Proveedores', path: '/proveedores' },
];

const AdminContainer = () => {
  const navigate = useNavigate();
  const usuario = useUserStore(state => state.usuario);
  const logout = useUserStore(state => state.logout);

  useEffect(() => {
    if (!usuario) {
      navigate('/');
    }
  }, [usuario, navigate]);

  // Solo mostrar si es admin
  const isAdmin = usuario && usuario.rol === 'admin';

  const handleNav = (item) => {
    if (item.path) navigate(item.path);
    if (item.action) item.action();
  };

  if (!usuario) return null;

  return (
    <div className="admin-panel-fullscreen">
      {isAdmin && (
        <nav className="admin-navbar">
          <ul>
            {navItems.map((item, idx) => (
              <li key={idx} onClick={() => handleNav(item)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
            <li onClick={() => { logout(); }}>
              <span className="nav-icon"><FaSignOutAlt /></span>
              <span>Cerrar sesión</span>
            </li>
          </ul>
        </nav>
      )}
      <h2 className="admin-title">Bienvenido/a, {usuario.nombre_usuario}</h2>
      <div className="card-grid">
        {navItems.map((card, i) => (
          <div
            key={i}
            className="card"
            onClick={() => handleNav(card)}
          >
            <div className="icon">{card.icon}</div>
            <div className="label">{card.label}</div>
          </div>
        ))}
        <div className="card" onClick={() => { logout(); }}>
          <div className="icon"><FaSignOutAlt /></div>
          <div className="label">Cerrar sesión</div>
        </div>
      </div>
    </div>
  );
};

export default AdminContainer;