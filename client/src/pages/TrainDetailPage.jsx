import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchTrainDetails } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";

export default function TrainDetailPage() {
  const { trainNumber } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    fetchTrainDetails(trainNumber, true).then(setData).catch((err) => setError(err.message));
  }, [trainNumber]);

  if (error) {
    return (
      <div className="empty-state">
        <h2 className="display">Schedule unavailable</h2>
        <p className="muted">{error}</p>
        <Link to="/trains">← Back</Link>
      </div>
    );
  }

  if (!data) return <div className="empty-state">Loading train schedule…</div>;

  const t = data.train;

  return (
    <section className="panel">
      <PageHeader
        eyebrow="Train schedule"
        title={`${t.number} — ${t.name}`}
        lead={`${t.type} · ${t.from?.name} → ${t.to?.name}`}
        actions={<Link className="secondary-action" to={`/train/${t.number}/live`}>Live status</Link>}
      />

      <div className="metric-grid">
        <article className="card"><span className="muted">Distance</span><strong>{t.distance} km</strong></article>
        <article className="card"><span className="muted">Duration</span><strong>{Math.floor(t.durationMinutes / 60)}h {t.durationMinutes % 60}m</strong></article>
        <article className="card"><span className="muted">Avg speed</span><strong>{t.avgSpeed} km/h</strong></article>
        <article className="card"><span className="muted">Halts</span><strong>{t.totalHalts}</strong></article>
      </div>

      {t.runDays?.length > 0 && <p className="muted">Runs: {t.runDays.join(", ")}</p>}

      <div className="train-table-wrap card">
        <table className="train-table">
          <thead><tr><th>#</th><th>Station</th><th>Arrival</th><th>Departure</th><th>Platform</th><th>Distance</th></tr></thead>
          <tbody>
            {data.route.map((stop) => (
              <tr key={`${stop.sequence}-${stop.station?.code}`}>
                <td>{stop.sequence}</td>
                <td><strong>{stop.station?.name}</strong><span className="muted"> {stop.station?.code}</span></td>
                <td>{stop.arrival || "—"}</td>
                <td>{stop.departure || "—"}</td>
                <td>{stop.platform || "—"}</td>
                <td>{stop.distance} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-actions">
        <Link className="primary-action inline-cta" to={`/train/${t.number}/live`}>Live status</Link>
        <Link className="secondary-action inline-cta" to={`/train/${t.number}/route`}>Route map</Link>
        <Link className="ghost-action inline-cta" to="/trains">← Back to results</Link>
      </div>
    </section>
  );
}
