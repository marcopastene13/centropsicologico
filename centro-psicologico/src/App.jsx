import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profesionales" element={<ProfessionalsPage />} />
        <Route path="/profesionales/:id" element={<ProfessionalDetail />} />
        <Route path="/sobrenosotros" element={<AboutUsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
