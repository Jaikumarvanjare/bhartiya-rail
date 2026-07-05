const routes = [
  ["Delhi — Varanasi", "Ganga ghats, silk lanes, and the Kashi corridor", "Gangetic Plains"],
  ["Mumbai — Amritsar", "Western coast to Golden Temple frontier", "Punjab"],
  ["Howrah — Chennai", "Coromandel coast and Bay of Bengal story", "Eastern & Southern"],
  ["Delhi — Katra", "Capital to Himalayan pilgrimage foothills", "Jammu"],
  ["Ajmer — Delhi", "Aravalli ridges and Sufi heritage towns", "Rajasthan"]
];

export default function HeritagePage() {
  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Cultural routes</p>
        <h1 className="display">Heritage corridors</h1>
        <p className="muted">Stories beyond the timetable — forts, ghats, coasts, and pilgrimage towns.</p>
      </header>
      <div className="heritage-grid">
        {routes.map(([title, note, region]) => (
          <article key={title} className="heritage-card card">
            <span className="eyebrow">{region}</span>
            <h3 className="display">{title}</h3>
            <p className="muted">{note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
