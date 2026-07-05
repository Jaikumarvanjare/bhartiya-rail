import PageHeader from "../components/PageHeader.jsx";
import { GALLERY, SECTIONS, SIGNIFICANCE, TIMELINE, TODAY_STATS } from "../data/railway-about.js";

export default function AboutPage() {
  return (
    <section className="panel about-page">
      <PageHeader
        eyebrow="About Indian Railways"
        title="170+ years on the tracks"
        lead="From a 34 km journey in 1853 to one of the world's largest railway networks — the story of how India moves."
      />

      <div className="about-gallery" role="list" aria-label="Railway heritage photographs">
        {GALLERY.map((img) => (
          <figure key={img.src} className="about-gallery-item" role="listitem">
            <img src={img.src} alt={img.alt} loading="lazy" />
          </figure>
        ))}
      </div>

      <div className="about-sections">
        {SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="about-section card">
            <p className="eyebrow">{section.period}</p>
            <h2 className="display">{section.title}</h2>
            <p className="about-body">{section.body}</p>
          </article>
        ))}
      </div>

      <section className="card about-today" aria-labelledby="today-heading">
        <p className="eyebrow">Today</p>
        <h2 id="today-heading" className="display">Indian Railways at a glance</h2>
        <div className="metric-grid">
          {TODAY_STATS.map((stat) => (
            <article key={stat.label} className="card about-stat">
              <span className="muted">{stat.label}</span>
              <strong className="about-stat-value">
                {stat.value}
                {stat.suffix && <span className="about-stat-suffix"> {stat.suffix}</span>}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <section className="card about-timeline-wrap" aria-labelledby="timeline-heading">
        <p className="eyebrow">Timeline</p>
        <h2 id="timeline-heading" className="display">Milestones</h2>
        <div className="about-timeline-table-wrap">
          <table className="train-table about-timeline-table">
            <thead>
              <tr><th>Year</th><th>Event</th></tr>
            </thead>
            <tbody>
              {TIMELINE.map((row) => (
                <tr key={`${row.year}-${row.event}`}>
                  <td><strong>{row.year}</strong></td>
                  <td>{row.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card about-significance">
        <p className="eyebrow">Significance</p>
        <h2 className="display">Why it matters</h2>
        <ul className="about-significance-list">
          {SIGNIFICANCE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="about-closing muted">
          From Bombay to Thane in 1853 to millions of journeys every day — Indian Railways transformed how India travels and transports goods.
        </p>
      </section>

      <p className="about-disclaimer muted">
        Educational content for Bharat Rail. Not an official Indian Railways publication. For ticket history, visit My Trips.
      </p>
    </section>
  );
}
