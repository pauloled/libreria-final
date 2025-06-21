import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import useUserStore from './store/userStore';
import AppRoutes from './router/router';
import axios from 'axios';
import { ASISTENCIAS } from './enpoints/endpoints';

function App() {
  const { usuario, setUsuario, logout } = useUserStore();
  const [asistencias, setAsistencias] = useState([]);

  // Cargar asistencias del usuario actual
  useEffect(() => {
    if (usuario) {
      axios.get(`${ASISTENCIAS}?usuario=${usuario.id_usuario}`)
        .then(res => setAsistencias(res.data))
        .catch(() => setAsistencias([]));
    }
  }, [usuario]);

  // Chequeo de asistencia pendiente
  const hoy = new Date().toISOString().slice(0,10);
  const asistenciaPendiente = asistencias.find(a =>
    a.id_usuario === usuario?.id_usuario &&
    a.fecha === hoy &&
    !a.hora_salida
  );

  // Función de logout con chequeo
  const logoutConChequeo = () => {
    if (asistenciaPendiente) {
      alert('No puedes cerrar sesión con una asistencia pendiente de salida. Marca tu salida primero en Asistencias.');
      return;
    }
    logout();
  };

  return (
    <BrowserRouter>
      <Routes>
        {!usuario ? (
          <Route path="*" element={<Login onLogin={setUsuario} />} />
        ) : (
          <Route path="/*" element={<AppRoutes usuario={usuario} logout={logoutConChequeo} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;