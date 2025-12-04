import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";

function DashboardHome() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const cards = [
    {
      key: "usuarios",
      title: "Usuarios",
      description: "Gestión de usuarios del sistema.",
    },
    {
      key: "propiedades",
      title: "Propiedades",
      description: "Administración de propiedades catastrales.",
    },
    {
      key: "propietarios",
      title: "Propietarios",
      description: "Registro de propietarios y sus datos.",
    },
    ...(role === "viewer"
      ? [{ key: "reportes", title: "Reportes", description: "Consultas para los diferentes Reportes." }]
      : []),
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className="dashboard-card"
          onClick={() => navigate(`/dashboard/${card.key}`)}
        >
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <button>Ingresar</button>
        </div>
      ))}
    </div>
  );
}

export default DashboardHome;
