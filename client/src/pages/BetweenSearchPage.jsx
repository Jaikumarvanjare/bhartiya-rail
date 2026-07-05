import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StationSelect from "../components/StationSelect.jsx";
import { CLASS_OPTIONS, QUOTA_OPTIONS, defaultJourneyDate } from "../data/booking-options.js";

function stationLabel(s) {
  return s ? `${s.name} (${s.code})` : "";
}

export default function BetweenSearchPage() {
  const navigate = useNavigate();
  const { lastSearch, setLastSearch } = useApp();
  const [date, setDate] = useState(lastSearch.date || defaultJourneyDate());
  const [travelClass, setTravelClass] = useState(lastSearch.class || "CC");
  const [quota, setQuota] = useState(lastSearch.quota || "GN");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (!lastSearch.from || !lastSearch.to) {
      setError("Select both stations from suggestions.");
      return;
    }
    if (lastSearch.from === lastSearch.to) {
      setError("From and To stations must be different.");
      return;
    }
    setError("");
    setLastSearch((p) => ({ ...p, date, class: travelClass, quota }));
    const qs = new URLSearchParams({
      from: lastSearch.from,
      to: lastSearch.to,
      date,
      class: travelClass,
      quota
    });
    navigate(`/trains?${qs}`);
  }

  return (
    <section className="panel">
      <PageHeader
        eyebrow="Journey planning"
        title="Trains between stations"
        lead="Find every train running between two stations on your travel date."
      />
      <form className="card service-form" onSubmit={onSubmit}>
        <div className="search-row">
          <StationSelect label="From" displayName={lastSearch.fromName} onChange={(s) => setLastSearch((p) => ({ ...p, from: s?.code || "", fromName: stationLabel(s) }))} />
          <StationSelect label="To" displayName={lastSearch.toName} onChange={(s) => setLastSearch((p) => ({ ...p, to: s?.code || "", toName: stationLabel(s) }))} />
        </div>
        <div className="widget-grid">
          <label>
            Journey date
            <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label>
            Class
            <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
              {CLASS_OPTIONS.map(([code, label]) => <option key={code} value={code}>{code} — {label}</option>)}
            </select>
          </label>
          <label>
            Quota
            <select value={quota} onChange={(e) => setQuota(e.target.value)}>
              {QUOTA_OPTIONS.map(([code, label]) => <option key={code} value={code}>{code} — {label}</option>)}
            </select>
          </label>
        </div>
        <button className="primary-action" type="submit">Show trains</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}
