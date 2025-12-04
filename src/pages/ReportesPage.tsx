import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Owner {
  id: string;
  name: string;
  ciNit: string;
  phone: string;
}

interface PropertyRow {
  id: string;
  unitNumber: string;
  cadastralCode: string;
  municipality: string;
  propertyClass: string;
  area: string;
  taxZone: string;
  propertyType: string;
  location: string;
}

function ReportesPage() {
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

  useEffect(() => {
    if (role !== "viewer") {
      navigate('/dashboard');
    }
  }, [role, navigate]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Owner | null>(null);
  const [props, setProps] = useState<PropertyRow[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch('/api/owners')
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOwners((data as any[]).map(o => ({ id: o.id, name: o.name, ciNit: o.ciNit, phone: o.phone })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/owners/${selected.id}/properties`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProps((data as any[]).map(p => ({
          id: p.id,
          unitNumber: p.unitNumber,
          cadastralCode: p.cadastralCode,
          municipality: p.municipality,
          propertyClass: p.propertyClass,
          area: p.area,
          taxZone: p.taxZone,
          propertyType: p.propertyType,
          location: p.location,
        })));
      })
      .catch(() => {});
  }, [selected?.id]);

  const filtered = useMemo(() => owners.filter(o => o.name.toLowerCase().includes(search.toLowerCase())), [owners, search]);

  const [reportUrl, setReportUrl] = useState<string>("");
  const [showReport, setShowReport] = useState<boolean>(false);

  const generarReporteServidor = async () => {
    if (!selected) { setError('Debe seleccionar un propietario'); return; }
    const token = localStorage.getItem('token');
    if (!token) { setError('Debe iniciar sesión'); return; }
    setError("");
    try {
      const res = await fetch(`/api/owners/${selected.id}/report`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.message ?? 'No se pudo generar el reporte');
        return;
      }
      const data = await res.json();
      const url = (data.absoluteUrl as string) || (data.url as string);
      setReportUrl(url);
      setShowReport(true);
    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div>
      <h2>Generación de Reporte (PDF)</h2>
      <div className="crud-form" style={{ marginBottom: 20 }}>
        <div className="crud-row">
          <input type="text" placeholder="Buscar propietario por nombre" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="crud-table" style={{ padding: 10, background: '#fff' }}>
        {filtered.slice(0, 10).map(o => (
          <div key={o.id} className="modal-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span>{o.name} ({o.ciNit})</span>
            <button onClick={() => setSelected(o)}>Seleccionar</button>
          </div>
        ))}
        {filtered.length === 0 && (<div>No hay resultados.</div>)}
      </div>

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Propietario seleccionado</h3>
          <div>Nombre: {selected.name}</div>
          <div>CI/NIT: {selected.ciNit}</div>
          <div>Teléfono: {selected.phone}</div>
          <h4 style={{ marginTop: 12 }}>Propiedades</h4>
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Catastral</th>
                <th>Municipio</th>
                <th>Clase</th>
                <th>Área</th>
                <th>Zona</th>
                <th>Tipo</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {props.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.unitNumber}</td>
                  <td>{p.cadastralCode}</td>
                  <td>{p.municipality}</td>
                  <td>{p.propertyClass}</td>
                  <td>{p.area}</td>
                  <td>{p.taxZone}</td>
                  <td>{p.propertyType}</td>
                  <td>{p.location}</td>
                </tr>
              ))}
              {props.length === 0 && (
                <tr><td colSpan={9} className="empty-row">No tiene propiedades registradas.</td></tr>
              )}
            </tbody>
          </table>
          {error && (<div className="error-general" style={{ marginTop: 10 }}>{error}</div>)}
          <button style={{ marginTop: 10 }} onClick={generarReporteServidor}>Generar reporte</button>
        </div>
      )}
      {showReport && reportUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80vw', height: '80vh', background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Reporte generado</strong>
              <button onClick={() => setShowReport(false)}>Cerrar</button>
            </div>
            <object data={reportUrl} type="application/pdf" style={{ flex: 1 }}>
              <iframe title="Reporte" src={reportUrl} style={{ flex: 1, border: 'none' }} />
            </object>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportesPage;
