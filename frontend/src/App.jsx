import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import useUserStore from './store/userStore';
import AppRoutes from './router/router';

function App() {
  const { usuario, setUsuario, logout } = useUserStore();

  return (
    <BrowserRouter>
      <Routes>
        {!usuario ? (
          <Route path="*" element={<Login onLogin={setUsuario} />} />
        ) : (
          // Todas las rutas internas (productos, usuarios, etc.) están en AppRoutes
          <Route path="/*" element={<AppRoutes usuario={usuario} logout={logout} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;