import { HERO_IMAGE } from "../data/assets.js";
import BookingWidget from "../components/BookingWidget.jsx";
import QuickServices from "../components/QuickServices.jsx";
import PopularRoutes from "../components/PopularRoutes.jsx";
import { FEATURED_TRAINS } from "../data/assets.js";

export default function SearchPage() {
  return (
    <section className="panel home-panel">
      <div className="hero hero-home">
        <img className="hero-bg" src={HERO_IMAGE} alt="" loading="eager" />
        <div className="hero-overlay" />
        <div className="hero-layout">
          <div className="hero-body">
            <p className="eyebrow">Bharat Rail · Not IRCTC</p>
            <h1 className="display">Book Indian rail journeys with clarity</h1>
            <p className="hero-lead">
              IRCTC-style utility — search, PNR, live status — with a cleaner layout, dark mode, and heritage design.
            </p>
            <ul className="hero-stats">
              <li><strong>711</strong> stations</li>
              <li><strong>3-tap</strong> booking</li>
              <li><strong>Live</strong> PNR &amp; tracking</li>
            </ul>
          </div>
          <BookingWidget />
        </div>
      </div>

      <PopularRoutes />

      <div>
        <header className="panel-head">
          <h2 className="display">Quick services</h2>
          <p className="muted">Everything you need on one screen — no clutter.</p>
        </header>
        <QuickServices />
      </div>

      <div>
        <header className="panel-head">
          <h2 className="display">Featured trains</h2>
        </header>
        <div className="featured-grid">
          {FEATURED_TRAINS.map((item) => (
            <article key={item.name} className="feature-card card">
              <img src={item.image} alt="" loading="lazy" />
              <div className="feature-card-body">
                <span className="eyebrow">{item.tag}</span>
                <h3 className="display">{item.name}</h3>
                <p className="muted">{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
