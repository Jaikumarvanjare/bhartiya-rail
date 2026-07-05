import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import StationSelect from "../components/StationSelect.jsx";
import {
  fetchLegacyBetween,
  fetchLegacyShipping,
  fetchLegacyStationsKv,
  fetchLegacyTrainDetails,
  fetchLegacyTrainsKv
} from "../api/trainServices.js";

const TABS = [
  ["stations", "Stations index"],
  ["trains", "Trains index"],
  ["between", "Between stations"],
  ["shipping", "Shipping finder"],
  ["train", "Train archive"]
];

export default function LegacyArchivePage() {
  const [tab, setTab] = useState("stations");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("NDLS");
  const [to, setTo] = useState("BCT");
  const [trainNo, setTrainNo] = useState("12919");
  const [ship, setShip] = useState({ source: "NDLS", lat: "27.1767", lng: "78.0081" });

  async function run(fn) {
    setError("");
    setResult(null);
    try {
      const res = await fn();
      setResult(res.data ?? res);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <PageHeader eyebrow="Compatibility" title="Archive tools" lead="Legacy datasets for migration and reference workflows." />
      <div className="widget-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={`widget-tab${tab === id ? " is-active" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      <div className="card service-form">
        {tab === "stations" && <button className="primary-action" type="button" onClick={() => run(fetchLegacyStationsKv)}>Load stations index</button>}
        {tab === "trains" && <button className="primary-action" type="button" onClick={() => run(fetchLegacyTrainsKv)}>Load trains index</button>}
        {tab === "between" && (
          <>
            <div className="widget-grid">
              <label>From<input value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} /></label>
              <label>To<input value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} /></label>
            </div>
            <button className="primary-action" type="button" onClick={() => run(() => fetchLegacyBetween(from, to))}>Search</button>
          </>
        )}
        {tab === "shipping" && (
          <>
            <StationSelect label="Source" displayName={ship.source} onChange={(s) => setShip((p) => ({ ...p, source: s?.code || "" }))} />
            <div className="widget-grid">
              <label>Latitude<input value={ship.lat} onChange={(e) => setShip((p) => ({ ...p, lat: e.target.value }))} /></label>
              <label>Longitude<input value={ship.lng} onChange={(e) => setShip((p) => ({ ...p, lng: e.target.value }))} /></label>
            </div>
            <button className="primary-action" type="button" onClick={() => run(() => fetchLegacyShipping(ship))}>Find trains</button>
          </>
        )}
        {tab === "train" && (
          <>
            <label>Train number<input value={trainNo} onChange={(e) => setTrainNo(e.target.value)} /></label>
            <button className="primary-action" type="button" onClick={() => run(() => fetchLegacyTrainDetails(trainNo))}>Load archive record</button>
          </>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {result && <pre className="card code-block">{JSON.stringify(result, null, 2).slice(0, 8000)}</pre>}
    </section>
  );
}
