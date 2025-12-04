import "../styles/dashboard.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const role: string | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u?.role ?? null;
    } catch {
      return null;
    }
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (role === "viewer" && location.pathname !== "/dashboard/reportes") {
      navigate("/dashboard/reportes");
    }
    if (role !== "viewer" && location.pathname === "/dashboard/reportes") {
      navigate("/dashboard");
    }
  }, [navigate, role, location.pathname]);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <h2>Catastro</h2>
        <nav>
          <ul>
            {role !== "viewer" && (
              <>
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
              </>
            )}
            {role === "viewer" && (
              <li className={isActive("/dashboard/reportes") ? "active" : ""} onClick={() => goTo("/dashboard/reportes")}>
                Reportes
              </li>
            )}
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
