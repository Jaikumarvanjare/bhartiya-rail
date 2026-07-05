import { Link } from "react-router-dom";

const services = [
  ["/trains/between", "Between stations", "Trains on your date"],
  ["/live", "Live train", "Running status & delay"],
  ["/station", "Station board", "Timetable & live departures"],
  ["/lookup/trains", "Train directory", "Number & name search"],
  ["/pnr", "PNR enquiry", "Booking status"],
  ["/services", "All services", "Full travel toolkit"]
];

export default function QuickServices() {
  return (
    <div className="quick-services">
      {services.map(([to, title, note]) => (
        <Link key={title} to={to} className="quick-service card">
          <strong>{title}</strong>
          <span className="muted">{note}</span>
        </Link>
      ))}
    </div>
  );
}
