import { useState} from "react";
import type { FormEvent } from "react";

interface Propietario {
  id: number;
  nombre: string;
  ci: string;
  telefono: string;
}

function PropietariosPage() {
  const [propietarios, setPropietarios] = useState<Propietario[]>([
    { id: 1, nombre: "Juan Pérez", ci: "12345678", telefono: "70000000" },
  ]);

  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !ci.trim() || !telefono.trim()) return;

    if (editingId) {
      setPropietarios((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, nombre, ci, telefono } : p
        )
      );
    } else {
      const newId =
        propietarios.length > 0
          ? Math.max(...propietarios.map((p) => p.id)) + 1
          : 1;
      setPropietarios((prev) => [
        ...prev,
        { id: newId, nombre, ci, telefono },
      ]);
    }

    setNombre("");
    setCi("");
    setTelefono("");
    setEditingId(null);
  };

  const handleEdit = (p: Propietario) => {
    setEditingId(p.id);
    setNombre(p.nombre);
    setCi(p.ci);
    setTelefono(p.telefono);
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar este propietario?")) return;
    setPropietarios((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNombre("");
      setCi("");
      setTelefono("");
    }
  };

  return (
    <div>
      <h2>Gestión de Propietarios</h2>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="crud-row">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="CI/NIT"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <button type="submit">
          {editingId ? "Actualizar propietario" : "Registrar propietario"}
        </button>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CI/NIT</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propietarios.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.ci}</td>
              <td>{p.telefono}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {propietarios.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-row">
                No hay propietarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PropietariosPage;
