import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);

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
      const sw = window.innerWidth - document.documentElement.clientWidth;
      if (sw > 0) document.body.style.paddingRight = `${sw}px`;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const first = mobileNavRef.current?.querySelector('a');
        if (first) first.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      hamburgerRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeIfDesktop = () => { if (window.innerWidth > 768 && menuOpen) setMenuOpen(false); };
    closeIfDesktop();
    window.addEventListener('resize', closeIfDesktop);
    return () => window.removeEventListener('resize', closeIfDesktop);
  }, [menuOpen]);

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
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ))}
          <button type="button" className="nav-cta" onClick={openBooking}>Let's Talk</button>
        </div>

        {/* Hamburger */}
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
                      <Link to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
                    </motion.li>
                  ))}
                  <motion.li variants={linkItemVariants}>
                    <button
                      type="button"
                      className="nav-cta"
                      onClick={() => { openBooking(); setMenuOpen(false); }}
                      style={{ display: "block", textAlign: "center", marginTop: "8px", cursor: "pointer" }}
                    >Let's Talk</button>
                  </motion.li>
                </motion.ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
