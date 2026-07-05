import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StationSelect from "../components/StationSelect.jsx";

export default function StationHubPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  function go(path) {
    if (!code) return;
    navigate(`/station/${code}/${path}`);
  }

  return (
    <section className="panel">
      <PageHeader eyebrow="Station intelligence" title="Station hub" lead="Timetable and live departure boards for any station." />
      <div className="card service-form">
        <StationSelect label="Station" displayName={name} onChange={(s) => { setCode(s?.code || ""); setName(s ? `${s.name} (${s.code})` : ""); }} />
        <div className="card-actions">
          <button type="button" className="primary-action" disabled={!code} onClick={() => go("board")}>Station timetable</button>
          <button type="button" className="secondary-action" disabled={!code} onClick={() => go("live")}>Live board</button>
        </div>
      </div>
      <div className="service-grid">
        <Link to="/lookup/stations" className="service-card card"><strong>Station directory</strong><span className="muted">Browse all station codes</span></Link>
        <Link to="/services" className="service-card card"><strong>All services</strong><span className="muted">Back to travel tools</span></Link>
      </div>
    </section>
  );
}
