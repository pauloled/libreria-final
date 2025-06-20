import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import useUserStore from './store/userStore';
import AppRoutes from './router/router';

function App() {
  const { usuario, setUsuario, logout } = useUserStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            usuario ? (
              <AppRoutes usuario={usuario} logout={logout} />
            ) : (
              <Login onLogin={setUsuario} />
            )
          }
        />
        {/* Puedes agregar rutas públicas aquí si lo necesitas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;