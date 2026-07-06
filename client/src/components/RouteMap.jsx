import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../context/ThemeContext.jsx";

const SAFFRON = "#f59e0b";

const TILES = {
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

export default function RouteMap({ geojson, stops = [] }) {
  const coords = geojson?.geometry?.coordinates || [];
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const lineRef = useRef(null);
  const { resolved: theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!coords.length || !containerRef.current) return undefined;

    try {
      let map = mapRef.current;
      if (!map) {
        map = L.map(containerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false
        });
        mapRef.current = map;
      }

      if (tileRef.current) map.removeLayer(tileRef.current);
      const tileUrl = TILES[theme] || TILES.light;
      tileRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      if (lineRef.current) map.removeLayer(lineRef.current);
      const latlngs = coords.map(([lng, lat]) => [lat, lng]);
      lineRef.current = L.polyline(latlngs, { color: SAFFRON, weight: 4, opacity: 0.95 }).addTo(map);

      map.fitBounds(lineRef.current.getBounds(), { padding: [48, 48], maxZoom: 10 });
      setReady(true);
      setError("");
    } catch (err) {
      setError(err.message || "Map failed to load");
      setReady(false);
    }

    return undefined;
  }, [coords, theme]);

  useEffect(() => () => {
    mapRef.current?.remove();
    mapRef.current = null;
    tileRef.current = null;
    lineRef.current = null;
  }, []);

  if (!coords.length) return <p className="muted">Route geometry unavailable.</p>;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <div className={`route-map card${ready ? "" : " route-map--loading"}`}>
      <div
        ref={containerRef}
        className="route-map-canvas"
        role="img"
        aria-label="Train route on India map"
        aria-busy={!ready}
      />
      {!ready && <p className="muted route-map-status">Loading map…</p>}
      <p className="muted route-map-note">
        {stops.length} halts
        <span className="route-map-credit"> · © OpenStreetMap contributors</span>
      </p>
    </div>
  );
}
