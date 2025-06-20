import React from 'react';
import LoginForm from './components/login';
import useUserStore from './store/userStore';
import AdminHome from './pages/aminhome';
import EmpleadoHome from './pages/empleadohome';
import EncargadoHome from './pages/encargadohome';

function App() {
  const { usuario, setUsuario, logout } = useUserStore();

  if (!usuario) {
    return <LoginForm onLogin={setUsuario} />;
  }

  // Navegación según rol
  if (usuario.rol === 'admin') {
    return <AdminHome usuario={usuario} logout={logout} />;
  }
  if (usuario.rol === 'empleado') {
    return <EmpleadoHome usuario={usuario} logout={logout} />;
  }
  if (usuario.rol === 'encargado') {
    return <EncargadoHome usuario={usuario} logout={logout} />;
  }

  return <div>Rol no reconocido</div>;
}

export default App;