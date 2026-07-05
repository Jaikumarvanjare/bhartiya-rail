import { NavLink } from "react-router-dom";
import { IconLive, IconSearch, IconTicket } from "./Icons.jsx";

const items = [
  ["/", IconSearch, "Home"],
  ["/trains/between", IconTicket, "Search"],
  ["/services", IconLive, "Services"],
  ["/live", IconLive, "Live"],
  ["/pnr", IconTicket, "PNR"]
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile">
      {items.map(([to, Icon, label]) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `bottom-nav-item${isActive ? " is-active" : ""}`}>
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
