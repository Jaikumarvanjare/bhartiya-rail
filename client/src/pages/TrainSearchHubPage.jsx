import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function TrainSearchHubPage() {
  const navigate = useNavigate();
  const [trainNo, setTrainNo] = useState("");

  return (
    <section className="panel">
      <PageHeader eyebrow="Train intelligence" title="Find a train" lead="Enter a train number to view schedule, live status, or route." />
      <form className="card service-form" onSubmit={(e) => { e.preventDefault(); if (trainNo.trim()) navigate(`/train/${trainNo.trim()}`); }}>
        <label>Train number<input value={trainNo} onChange={(e) => setTrainNo(e.target.value)} placeholder="e.g. 12919" /></label>
        <div className="card-actions">
          <button className="primary-action" type="submit">View schedule</button>
          <button className="secondary-action" type="button" onClick={() => trainNo.trim() && navigate(`/train/${trainNo.trim()}/live`)}>Live status</button>
          <button className="ghost-action" type="button" onClick={() => trainNo.trim() && navigate(`/train/${trainNo.trim()}/route`)}>Route map</button>
        </div>
      </form>
    </section>
  );
}
