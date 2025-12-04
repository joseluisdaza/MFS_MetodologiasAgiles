import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Propietario {
  id: string;
  nombre: string;
  ci: string;
  telefono: string;
}

interface OwnerErrors {
  nombre?: string;
  ci?: string;
  telefono?: string;
  general?: string;
}

function PropietariosPage() {
  const navigate = useNavigate();
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);

  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<OwnerErrors>({});

  const validate = () => {
    const err: OwnerErrors = {};
    if (!nombre.trim()) err.nombre = "El nombre es obligatorio";
    if (!ci.trim()) err.ci = "El CI/NIT es obligatorio";
    else if (!/^\d{5,15}$/.test(ci)) err.ci = "CI/NIT debe tener 5-15 dígitos";
    if (!telefono.trim()) err.telefono = "El teléfono es obligatorio";
    else if (!/^\d{7,10}$/.test(telefono)) err.telefono = "Teléfono debe tener 7-10 dígitos";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  useEffect(() => {
    // Cargar owners desde backend
    fetch('/api/owners')
      .then(async (res) => {
        if (!res.ok) throw new Error('No se pudo obtener propietarios');
        const data = await res.json();
        const mapped: Propietario[] = data.map((o: any) => ({
          id: o.id,
          nombre: o.name,
          ci: o.ciNit,
          telefono: o.phone,
        }));
        setPropietarios(mapped);
      })
      .catch(() => {
        // Podríamos mostrar un mensaje, pero no bloqueamos la vista
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: 'Debe iniciar sesión para registrar propietarios' });
      navigate('/');
      return;
    }

    const id = editingId ?? crypto.randomUUID();
    setErrors({});
    try {
      const res = await fetch(`/api/owners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nombre, ciNit: ci, phone: telefono }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrors({ general: data?.message ?? 'No se pudo registrar/actualizar propietario' });
        return;
      }

      // Actualizar lista local
      setPropietarios((prev) => {
        const exists = prev.some((p) => p.id === id);
        const updated = { id, nombre, ci, telefono } as Propietario;
        return exists ? prev.map((p) => (p.id === id ? updated : p)) : [...prev, updated];
      });

      setNombre("");
      setCi("");
      setTelefono("");
      setEditingId(null);
    } catch {
      setErrors({ general: 'No se pudo conectar al servidor' });
    }
  };

  const handleEdit = (p: Propietario) => {
    setEditingId(p.id);
    setNombre(p.nombre);
    setCi(p.ci);
    setTelefono(p.telefono);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este propietario?")) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: 'Debe iniciar sesión para eliminar propietarios' });
      navigate('/');
      return;
    }

    try {
      const res = await fetch(`/api/owners/${id}` , {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrors({ general: data?.message ?? 'No se pudo eliminar el propietario' });
        return;
      }

      setPropietarios((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setNombre("");
        setCi("");
        setTelefono("");
      }
    } catch {
      setErrors({ general: 'No se pudo conectar al servidor' });
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
          {errors.nombre && (<span className="error-text">{errors.nombre}</span>)}
          <input
            type="text"
            placeholder="CI/NIT"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
          />
          {errors.ci && (<span className="error-text">{errors.ci}</span>)}
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          {errors.telefono && (<span className="error-text">{errors.telefono}</span>)}
        </div>
        {errors.general && (<div className="error-general">{errors.general}</div>)}
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
