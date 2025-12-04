import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import UsuariosPage from "./pages/UsuariosPage";
import PropiedadesPage from "./pages/PropiedadesPage";
import PropietariosPage from "./pages/PropietariosPage";
import ReportesPage from "./pages/ReportesPage";
import ImportarDatosPage from "./pages/ImportarDatosPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas anidadas del dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="propiedades" element={<PropiedadesPage />} />
          <Route path="propietarios" element={<PropietariosPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="importar" element={<ImportarDatosPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
