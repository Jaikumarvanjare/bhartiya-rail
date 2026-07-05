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
          <p className="muted">Book · PNR · Live status · <a href="/about">About railways</a> · Heritage</p>
        </div>
        <div>
          <p className="eyebrow">Trust</p>
          <p className="muted">Secure checkout · Idempotent PNR · Seat lock TTL</p>
        </div>
      </div>
      <p className="footer-note muted">Inspired by modern booking flows — designed for clarity, speed, and accessibility.</p>
    </footer>
  );
}
