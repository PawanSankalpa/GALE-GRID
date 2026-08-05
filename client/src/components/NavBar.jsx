import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { lockBodyScroll } from "../utils/scrollLock";
import './styles/NavBar.css';

const linkStaggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const linkItemVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

const NavBar = () => {
  const { openBooking } = useBooking();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const unlockScrollRef = useRef(null);

  /* ── Scroll tracking for frosted-glass activation ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Keyboard + body-scroll locking ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      unlockScrollRef.current?.();
      unlockScrollRef.current = lockBodyScroll();
      setTimeout(() => {
        const first = mobileNavRef.current?.querySelector('a');
        if (first) first.focus();
      }, 0);
    } else {
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
      hamburgerRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeIfDesktop = () => { if (window.innerWidth > 768 && menuOpen) setMenuOpen(false); };
    closeIfDesktop();
    window.addEventListener('resize', closeIfDesktop);
    return () => window.removeEventListener('resize', closeIfDesktop);
  }, [menuOpen]);

  /* ── Route changes: force-close drawer and release body lock ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/",        label: "Home"      },
    { to: "/services",label: "Services"  },
    { to: "/pricing", label: "Pricing"   },
    { to: "/ourWork", label: "Work"      },
    // { to: "/plan",    label: "Plan"      },
    // { to: loggedIn ? "/admin" : "/login", label: loggedIn ? "Dashboard" : "Login" },
  ];

  return (
    <>
      <nav className={`navbar sticky${scrolled ? " scrolled" : ""}`}>
        <Link to="/" style={{ color: 'var(--navbar-text-primary)', textDecoration: 'none' }}>
          <div className="logo">GAlE GRID</div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links desktop-only">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={location.pathname === l.to ? 'active' : ''}
            >
              {l.label}
            </Link>
          ))}
          <button type="button" className="nav-cta" onClick={openBooking}>Let's Talk</button>
        </div>

        {/* Hamburger — hidden on mobile (replaced by BottomTabBar) */}
        <button
          ref={hamburgerRef}
          className={`hamburger mobile-only${menuOpen ? ' open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="mobileNav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(p => !p)}
        >
          <span /><span /><span />
        </button>

        {/* Mobile-only: slim Book pill (replaces hamburger on ≤768px) */}
        <button
          type="button"
          className="navbar-mobile-book"
          onClick={openBooking}
          aria-label="Book a free call"
        >
          Book Free Call
        </button>
      </nav>

      {/* ── Animated mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="drawer-backdrop open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              id="mobileNav"
              ref={mobileNavRef}
              className="mobile-drawer open"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 28 } }}
              exit={{ x: "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
            >
              <div className="drawer-header">
                <div className="logo">GG</div>
                <button
                  className="mobile-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >×</button>
              </div>

              <nav className="drawer-nav">
                <motion.ul
                  variants={linkStaggerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {navLinks.map((l) => (
                    <motion.li key={l.to} variants={linkItemVariants}>
                      <Link
                        to={l.to}
                        onClick={() => setMenuOpen(false)}
                        className={location.pathname === l.to ? 'active' : ''}
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              {/* Premium bottom CTA — always visible at drawer bottom */}
              <div className="drawer-cta-wrap">
                <button
                  type="button"
                  className="drawer-book-btn"
                  onClick={() => { openBooking(); setMenuOpen(false); }}
                >
                  Book Free Strategy Call
                </button>
                <p className="drawer-book-note">No commitment &mdash; usually replied within 2h</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
