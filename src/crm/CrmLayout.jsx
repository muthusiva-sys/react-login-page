import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Overview", to: "/dashboard" },
  { label: "Leads", to: "/dashboard/leads" },
  { label: "Contacts", to: "/dashboard/contacts" },
  { label: "Pipeline", to: "/dashboard/pipeline" },
  { label: "Tasks", to: "/dashboard/tasks" },
];

export function CrmLayout({ user, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="crm-shell">
      <aside className={`crm-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="crm-brand-block">
          <div className="crm-brand-mark">K</div>
          <div>
            <p className="crm-brand-label">Kreative</p>
            <h2>CRM</h2>
          </div>
        </div>

        <nav className="crm-nav" aria-label="CRM navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="crm-main-panel">
        <header className="crm-topbar">
          <button
            type="button"
            className="crm-menu-trigger"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="crm-topbar-meta">
            <div className="crm-user-pill">
              <span className="crm-avatar">{(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{user?.name || "User"}</strong>
                <small>{user?.email || "No email"}</small>
              </div>
            </div>

            <button type="button" className="crm-logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <motion.main
          className="crm-page-shell"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {children || <Outlet />}
        </motion.main>
      </div>
    </div>
  );
}
