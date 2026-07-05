import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/dashboard").then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="empty-state">Loading your trips…</div>;

  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Platinum Yatri</p>
        <h1 className="display">Hello, {data.profile.name}</h1>
        <p className="muted">{data.profile.tier} · {data.profile.journeys} journeys</p>
      </header>

      <div className="metric-grid">
        <article className="card"><span className="muted">Reward points</span><strong className="fare">{data.profile.points.toLocaleString("en-IN")}</strong></article>
        <article className="card"><span className="muted">Saved passengers</span><strong className="fare">{data.profile.savedPassengers}</strong></article>
        <article className="card"><span className="muted">Tier</span><strong>{data.profile.tier}</strong></article>
      </div>

      <article className="card ticket-card">
        <p className="eyebrow">Upcoming journey</p>
        <h2 className="display">{data.upcoming.train}</h2>
        <p><strong>PNR {data.upcoming.pnr}</strong> · {data.upcoming.status}</p>
        <p>{data.upcoming.from} → {data.upcoming.to}</p>
        <p className="muted">{data.upcoming.date} · Coach {data.upcoming.coach} · Seat {data.upcoming.seat}</p>
      </article>

      <div className="card">
        <h2>Travel insights</h2>
        <ul className="insights">{data.insights.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>
  );
}
