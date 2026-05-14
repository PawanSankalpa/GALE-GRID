import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, Layers, Image, Tag, Calendar } from "lucide-react";
import { useBooking } from "../context/BookingContext.jsx";
import { ROUTE_PREFETCH, prefetchRoute } from "../utils/prefetch.js";
import "./styles/BottomTabBar.css";

const TABS = [
  { to: "/",         label: "Home",     Icon: Home   },
  { to: "/services", label: "Services", Icon: Layers },
  { to: "/ourWork",  label: "Work",     Icon: Image  },
  { to: "/pricing",  label: "Pricing",  Icon: Tag    },
];

export default function BottomTabBar() {
  const { openBooking } = useBooking();

  // Add body class so sections can add bottom padding clearance
  useEffect(() => {
    document.body.classList.add("has-bottom-nav");
    return () => document.body.classList.remove("has-bottom-nav");
  }, []);

  return (
    <nav className="bottom-tab-bar" aria-label="Main navigation">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            "btb-tab" + (isActive ? " btb-tab--active" : "")
          }
          // Prefetch on hover (desktop) or first touch (mobile) —
          // whichever comes first. ROUTE_PREFETCH["/"] is undefined (already loaded).
          onMouseEnter={() => ROUTE_PREFETCH[to] && prefetchRoute(ROUTE_PREFETCH[to])}
          onTouchStart={() => ROUTE_PREFETCH[to] && prefetchRoute(ROUTE_PREFETCH[to])}
        >
          <Icon size={22} strokeWidth={1.8} className="btb-icon" />
          <span className="btb-label">{label}</span>
        </NavLink>
      ))}

      {/* Contact tab — triggers booking modal instead of routing */}
      <button
        type="button"
        className="btb-tab btb-tab--contact"
        onClick={openBooking}
        aria-label="Book a free call"
      >
        <Calendar size={22} strokeWidth={1.8} className="btb-icon" />
        <span className="btb-label">Contact</span>
      </button>
    </nav>
  );
}
