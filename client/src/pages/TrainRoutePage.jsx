import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchTrainRoute } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";
import RouteMap from "../components/RouteMap.jsx";

export default function TrainRoutePage() {
  const { trainNumber: paramNo } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(paramNo || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  function load(number) {
    if (!number.trim()) return;
    setError("");
    fetchTrainRoute(number.trim(), { format: "geojson", stops: true })
      .then((res) => {
        setData(res.data);
        if (!paramNo) navigate(`/train/${number.trim()}/route`, { replace: true });
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    if (paramNo) load(paramNo);
  }, [paramNo]);

  return (
    <section className="panel">
      <PageHeader eyebrow="Route intelligence" title="Train route map" lead="Geographic route with halt markers." />

      <form className="card service-form" onSubmit={(e) => { e.preventDefault(); load(input); }}>
        <label>Train number<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 12919" /></label>
        <button className="primary-action" type="submit">Show route</button>
      </form>

      {error && <div className="empty-state">{error}</div>}
      {data && (
        <>
          <RouteMap geojson={data.geojson} stops={data.stops || []} />
          {data.stops?.length > 0 && (
            <div className="train-table-wrap card">
              <table className="train-table">
                <thead><tr><th>#</th><th>Station</th><th>Coordinates</th></tr></thead>
                <tbody>
                  {data.stops.map((s) => (
                    <tr key={`${s.sequence}-${s.code}`}>
                      <td>{s.sequence}</td>
                      <td><strong>{s.name}</strong> <span className="muted">{s.code}</span></td>
                      <td>{s.lat?.toFixed(4)}, {s.lng?.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="card-actions">
            <Link className="secondary-action inline-cta" to={`/train/${data.trainNumber}`}>Schedule</Link>
            <Link className="ghost-action inline-cta" to={`/train/${data.trainNumber}/live`}>Live status</Link>
          </div>
        </>
      )}
    </section>
  );
}
