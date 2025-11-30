import { useState } from "react";

interface Reporte {
  id: number;
  tipo: "Usuario" | "Propiedad" | "Propietario";
  entidad: string;
  descripcion: string;
  fecha: string;   // ISO simple
  estado: "Pendiente" | "Generado" | "Exportado";
}

function ReportesPage() {
  const [reportes] = useState<Reporte[]>([
    {
      id: 1,
      tipo: "Usuario",
      entidad: "Usuarios activos",
      descripcion: "Listado de usuarios con acceso vigente al sistema",
      fecha: "2025-11-01",
      estado: "Generado",
    },
    {
      id: 2,
      tipo: "Propiedad",
      entidad: "Propiedades por zona",
      descripcion: "Resumen de propiedades agrupadas por zona/categoría",
      fecha: "2025-11-10",
      estado: "Exportado",
    },
    {
      id: 3,
      tipo: "Propietario",
      entidad: "Deudas catastrales",
      descripcion: "Propietarios con obligaciones pendientes de pago",
      fecha: "2025-11-15",
      estado: "Pendiente",
    },
  ]);

  const [filtroTipo, setFiltroTipo] = useState<string>("Todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");

  const filtrados = reportes.filter((r) => {
    const porTipo = filtroTipo === "Todos" || r.tipo === filtroTipo;
    const porEstado = filtroEstado === "Todos" || r.estado === filtroEstado;
    return porTipo && porEstado;
  });

  const manejarGenerar = (reporte: Reporte) => {
    alert(`Generando reporte: ${reporte.entidad}`);
    // Aquí luego conectarás con backend / export PDF / Excel
  };

  return (
    <div>
      <h2>Reportes del Sistema</h2>

      {/* Filtros */}
      <div className="crud-form" style={{ marginBottom: 20 }}>
        <div className="crud-row">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Usuario">Usuarios</option>
            <option value="Propiedad">Propiedades</option>
            <option value="Propietario">Propietarios</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Generado">Generado</option>
            <option value="Exportado">Exportado</option>
          </select>
        </div>
      </div>

      {/* Tabla de reportes */}
      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Nombre del reporte</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.tipo}</td>
              <td>{r.entidad}</td>
              <td>{r.descripcion}</td>
              <td>{r.fecha}</td>
              <td>{r.estado}</td>
              <td>
                <button onClick={() => manejarGenerar(r)}>
                  Generar / Ver
                </button>
              </td>
            </tr>
          ))}

          {filtrados.length === 0 && (
            <tr>
              <td colSpan={7} className="empty-row">
                No hay reportes que coincidan con el filtro seleccionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportesPage;
