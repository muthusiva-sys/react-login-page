import { useState } from "react";

const NAV_ITEMS = [
  ["About", "about"],
  ["Projects", "projects"],
  ["Services", "services"],
  ["Testimonials", "testimonials"],
  ["Contact", "contact"],
];

export default function Header() {
  const [active, setActive] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="rw-header">
      <style>{`
        .rw-header {
          position: relative;
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 18px 40px;
          background: radial-gradient(120% 180% at 88% 0%, #d9622a 0%, #7a2c10 22%, #180a06 55%, #0a0605 100%);
          min-height: 72px;
          overflow: visible;
        }

        .rw-logo {
          display: inline-block;
          font-family: "Arial Black", Arial, sans-serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #fdfaf6;
          white-space: nowrap;
          z-index: 2;
          transition: transform 0.25s ease, letter-spacing 0.25s ease;
          text-decoration: none;
        }

        .rw-logo:hover {
          transform: scale(1.04);
          letter-spacing: 1.5px;
        }

        .rw-nav {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 2;
        }

        .rw-nav-item {
          position: relative;
          appearance: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          padding: 9px 18px;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.25s ease, transform 0.2s ease;
        }

        .rw-nav-item:hover {
          color: #fff;
          transform: translateY(-2px) scale(1.03);
        }

        .rw-nav-item:active {
          transform: scale(0.96);
        }

        .rw-nav-item span {
          position: relative;
          z-index: 1;
        }

        .rw-nav-item.is-active {
          color: #ff7100;
        }

        .rw-pill {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: #fdfaf6;
          z-index: 0;
        }

        .rw-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 6px 6px 6px 22px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #f0793a, #d3491d);
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          z-index: 2;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          text-decoration: none;
        }

        .rw-cta:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 24px rgba(211, 73, 29, 0.35);
        }

        .rw-cta:active {
          transform: scale(0.96);
        }

        .rw-cta-sheen {
          position: absolute;
          inset: 0 auto 0 -70%;
          width: 55%;
          background: linear-gradient(110deg, transparent, rgba(255, 255, 255, 0.45), transparent);
          pointer-events: none;
          transition: transform 0.65s ease-in-out;
        }

        .rw-cta:hover .rw-cta-sheen {
          transform: translateX(290%);
        }

        .rw-cta-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }

        .rw-cta:hover .rw-cta-icon {
          transform: rotate(45deg);
        }

        .rw-menu-btn {
          display: none;
          appearance: none;
          background: transparent;
          border: none;
          color: #fdfaf6;
          cursor: pointer;
          z-index: 2;
          transition: transform 0.2s ease;
        }

        .rw-menu-btn:active {
          transform: scale(0.88);
        }

        @media (max-width: 900px) {
          .rw-nav {
            position: absolute;
            top: 64px;
            left: 24px;
            right: 24px;
            flex-direction: column;
            align-items: stretch;
            background: #16110d;
            display: none;
            padding: 8px;
            box-shadow: 0 18px 35px rgba(0, 0, 0, 0.28);
          }
          .rw-nav.is-open {
            display: flex;
          }
          .rw-nav-item {
            text-align: left;
          }
          .rw-cta span {
            display: none;
          }
          .rw-cta {
            padding: 6px;
          }
          .rw-menu-btn {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 8px;
          }
          .rw-menu-btn span {
            display: block;
            width: 22px;
            height: 2px;
            border-radius: 2px;
            background: #fdfaf6;
            transition: transform 0.2s ease, opacity 0.2s ease;
          }
          .rw-menu-btn.is-open span:first-child {
            transform: translateY(6px) rotate(45deg);
          }
          .rw-menu-btn.is-open span:nth-child(2) {
            opacity: 0;
          }
          .rw-menu-btn.is-open span:last-child {
            transform: translateY(-6px) rotate(-45deg);
          }
        }
      `}</style>

      <a
        className="rw-logo"
        href="#about"
        onClick={() => { setActive("About"); setMenuOpen(false); }}
      >
        ROBINSWEB
      </a>

      <nav id="portfolio-navigation" className={`rw-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary">
        {NAV_ITEMS.map(([item, target]) => (
          <a
            key={item}
            className={`rw-nav-item${active === item ? " is-active" : ""}`}
            href={`#${target}`}
            onClick={() => {
              setActive(item);
              setMenuOpen(false);
            }}
          >
            {active === item && (
              <span
                className="rw-pill"
              />
            )}
            <span>{item}</span>
          </a>
        ))}
      </nav>

      <a
        className="rw-cta"
        href="#contact"
        onClick={() => { setActive("Contact"); setMenuOpen(false); }}
      >
        <span
          className="rw-cta-sheen"
        />
        <span>Start a Project</span>
        <span
          className="rw-cta-icon"
          aria-hidden="true"
        >↗</span>
      </a>

      <button
        type="button"
        className={`rw-menu-btn${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-controls="portfolio-navigation"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}