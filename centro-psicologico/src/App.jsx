import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login"; // crea este componente según te dí antes
import AdminEditPanel from "./components/AdminEditPanel";
import PaymentConfirmation from './pages/PaymentConfirmation';

// En tus rutas:
<Route path="/payment/confirmation" element={<PaymentConfirmation />} />


function PrivateRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function EditProfessionalWrapper({ token, onLogout }) {
  const { id } = useParams();
  return <EditProfessional id={id} token={token} onLogout={onLogout} />;
}

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profesionales" element={<ProfessionalsPage />} />
        <Route path="/profesionales/:id" element={<ProfessionalDetail />} />
        <Route path="/sobrenosotros" element={<AboutUsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/edit/:id"
          element={
            <PrivateRoute token={token}>
              <EditProfessionalWrapper token={token} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edicion"
          element={
            <PrivateRoute token={token}>
              <AdminEditPanel token={token} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

      </Routes>
      <Footer />
    </Router>
  );
}
