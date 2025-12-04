import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ImportData {
  properties?: Array<{ id: string; unitNumber: string; cadastralCode: string; municipality: string; propertyClass: string; area: string; taxZone: string; propertyType: string; location: string }>;
  owners?: Array<{ id: string; name: string; ciNit: string; phone: string }>;
  links?: Array<{ propertyId: string; ownerId: string }>;
}

function ImportarDatosPage() {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState("");
  const [log, setLog] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [importing, setImporting] = useState(false);

  const appendLog = (line: string) => setLog(prev => (prev ? prev + "\n" : "") + line);

  const formatErrors = (d: any): string => {
    if (!d) return '';
    if (Array.isArray(d.errors)) {
      try {
        return d.errors
          .map((e: any) => {
            const entry = Object.entries(e)[0] as [string, any] | undefined;
            if (!entry) return JSON.stringify(e);
            const [field, msg] = entry;
            return `${field}: ${String(msg)}`;
          })
          .join('; ');
      } catch {
        return JSON.stringify(d.errors);
      }
    }
    return d.message ?? JSON.stringify(d);
  };

  const handleImport = async () => {
    setError(""); setLog("");
    let payload: ImportData;
    try {
      payload = JSON.parse(jsonText);
    } catch {
      setError("JSON inválido");
      return;
    }

    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (!token || !userRaw) { setError('Debe iniciar sesión'); navigate('/'); return; }
    const user = JSON.parse(userRaw);
    if (user?.role !== 'admin') { setError('Solo admin puede importar'); return; }

    const owners = payload.owners ?? [];
    const properties = payload.properties ?? [];
    const links = payload.links ?? [];

    setImporting(true);
    try {
      appendLog(`Importando propietarios: ${owners.length}`);
      for (const o of owners) {
        try {
          const res = await fetch(`/api/owners/${o.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: o.name, ciNit: o.ciNit, phone: o.phone })
          });
          if (!res.ok) { const d = await res.json().catch(() => null); appendLog(`Owner ${o.id} error: ${formatErrors(d) || res.status}`); }
          else appendLog(`Owner ${o.id} OK`);
        } catch { appendLog(`Owner ${o.id} error de red`); }
      }

      appendLog(`Importando propiedades: ${properties.length}`);
      for (const p of properties) {
        try {
          const res = await fetch(`/api/properties/${p.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              unitNumber: p.unitNumber,
              cadastralCode: p.cadastralCode,
              municipality: p.municipality,
              propertyClass: p.propertyClass,
              area: p.area,
              taxZone: p.taxZone,
              propertyType: p.propertyType,
              location: p.location,
            })
          });
          if (!res.ok) { const d = await res.json().catch(() => null); appendLog(`Property ${p.id} error: ${formatErrors(d) || res.status}`); }
          else appendLog(`Property ${p.id} OK`);
        } catch { appendLog(`Property ${p.id} error de red`); }
      }

      appendLog(`Importando relaciones: ${links.length}`);
      for (const l of links) {
        try {
          const res = await fetch(`/api/properties/${l.propertyId}/owners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ownerId: l.ownerId })
          });
          if (!res.ok) { const d = await res.json().catch(() => null); appendLog(`Link p:${l.propertyId} o:${l.ownerId} error: ${formatErrors(d) || res.status}`); }
          else appendLog(`Link p:${l.propertyId} o:${l.ownerId} OK`);
        } catch { appendLog(`Link p:${l.propertyId} o:${l.ownerId} error de red`); }
      }

      appendLog('Importación finalizada');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h2>Importar Datos</h2>
      <div className="crud-form">
        <div className="crud-row">
          <textarea
            placeholder="Pegue aquí el JSON de importación"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={{ minHeight: 240, width: '100%' }}
          />
        </div>
        {error && (<div className="error-general">{error}</div>)}
        <button onClick={handleImport} disabled={importing}>{importing ? 'Importando...' : 'Importar'}</button>
      </div>

      {log && (
        <div className="crud-table" style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>
          {log}
        </div>
      )}
    </div>
  );
}

export default ImportarDatosPage;
