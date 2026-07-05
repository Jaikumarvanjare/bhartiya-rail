import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchLiveStatus } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";

function formatTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function TrainLivePage() {
  const { trainNumber: paramNo } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initial = paramNo || params.get("train") || "";
  const [trainInput, setTrainInput] = useState(initial);
  const [live, setLive] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadLive(number) {
    if (!number.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchLiveStatus(number.trim(), { haltsOnly: true });
      setLive(data);
      if (!paramNo) navigate(`/train/${number.trim()}/live`, { replace: true });
    } catch (err) {
      setError(err.message);
      setLive(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initial) loadLive(initial);
  }, [initial]);

  return (
    <section className="panel">
      <PageHeader eyebrow="Live tracking" title="Running status" lead="Real-time position, delay, and halt-wise progress." />

      <form className="card service-form" onSubmit={(e) => { e.preventDefault(); loadLive(trainInput); }}>
        <label>Train number<input value={trainInput} onChange={(e) => setTrainInput(e.target.value)} placeholder="e.g. 12919" /></label>
        <button className="primary-action" type="submit" disabled={loading}>{loading ? "Tracking…" : "Track train"}</button>
      </form>

      {error && <div className="empty-state">{error}</div>}

      {live && (
        <>
          <article className="card ticket-card">
            <h2 className="display">{live.train} — {live.trainName}</h2>
            <p><strong>{live.status}</strong>{live.delayMinutes > 0 && ` · ${live.delayMinutes} min delay`}</p>
            <p className="muted">
              {live.lastStation && `Last: ${live.lastStation}`}
              {live.nextStation && ` · Next: ${live.nextStation}`}
              {live.speedKmph != null && ` · ${live.speedKmph} km/h`}
              {live.platform && ` · Platform ${live.platform}`}
            </p>
            <div className="progress-bar" role="progressbar" aria-valuenow={live.progress}><span style={{ width: `${live.progress}%` }} /></div>
          </article>

          <div className="train-table-wrap card">
            <table className="train-table">
              <thead><tr><th>Station</th><th>Scheduled</th><th>Actual</th><th>Status</th></tr></thead>
              <tbody>
                {(live.stops || []).map((stop) => (
                  <tr key={`${stop.code}-${stop.name}`} className={`live-row is-${stop.state}`}>
                    <td><strong>{stop.name}</strong> <span className="muted">{stop.code}</span></td>
                    <td>{formatTime(stop.scheduledArrival || stop.scheduledDeparture)}</td>
                    <td>{formatTime(stop.actualArrival || stop.actualDeparture)}</td>
                    <td>{stop.status}{stop.delay ? ` (+${stop.delay}m)` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-actions">
            <Link className="secondary-action inline-cta" to={`/train/${live.train}`}>Full schedule</Link>
            <Link className="ghost-action inline-cta" to={`/train/${live.train}/route`}>Route map</Link>
          </div>
        </>
      )}
    </section>
  );
}
