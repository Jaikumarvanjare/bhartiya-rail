import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

const GROUPS = [
  {
    title: "Journey planning",
    items: [
      { to: "/trains/between", title: "Trains between stations", note: "All trains on a chosen date" },
      { to: "/lookup/trains", title: "Train directory", note: "Search by number or name" },
      { to: "/lookup/stations", title: "Station directory", note: "Search by code or city" }
    ]
  },
  {
    title: "Train intelligence",
    items: [
      { to: "/live", title: "Live train status", note: "Running position & delay" },
      { to: "/train", title: "Train schedule", note: "Full halt-wise timetable" },
      { to: "/train/route", title: "Route map", note: "Geographic route preview" }
    ]
  },
  {
    title: "Station intelligence",
    items: [
      { to: "/station", title: "Station hub", note: "Boards & live departures" },
      { to: "/station/board", title: "Station timetable", note: "All trains at a station" },
      { to: "/station/live", title: "Live station board", note: "Arrivals & departures now" }
    ]
  },
  {
    title: "Learn",
    items: [
      { to: "/about", title: "About Indian Railways", note: "170+ years of rail heritage" },
      { to: "/heritage", title: "Heritage routes", note: "Cultural journeys" },
      { to: "/dashboard", title: "My trips", note: "Your booking history" }
    ]
  },
  {
    title: "Booking & records",
    items: [
      { to: "/", title: "Book ticket", note: "Search and reserve" },
      { to: "/pnr", title: "PNR status", note: "Booking confirmation" }
    ]
  }
];

export default function ServicesPage() {
  return (
    <section className="panel services-page">
      <PageHeader
        eyebrow="Rail intelligence"
        title="Travel services"
        lead="Industry-grade tools for timetables, live tracking, station boards, and route planning."
      />
      {GROUPS.map((group) => (
        <div key={group.title} className="service-group">
          <h2 className="display service-group-title">{group.title}</h2>
          <div className="service-grid">
            {group.items.map((item) => (
              <Link key={item.to} to={item.to} className="service-card card">
                <strong>{item.title}</strong>
                <span className="muted">{item.note}</span>
                <span className="service-card-cta">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
