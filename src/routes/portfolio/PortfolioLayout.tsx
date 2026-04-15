import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import "./Portfolio.css";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

const PortfolioLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="pf-shell">
      <header className="pf-header">
        <div className="pf-header-inner">
          <NavLink className="pf-logo" to="/home">
            Blueberry
          </NavLink>
          <nav className="pf-nav-desktop">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `pf-nav-link ${isActive ? "is-active" : ""}`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            aria-label="Open navigation menu"
            className="pf-menu-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <aside className={`pf-mobile-nav ${menuOpen ? "is-open" : ""}`}>
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `pf-mobile-link ${isActive ? "is-active" : ""}`
            }
            key={item.to}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
      <button
        aria-hidden={!menuOpen}
        className={`pf-mobile-backdrop ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        tabIndex={menuOpen ? 0 : -1}
        type="button"
      />

      <main className={`pf-content pf-route-${location.pathname.replace("/", "")}`}>
        <Outlet />
      </main>

      <footer className="pf-footer">
        <p>© Blueberry Portfolio</p>
        <NavLink className="pf-legacy-link" to="/legacy/home">
          Legacy Site
        </NavLink>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
