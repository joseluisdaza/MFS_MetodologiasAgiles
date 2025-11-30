import { useState} from "react";
import type { FormEvent } from "react";

interface Propiedad {
  id: number;
  codigo: string;
  direccion: string;
  superficie: number;
}

function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([
    { id: 1, codigo: "C-0001", direccion: "Av. Principal #123", superficie: 250 },
  ]);

  const [codigo, setCodigo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [superficie, setSuperficie] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!codigo.trim() || !direccion.trim() || !superficie.trim()) return;

    const superficieNum = Number(superficie);
    if (Number.isNaN(superficieNum) || superficieNum <= 0) return;

    if (editingId) {
      setPropiedades((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, codigo, direccion, superficie: superficieNum }
            : p
        )
      );
    } else {
      const newId =
        propiedades.length > 0
          ? Math.max(...propiedades.map((p) => p.id)) + 1
          : 1;
      setPropiedades((prev) => [
        ...prev,
        { id: newId, codigo, direccion, superficie: superficieNum },
      ]);
    }

    setCodigo("");
    setDireccion("");
    setSuperficie("");
    setEditingId(null);
  };

  const handleEdit = (p: Propiedad) => {
    setEditingId(p.id);
    setCodigo(p.codigo);
    setDireccion(p.direccion);
    setSuperficie(String(p.superficie));
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    setPropiedades((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setCodigo("");
      setDireccion("");
      setSuperficie("");
    }
  };

  return (
    <div>
      <h2>Gestión de Propiedades</h2>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="crud-row">
          <input
            type="text"
            placeholder="Código catastral"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <input
            type="number"
            placeholder="Superficie (m²)"
            value={superficie}
            onChange={(e) => setSuperficie(e.target.value)}
          />
        </div>
        <button type="submit">
          {editingId ? "Actualizar propiedad" : "Registrar propiedad"}
        </button>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Dirección</th>
            <th>Superficie (m²)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propiedades.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.codigo}</td>
              <td>{p.direccion}</td>
              <td>{p.superficie}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {propiedades.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-row">
                No hay propiedades registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PropiedadesPage;
