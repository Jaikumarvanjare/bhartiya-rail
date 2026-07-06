import { Link } from "react-router-dom";

const SERVICES = [
  { to: "/", label: "Book" },
  { to: "/pnr", label: "PNR" },
  { to: "/live", label: "Live status" },
  { to: "/about", label: "About railways" }
];

const TRUST = [
  { to: "/booking", label: "Secure checkout" },
  { to: "/pnr", label: "Idempotent PNR" },
  { to: "/booking", label: "Seat lock TTL" },
  { to: "/dashboard", label: "My trips" }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <strong className="display">Bharat Rail</strong>
          <p className="muted">Education-friendly railway booking prototype. Not affiliated with IRCTC or Indian Railways.</p>
        </div>
        <div>
          <p className="eyebrow">Services</p>
          <ul className="footer-links muted">
            {SERVICES.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Trust</p>
          <ul className="footer-links muted">
            {TRUST.map(({ to, label }) => (
              <li key={label}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="footer-watermark" aria-hidden="true">
        © {new Date().getFullYear()} Bharat Rail
      </p>
    </footer>
  );
}
