import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStationLookup } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";

export default function StationLookupPage() {
  const [map, setMap] = useState({});
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStationLookup().then((res) => setMap(res.data || {})).catch((err) => setError(err.message));
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(map)
      .filter(([code, name]) => !q || code.toLowerCase().includes(q) || name.toLowerCase().includes(q))
      .slice(0, 200);
  }, [map, query]);

  return (
    <section className="panel">
      <PageHeader eyebrow="Directory" title="Station lookup" lead="Search stations by code or name." />
      <div className="filters card">
        <input placeholder="Station code or name…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {error && <div className="empty-state">{error}</div>}
      <div className="train-table-wrap card">
        <table className="train-table">
          <thead><tr><th>Code</th><th>Name</th><th /></tr></thead>
          <tbody>
            {rows.map(([code, name]) => (
              <tr key={code}>
                <td><strong>{code}</strong></td>
                <td>{name}</td>
                <td><Link to={`/station/${code}/board`}>Timetable</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 200 && <p className="muted">Showing first 200 matches. Refine your search.</p>}
    </section>
  );
}
