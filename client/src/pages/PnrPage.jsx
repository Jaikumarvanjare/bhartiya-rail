import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";
import StatusChip from "../components/StatusChip.jsx";

export default function PnrPage() {
  const [params, setParams] = useSearchParams();
  const [pnrInput, setPnrInput] = useState(params.get("pnr") || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchPnr(value) {
    const pnr = value.trim().toUpperCase();
    if (!pnr) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const [detail, status] = await Promise.all([
        api(`/pnr/${pnr}`),
        api(`/pnr/${pnr}/status`)
      ]);
      setData({ detail, status });
      setParams({ pnr });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = params.get("pnr");
    if (q) {
      setPnrInput(q);
      fetchPnr(q);
    }
  }, []);

  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">PNR enquiry</p>
        <h1 className="display">Check booking status</h1>
        <p className="muted">Faster and cleaner than legacy portals — enter PNR once.</p>
      </header>

      <form
        className="card pnr-form"
        onSubmit={(e) => { e.preventDefault(); fetchPnr(pnrInput); }}
      >
        <label>
          PNR number
          <input value={pnrInput} onChange={(e) => setPnrInput(e.target.value.toUpperCase())} placeholder="BR40409409" />
        </label>
        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? "Checking…" : "Get status"}
        </button>
      </form>

      {error && <div className="empty-state">{error}</div>}

      {data && (
        <article className="card ticket-card pnr-result">
          <div className="pnr-result-head">
            <div>
              <p className="eyebrow">PNR</p>
              <h2 className="display">{data.detail.pnr}</h2>
            </div>
            <StatusChip status={data.status.bookingStatus === "confirmed" ? "Available" : data.detail.status} />
          </div>
          <div className="pnr-grid">
            <div><span className="muted">Train</span><strong>{data.detail.trainNumber}</strong></div>
            <div><span className="muted">Date</span><strong>{data.detail.journeyDate}</strong></div>
            <div><span className="muted">Class</span><strong>{data.detail.travelClass}</strong></div>
            <div><span className="muted">Quota</span><strong>{data.detail.quota}</strong></div>
            <div><span className="muted">Coach</span><strong>{data.detail.coach || "—"}</strong></div>
            <div><span className="muted">Berths</span><strong>{data.detail.berths?.join(", ") || "—"}</strong></div>
          </div>
          {data.detail.passengers?.length > 0 && (
            <div>
              <p className="eyebrow">Passengers</p>
              <ul className="insights">
                {data.detail.passengers.map((p) => (
                  <li key={p.id}>{p.name} · {p.age} · {p.gender}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="muted">Chart: {data.status.chartStatus} · RAC/WL: {data.status.racStatus || "N/A"}</p>
        </article>
      )}

      <p className="muted"><Link to="/">← Back to booking</Link></p>
    </section>
  );
}
