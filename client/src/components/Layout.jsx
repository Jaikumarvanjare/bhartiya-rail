import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import UserMenu from "./UserMenu.jsx";
import BottomNav from "./BottomNav.jsx";
import Footer from "./Footer.jsx";
import { IconTrain } from "./Icons.jsx";

const nav = [
  ["/", "Home"],
  ["/trains/between", "Search"],
  ["/services", "Services"],
  ["/live", "Live"],
  ["/about", "About"],
  ["/pnr", "PNR"],
  ["/booking", "Book"]
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <div className="jaali-overlay" aria-hidden="true" />
      <div className="alert-strip">
        Bharat Rail prototype — education use only. Not IRCTC. Book smarter with instant PNR &amp; live tools.
      </div>
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark"><IconTrain size={22} /></span>
          <span className="brand-copy">
            <strong className="display">Bharat Rail</strong>
            <small>भारत रेल · Heritage journeys</small>
          </span>
        </NavLink>
        <nav className="sidebar-nav" aria-label="Primary">
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="topbar-actions">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
      <main className="page-content">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
