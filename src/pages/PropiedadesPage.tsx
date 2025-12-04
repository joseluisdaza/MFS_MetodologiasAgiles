import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Propiedad {
  id: string;
  numero_inmueble: string;
  codigo_catastral: string;
  gobierno_municipal: string;
  clase: string;
  area: string;
  zona_tributaria: string;
  tipo_propiedad: string;
  ubicacion: string;
}

function PropiedadesPage() {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  const [numero_inmueble, setNumeroInmueble] = useState("");
  const [codigo_catastral, setCodigoCatastral] = useState("");
  const [gobierno_municipal, setGobiernoMunicipal] = useState("");
  const [clase, setClase] = useState("");
  const [area, setArea] = useState("");
  const [zona_tributaria, setZonaTributaria] = useState("");
  const [tipo_propiedad, setTipoPropiedad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const validate = () => {
    if (!numero_inmueble.trim()) return "Número de inmueble es obligatorio";
    if (!codigo_catastral.trim() || !/^[0-9\-]+$/.test(codigo_catastral)) return "Código catastral inválido";
    if (!gobierno_municipal.trim()) return "Gobierno municipal es obligatorio";
    if (!clase.trim()) return "Clase es obligatoria";
    if (!area.trim()) return "Área es obligatoria";
    if (!zona_tributaria.trim()) return "Zona tributaria es obligatoria";
    if (!tipo_propiedad.trim()) return "Tipo de propiedad es obligatorio";
    if (!ubicacion.trim()) return "Ubicación es obligatoria";
    return "";
  };

  useEffect(() => {
    fetch('/api/properties')
      .then(async (res) => {
        if (!res.ok) throw new Error('No se pudo obtener propiedades');
        const data = await res.json();
        const mapped: Propiedad[] = (data as any[]).map((p: any) => ({
          id: p.id,
          numero_inmueble: p.unitNumber,
          codigo_catastral: p.cadastralCode,
          gobierno_municipal: p.municipality,
          clase: p.propertyClass,
          area: p.area,
          zona_tributaria: p.taxZone,
          tipo_propiedad: p.propertyType,
          ubicacion: p.location,
        }));
        setPropiedades(mapped);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    const token = localStorage.getItem('token');
    if (!token) { setError('Debe iniciar sesión'); navigate('/'); return; }
    const id = editingId ?? crypto.randomUUID();
    setError("");
    try {
      const body = {
        unitNumber: numero_inmueble,
        cadastralCode: codigo_catastral,
        municipality: gobierno_municipal,
        propertyClass: clase,
        area,
        taxZone: zona_tributaria,
        propertyType: tipo_propiedad,
        location: ubicacion,
      };
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? 'No se pudo guardar la propiedad');
        return;
      }
      const updated: Propiedad = { id, numero_inmueble, codigo_catastral, gobierno_municipal, clase, area, zona_tributaria, tipo_propiedad, ubicacion };
      setPropiedades((prev) => prev.some(p => p.id === id) ? prev.map(p => p.id === id ? updated : p) : [...prev, updated]);
      setEditingId(null);
      setNumeroInmueble(""); setCodigoCatastral(""); setGobiernoMunicipal(""); setClase(""); setArea(""); setZonaTributaria(""); setTipoPropiedad(""); setUbicacion("");
    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  const handleEdit = (p: Propiedad) => {
    setEditingId(p.id);
    setNumeroInmueble(p.numero_inmueble);
    setCodigoCatastral(p.codigo_catastral);
    setGobiernoMunicipal(p.gobierno_municipal);
    setClase(p.clase);
    setArea(p.area);
    setZonaTributaria(p.zona_tributaria);
    setTipoPropiedad(p.tipo_propiedad);
    setUbicacion(p.ubicacion);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta propiedad?")) return;
    const token = localStorage.getItem('token');
    if (!token) { setError('Debe iniciar sesión'); navigate('/'); return; }
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? 'No se pudo eliminar la propiedad');
        return;
      }
      setPropiedades((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setNumeroInmueble(""); setCodigoCatastral(""); setGobiernoMunicipal(""); setClase(""); setArea(""); setZonaTributaria(""); setTipoPropiedad(""); setUbicacion("");
      }
    } catch { setError('No se pudo conectar al servidor'); }
  };

  return (
    <div>
      <h2>Gestión de Propiedades</h2>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="crud-row">
          <input type="text" placeholder="Número de inmueble" value={numero_inmueble} onChange={(e) => setNumeroInmueble(e.target.value)} />
          <input type="text" placeholder="Código catastral" value={codigo_catastral} onChange={(e) => setCodigoCatastral(e.target.value)} />
          <input type="text" placeholder="Gobierno municipal" value={gobierno_municipal} onChange={(e) => setGobiernoMunicipal(e.target.value)} />
          <input type="text" placeholder="Clase" value={clase} onChange={(e) => setClase(e.target.value)} />
          <input type="text" placeholder="Área" value={area} onChange={(e) => setArea(e.target.value)} />
          <input type="text" placeholder="Zona tributaria" value={zona_tributaria} onChange={(e) => setZonaTributaria(e.target.value)} />
          <input type="text" placeholder="Tipo de propiedad" value={tipo_propiedad} onChange={(e) => setTipoPropiedad(e.target.value)} />
          <input type="text" placeholder="Ubicación" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
        </div>
        {error && (<div className="error-general">{error}</div>)}
        <button type="submit">
          {editingId ? "Actualizar propiedad" : "Registrar propiedad"}
        </button>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Código catastral</th>
            <th>Gobierno municipal</th>
            <th>Clase</th>
            <th>Área</th>
            <th>Zona tributaria</th>
            <th>Tipo propiedad</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propiedades.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.numero_inmueble}</td>
              <td>{p.codigo_catastral}</td>
              <td>{p.gobierno_municipal}</td>
              <td>{p.clase}</td>
              <td>{p.area}</td>
              <td>{p.zona_tributaria}</td>
              <td>{p.tipo_propiedad}</td>
              <td>{p.ubicacion}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {propiedades.length === 0 && (
            <tr>
              <td colSpan={10} className="empty-row">
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
