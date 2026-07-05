import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchStationLive } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";

export default function StationLivePage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStationLive(code, 4).then((res) => setData(res.data)).catch((err) => setError(err.message));
  }, [code]);

  if (error) return <div className="empty-state">{error}</div>;
  if (!data) return <div className="empty-state">Loading live board…</div>;

  return (
    <section className="panel">
      <PageHeader
        eyebrow="Live station board"
        title={data.station?.name || code}
        lead={`Window ${data.window?.from} – ${data.window?.to} · ${data.count} train(s)`}
        actions={<Link className="secondary-action" to={`/station/${code}/board`}>Full timetable</Link>}
      />
      <div className="train-list">
        {data.trains.map((row) => (
          <article key={row.train.number} className="train-card card">
            <div>
              <div className="train-head">
                <span className="train-number">{row.train.number}</span>
                <h3 className="display">{row.train.name}</h3>
                <span className="status-chip is-available">{row.live?.type || "scheduled"}</span>
              </div>
              <p className="muted">
                {row.stop?.arrival || "—"} / {row.stop?.departure || "—"}
                {row.live?.platform && ` · Platform ${row.live.platform}`}
                {row.live?.delayMinutes > 0 && ` · +${row.live.delayMinutes}m`}
              </p>
            </div>
            <Link className="ghost-action compact" to={`/train/${row.train.number}/live`}>Track</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
