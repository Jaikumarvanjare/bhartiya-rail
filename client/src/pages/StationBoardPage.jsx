import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchStationBoard } from "../api/trainServices.js";
import PageHeader from "../components/PageHeader.jsx";

export default function StationBoardPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStationBoard(code).then((res) => setData(res.data)).catch((err) => setError(err.message));
  }, [code]);

  if (error) return <div className="empty-state">{error}</div>;
  if (!data) return <div className="empty-state">Loading station timetable…</div>;

  return (
    <section className="panel">
      <PageHeader
        eyebrow="Station timetable"
        title={data.station?.name || code}
        lead={`${data.count} train(s) · Code ${data.station?.code}`}
        actions={<Link className="secondary-action" to={`/station/${code}/live`}>Live board</Link>}
      />
      <div className="train-table-wrap card">
        <table className="train-table">
          <thead><tr><th>Train</th><th>Type</th><th>Arrival</th><th>Departure</th><th>Route</th></tr></thead>
          <tbody>
            {data.trains.map((row) => (
              <tr key={row.train.number}>
                <td><Link to={`/train/${row.train.number}`}><strong>{row.train.number}</strong> {row.train.name}</Link></td>
                <td>{row.train.type}</td>
                <td>{row.stop?.arrival || "—"}</td>
                <td>{row.stop?.departure || "—"}</td>
                <td className="muted">{row.train.source?.code} → {row.train.destination?.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
