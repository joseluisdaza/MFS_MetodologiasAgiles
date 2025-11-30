import { useState} from "react";
import type { FormEvent } from "react";
interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: "Admin", correo: "admin@catastro.com", rol: "Administrador" },
  ]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim() || !rol.trim()) return;

    if (editingId) {
      // UPDATE
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingId ? { ...u, nombre, correo, rol } : u
        )
      );
    } else {
      // CREATE
      const newId =
        usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
      setUsuarios((prev) => [
        ...prev,
        { id: newId, nombre, correo, rol },
      ]);
    }

    // Reset form
    setNombre("");
    setCorreo("");
    setRol("");
    setEditingId(null);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setRol(usuario.rol);
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNombre("");
      setCorreo("");
      setRol("");
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="crud-row">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rol (Administrador, Operador...)"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
        </div>
        <button type="submit">
          {editingId ? "Actualizar usuario" : "Crear usuario"}
        </button>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => handleDelete(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-row">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsuariosPage;
