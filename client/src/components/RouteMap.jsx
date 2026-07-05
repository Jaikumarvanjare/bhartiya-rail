export default function RouteMap({ geojson, stops = [] }) {
  const coords = geojson?.geometry?.coordinates || [];
  if (!coords.length) return <p className="muted">Route geometry unavailable.</p>;

  const points = coords.map(([lng, lat]) => ({ x: lng, y: lat }));
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const pad = 0.05;
  const w = 800;
  const h = 320;

  const scale = (p) => ({
    x: ((p.x - minX) / (maxX - minX || 1)) * (w - 40) + 20,
    y: h - (((p.y - minY) / (maxY - minY || 1)) * (h - 40) + 20)
  });

  const path = points.map((p) => scale(p)).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div className="route-map card">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Train route map">
        <rect width={w} height={h} fill="var(--surface-2)" rx="12" />
        <path d={path} fill="none" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" />
        {stops.slice(0, 12).map((stop, i) => {
          const match = points[Math.min(i * Math.floor(points.length / 12), points.length - 1)];
          if (!match) return null;
          const { x, y } = scale(match);
          return <circle key={stop.code || i} cx={x} cy={y} r="5" fill="var(--indigo)" />;
        })}
      </svg>
      <p className="muted route-map-note">{stops.length} halts · schematic route preview</p>
    </div>
  );
}
