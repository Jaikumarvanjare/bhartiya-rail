import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import StationSelect from "./StationSelect.jsx";
import { IconSwap } from "./Icons.jsx";
import { CLASS_OPTIONS, QUOTA_OPTIONS, defaultJourneyDate } from "../data/booking-options.js";

const TABS = [
  ["book", "Book ticket"],
  ["pnr", "PNR status"],
  ["live", "Live train"]
];

function stationLabel(station) {
  return station ? `${station.name} (${station.code})` : "";
}

const BookingWidget = forwardRef(function BookingWidget(_props, ref) {
  const navigate = useNavigate();
  const { setLastSearch, lastSearch } = useApp();
  const widgetRef = useRef(null);
  const fromInputRef = useRef(null);
  const [tab, setTab] = useState("book");
  const [date, setDate] = useState(lastSearch.date || defaultJourneyDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pnr, setPnr] = useState("");
  const [liveTrain, setLiveTrain] = useState("22436");

  useImperativeHandle(ref, () => ({
    focusSearch() {
      setTab("book");
      setError("");
      widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      fromInputRef.current?.focus();
    }
  }));

  function handleSearch(event) {
    event.preventDefault();
    if (!lastSearch.from || !lastSearch.to) {
      setError("Select From and To stations from suggestions.");
      return;
    }
    if (lastSearch.from === lastSearch.to) {
      setError("From and To stations must be different.");
      return;
    }
    setLastSearch((prev) => ({ ...prev, date }));
    const qs = new URLSearchParams({
      from: lastSearch.from,
      to: lastSearch.to,
      date,
      class: lastSearch.class,
      quota: lastSearch.quota || "GN"
    });
    navigate(`/trains?${qs}`);
    setLoading(false);
  }

  function swapStations() {
    setLastSearch((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
      fromName: prev.toName,
      toName: prev.fromName
    }));
  }

  async function checkPnr(event) {
    event.preventDefault();
    if (!pnr.trim()) return;
    navigate(`/pnr?pnr=${encodeURIComponent(pnr.trim().toUpperCase())}`);
  }

  return (
    <div ref={widgetRef} id="booking-widget" className="booking-widget card">
      <div className="widget-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`widget-tab${tab === id ? " is-active" : ""}`}
            onClick={() => { setTab(id); setError(""); }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "book" && (
        <form className="widget-panel" onSubmit={handleSearch}>
          <div className="search-row">
            <StationSelect
              label="From"
              displayName={lastSearch.fromName}
              inputRef={fromInputRef}
              onChange={(s) => setLastSearch((p) => ({ ...p, from: s?.code || "", fromName: stationLabel(s) }))}
            />
            <button type="button" className="icon-btn swap-btn" onClick={swapStations} aria-label="Swap">
              <IconSwap />
            </button>
            <StationSelect
              label="To"
              displayName={lastSearch.toName}
              onChange={(s) => setLastSearch((p) => ({ ...p, to: s?.code || "", toName: stationLabel(s) }))}
            />
          </div>
          <div className="widget-grid">
            <label>
              Journey date
              <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Class
              <select value={lastSearch.class} onChange={(e) => setLastSearch({ ...lastSearch, class: e.target.value })}>
                {CLASS_OPTIONS.map(([k, v]) => <option key={k} value={k}>{k} — {v}</option>)}
              </select>
            </label>
            <label>
              Quota
              <select value={lastSearch.quota || "GN"} onChange={(e) => setLastSearch({ ...lastSearch, quota: e.target.value })}>
                {QUOTA_OPTIONS.map(([k, v]) => <option key={k} value={k}>{k} — {v}</option>)}
              </select>
            </label>
          </div>
          <button className="primary-action widget-submit" type="submit" disabled={loading}>
            {loading ? "Searching trains…" : "Search trains"}
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      )}

      {tab === "pnr" && (
        <form className="widget-panel" onSubmit={checkPnr}>
          <p className="muted">Enter your 10-digit PNR to view booking status.</p>
          <label>
            PNR number
            <input value={pnr} onChange={(e) => setPnr(e.target.value.toUpperCase())} placeholder="e.g. BR40409409" maxLength={12} />
          </label>
          <button className="primary-action widget-submit" type="submit">Check PNR status</button>
        </form>
      )}

      {tab === "live" && (
        <form className="widget-panel" onSubmit={(e) => { e.preventDefault(); navigate(`/live?train=${liveTrain.trim()}`); }}>
          <p className="muted">Track running status, next halt, and delay info.</p>
          <label>
            Train number
            <input value={liveTrain} onChange={(e) => setLiveTrain(e.target.value)} placeholder="e.g. 22436" />
          </label>
          <button className="primary-action widget-submit" type="submit">Track live</button>
        </form>
      )}
    </div>
  );
});

export default BookingWidget;
