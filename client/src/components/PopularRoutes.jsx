import { POPULAR_ROUTES } from "../data/popular-routes.js";
import { useApp } from "../context/AppContext.jsx";

export default function PopularRoutes({ onSearch }) {
  const { setLastSearch } = useApp();

  function apply(route) {
    setLastSearch((prev) => ({
      ...prev,
      from: route.from,
      to: route.to,
      fromName: route.fromName,
      toName: route.toName
    }));
    onSearch?.();
  }

  return (
    <div className="popular-routes">
      <p className="eyebrow">Popular routes</p>
      <div className="route-chips">
        {POPULAR_ROUTES.map((route) => (
          <button key={route.label} type="button" className="route-chip" onClick={() => apply(route)}>
            {route.label}
          </button>
        ))}
      </div>
    </div>
  );
}
