import { useNavigate } from "react-router-dom";

function DashboardHome() {
  const navigate = useNavigate();

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
    {
      key: "reportes",
      title: "Reportes",
      description: "Consultas para los diferentes Reportes.",
    },
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
