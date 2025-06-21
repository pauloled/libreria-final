import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/adminhome.css';
import {
  FaBook, FaClipboardList, FaUserCheck, FaFileAlt, FaTruck, FaSignOutAlt
} from 'react-icons/fa';
import useUserStore from '../store/userStore';

const encargadoItems = [
  { icon: <FaBook />, label: 'Productos', path: '/productos' },
  { icon: <FaClipboardList />, label: 'Ventas', path: '/ventas' },
  { icon: <FaUserCheck />, label: 'Asistencias', path: '/asistencias' },
  { icon: <FaFileAlt />, label: 'Ingresos', path: '/ingresos' },
  { icon: <FaTruck />, label: 'Proveedores', path: '/proveedores' }
];

const EncargadoHome = () => {
  const navigate = useNavigate();
  const usuario = useUserStore(state => state.usuario);
  const logout = useUserStore(state => state.logout);

  if (!usuario) return null;

  return (
    <div className="admin-panel-fullscreen">
      <h2 className="admin-title">Bienvenido/a, {usuario.nombre_usuario} (Encargado)</h2>
      <div className="card-grid">
        {encargadoItems.map((item, i) => (
          <div
            key={i}
            className="card"
            onClick={() => navigate(item.path)}
          >
            <div className="icon">{item.icon}</div>
            <div className="label">{item.label}</div>
          </div>
        ))}
        <div className="card" onClick={logout}>
          <div className="icon"><FaSignOutAlt /></div>
          <div className="label">Cerrar sesión</div>
        </div>
      </div>
    </div>
  );
};

export default EncargadoHome;