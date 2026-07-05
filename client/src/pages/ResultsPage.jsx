import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { searchTrains } from "../api/trainServices.js";
import { defaultJourneyDate } from "../data/booking-options.js";
import TrainTable from "../components/TrainTable.jsx";
import StatusChip from "../components/StatusChip.jsx";

const QUOTA_LABELS = { GN: "General", TQ: "Tatkal", PT: "Premium Tatkal", LD: "Ladies", SS: "Senior Citizen", HP: "Physically Handicapped" };

export default function ResultsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { trains, setTrains, setSelectedTrain, lastSearch, setLastSearch } = useApp();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [onlyOnTime, setOnlyOnTime] = useState(false);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const from = params.get("from") || lastSearch.from;
  const to = params.get("to") || lastSearch.to;
  const date = params.get("date") || lastSearch.date || defaultJourneyDate();
  const travelClass = params.get("class") || lastSearch.class || "CC";
  const quota = params.get("quota") || lastSearch.quota || "GN";

  useEffect(() => {
    if (!from || !to) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setNotice("");
    searchTrains({
      from,
      to,
      date,
      fromName: lastSearch.fromName,
      toName: lastSearch.toName,
      travelClass,
      quota
    })
      .then((result) => {
        if (cancelled) return;
        setTrains(result.trains || []);
        setLastSearch((p) => ({
          ...p,
          from,
          to,
          date,
          class: travelClass,
          quota,
          fromName: result.fromName || p.fromName,
          toName: result.toName || p.toName
        }));
        if (result.message) setNotice(result.message);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [from, to, date, travelClass, quota]);

  const fromLabel = lastSearch.fromName || from || "—";
  const toLabel = lastSearch.toName || to || "—";
  const quotaLabel = QUOTA_LABELS[quota] || quota;

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return trains.filter((train) => {
      const matchesText = !text || train.name.toLowerCase().includes(text) || train.type.toLowerCase().includes(text) || train.number.includes(text);
      const matchesType = type === "all" || train.type === type;
      const matchesTime = !onlyOnTime || ["Available", "On time"].includes(train.availability);
      return matchesText && matchesType && matchesTime;
    });
  }, [trains, query, type, onlyOnTime]);

  function bookTrain(number) {
    const found = trains.find((t) => t.number === number);
    if (found?.bookable === false) return;
    if (found) setSelectedTrain(found);
    navigate("/booking");
  }

  if (!from || !to) {
    return (
      <div className="empty-state">
        <h2 className="display">Select a route</h2>
        <p className="muted">Search from home or the between-stations tool.</p>
        <Link to="/trains/between" className="primary-action inline-cta">Find trains</Link>
      </div>
    );
  }

  if (loading && !trains.length) {
    return <div className="empty-state">Loading trains for {fromLabel} → {toLabel}…</div>;
  }

  if (error && !trains.length) {
    return (
      <div className="empty-state">
        <h2 className="display">Could not load trains</h2>
        <p className="muted">{error}</p>
        <p className="muted">If the schedule service quota is exhausted, try again later or contact the admin.</p>
        <Link to="/trains/between" className="primary-action inline-cta">Modify search</Link>
      </div>
    );
  }

  return (
    <section className="panel">
      <header className="results-banner card">
        <div>
          <p className="eyebrow">Train availability</p>
          <h1 className="display">{fromLabel} → {toLabel}</h1>
          <p className="muted">
            {filtered.length} train(s) · {date} · Class {travelClass} · Quota {quotaLabel}
          </p>
        </div>
        <Link to="/trains/between" className="secondary-action">Modify search</Link>
      </header>

      {notice && <div className="card notice-banner">{notice}</div>}
      {error && <div className="card notice-banner is-error">{error}</div>}

      <div className="filters card">
        <input placeholder="Filter train name or number…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All types</option>
          {[...new Set(trains.map((t) => t.type))].map((t) => <option key={t}>{t}</option>)}
        </select>
        <label className="checkbox">
          <input type="checkbox" checked={onlyOnTime} onChange={(e) => setOnlyOnTime(e.target.checked)} />
          On-time only
        </label>
        <div className="view-toggle" role="group" aria-label="View mode">
          <button type="button" className={view === "table" ? "is-active" : ""} onClick={() => setView("table")}>Table</button>
          <button type="button" className={view === "cards" ? "is-active" : ""} onClick={() => setView("cards")}>Cards</button>
        </div>
      </div>

      {!filtered.length ? (
        <div className="empty-state">No trains on this date. <Link to="/trains/between">Change search</Link></div>
      ) : view === "table" ? (
        <TrainTable trains={filtered} onBook={bookTrain} onLive={(n) => navigate(`/train/${n}/live`)} onSchedule={(n) => navigate(`/train/${n}`)} />
      ) : (
        <div className="train-list">
          {filtered.map((train) => (
            <article key={train.number} className="train-card card">
              <div>
                <div className="train-head">
                  <span className="train-number">{train.number}</span>
                  <h3 className="display">{train.name}</h3>
                  <StatusChip status={train.availability} seats={train.seats} />
                </div>
                <p className="muted">{train.depart} → {train.arrive} · {train.duration}</p>
              </div>
              <aside className="train-side">
                <div className="fare">₹{train.fare.toLocaleString("en-IN")}</div>
                <div className="train-actions">
                  <button className="primary-action compact" type="button" onClick={() => bookTrain(train.number)} disabled={train.bookable === false}>Book</button>
                  <button className="ghost-action compact" type="button" onClick={() => navigate(`/train/${train.number}`)}>Schedule</button>
                  <button className="ghost-action compact" type="button" onClick={() => navigate(`/train/${train.number}/live`)}>Live</button>
                </div>
              </aside>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
