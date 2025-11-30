import "../styles/dashboard.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Si más adelante usas token:
    // localStorage.removeItem("token");

    navigate("/"); // Redirige al login
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <h2>Catastro</h2>
        <nav>
          <ul>
            <li className={isActive("/dashboard") ? "active" : ""} onClick={() => goTo("/dashboard")}>
              Resumen
            </li>
            <li className={isActive("/dashboard/usuarios") ? "active" : ""} onClick={() => goTo("/dashboard/usuarios")}>
              Usuarios
            </li>
            <li className={isActive("/dashboard/propiedades") ? "active" : ""} onClick={() => goTo("/dashboard/propiedades")}>
              Propiedades
            </li>
            <li className={isActive("/dashboard/propietarios") ? "active" : ""} onClick={() => goTo("/dashboard/propietarios")}>
              Propietarios
            </li>
            <li className={isActive("/dashboard/reportes") ? "active" : ""} onClick={() => goTo("/dashboard/reportes")}>
              Reportes
            </li>
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Panel de Gestión Catastral</h1>

          {/* 👇 BOTÓN DE LOGOUT */}
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>

        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
