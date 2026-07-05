export default function PageHeader({ eyebrow, title, lead, actions }) {
  return (
    <header className="page-header card">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display">{title}</h1>
        {lead && <p className="muted">{lead}</p>}
      </div>
      {actions}
    </header>
  );
}
