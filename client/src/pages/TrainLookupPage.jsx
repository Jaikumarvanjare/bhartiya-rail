import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTrainLookup } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";

export default function TrainLookupPage() {
  const [map, setMap] = useState({});
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrainLookup().then((res) => setMap(res.data || {})).catch((err) => setError(err.message));
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(map)
      .filter(([num, name]) => !q || num.includes(q) || name.toLowerCase().includes(q))
      .slice(0, 200);
  }, [map, query]);

  return (
    <section className="panel">
      <PageHeader eyebrow="Directory" title="Train lookup" lead="Search active trains by number or name." />
      <div className="filters card">
        <input placeholder="Train number or name…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {error && <div className="empty-state">{error}</div>}
      <div className="train-table-wrap card">
        <table className="train-table">
          <thead><tr><th>Number</th><th>Name</th><th /></tr></thead>
          <tbody>
            {rows.map(([num, name]) => (
              <tr key={num}>
                <td><strong>{num}</strong></td>
                <td>{name}</td>
                <td><Link to={`/train/${num}`}>Schedule</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 200 && <p className="muted">Showing first 200 matches. Refine your search.</p>}
    </section>
  );
}
