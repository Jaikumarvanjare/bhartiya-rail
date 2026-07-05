import StatusChip from "./StatusChip.jsx";

export default function TrainTable({ trains, onBook, onLive, onSchedule = () => {} }) {
  return (
    <div className="train-table-wrap card">
      <table className="train-table">
        <thead>
          <tr>
            <th>Train</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Duration</th>
            <th>Availability</th>
            <th>Fare</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.number}>
              <td>
                <div className="train-cell-name">
                  <span className="train-number">{train.number}</span>
                  <strong>{train.name}</strong>
                  <span className="muted">{train.type}</span>
                </div>
              </td>
              <td>
                <strong>{train.depart}</strong>
                <span className="muted">{train.fromName}</span>
              </td>
              <td>
                <strong>{train.arrive}</strong>
                <span className="muted">{train.toName}</span>
              </td>
              <td>{train.duration}</td>
              <td><StatusChip status={train.availability} seats={train.seats} /></td>
              <td className="fare">₹{train.fare.toLocaleString("en-IN")}</td>
              <td className="train-actions">
                <button
                  type="button"
                  className="primary-action compact"
                  onClick={() => onBook(train.number)}
                  disabled={train.bookable === false}
                  title={train.bookable === false ? "Demo booking only for sample fleet trains" : "Book ticket"}
                >
                  Book
                </button>
                <button type="button" className="ghost-action compact" onClick={() => onSchedule(train.number)}>Schedule</button>
                <button type="button" className="ghost-action compact" onClick={() => onLive(train.number)}>Live</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
