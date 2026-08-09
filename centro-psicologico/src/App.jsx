import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Login from './components/Login';
import AdminEditPanel from './components/AdminEditPanel';

import MainPage from './pages/MainPage';
import ProfessionalsPage from './pages/ProfessionalsPage';
import ProfessionalDetail from './pages/ProfessionalDetail';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';

import { wakeUpBackend } from './services/api';

// Ruta protegida
const PrivateRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);

  // Despertar el backend de Render al iniciar la app
  useEffect(() => {
    wakeUpBackend();
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profesionales" element={<ProfessionalsPage />} />
        <Route path="/profesionales/:id" element={<ProfessionalDetail />} />
        <Route path="/sobrenosotros" element={<AboutUsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute token={token}>
              <AdminEditPanel token={token} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        {/* Alias para compatibilidad con rutas antiguas */}
        <Route path="/professionals" element={<Navigate to="/profesionales" replace />} />
        <Route path="/professional/:id" element={<Navigate to="/profesionales" replace />} />
        <Route path="/about" element={<Navigate to="/sobrenosotros" replace />} />
        <Route path="/contact" element={<Navigate to="/contacto" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsAppFloat />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
