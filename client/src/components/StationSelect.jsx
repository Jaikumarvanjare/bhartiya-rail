import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";

function formatStation(station) {
  return `${station.name} (${station.code})`;
}

export default function StationSelect({ label, displayName, onChange }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) setText(displayName || "");
  }, [displayName, open]);

  useEffect(() => {
    if (!open) return undefined;
    const q = text.trim();
    if (q.length < 1) {
      setResults([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api(`/stations?q=${encodeURIComponent(q)}`);
        setResults(data.stations.slice(0, 20));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [text, open]);

  useEffect(() => {
    function onDocClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleInputChange(event) {
    setText(event.target.value);
    setOpen(true);
    onChange(null);
  }

  function handleFocus() {
    setOpen(true);
  }

  function pickStation(station) {
    setText(formatStation(station));
    setOpen(false);
    onChange(station);
  }

  const showList = open && text.trim().length > 0;

  return (
    <div className="station-select" ref={rootRef}>
      <label>
        {label}
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Type station name or code"
          autoComplete="off"
          aria-label={label}
          aria-expanded={showList}
          aria-autocomplete="list"
        />
      </label>
      {showList && (
        <ul className="station-select-list" role="listbox">
          {loading && <li className="muted station-select-empty">Searching…</li>}
          {!loading && results.map((station) => (
            <li key={station.code}>
              <button
                type="button"
                className="station-select-option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickStation(station)}
              >
                <strong>{station.code}</strong>
                <span>{station.name}</span>
                <small className="muted">{station.city}</small>
              </button>
            </li>
          ))}
          {!loading && !results.length && (
            <li className="muted station-select-empty">No station found — try another name or code</li>
          )}
        </ul>
      )}
    </div>
  );
}
