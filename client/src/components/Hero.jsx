/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, Star, CheckCircle2, ExternalLink, ChevronDown } from "lucide-react";
import { useBooking } from "../context/BookingContext.jsx";
import "./styles/Hero.css";

const CYCLING_WORDS = ["sell", "rank", "convert", "perform", "grow"];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const { openBooking } = useBooking();

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  };

  const wordVariants = {
    enter: { opacity: 0, y: 18, filter: "blur(6px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, y: -14, filter: "blur(4px)", transition: { duration: 0.28 } },
  };

  const marqueePairs = [
    { name: "Grand Hotel", metric: "+30% Bookings" },
    { name: "LifeCare Medical", metric: "+45% Conversion" },
    { name: "Emerald Estates", metric: "+35% Rate" },
    { name: "Opera Listings", metric: "Virtual Tours" },
    { name: "Luxia Editorial", metric: "+52% Leads" },
    { name: "SunMax Energy", metric: "Page 1 Google" },
  ];

  return (
    <div className="hero-container">
      <NavBar />

      {/* ── Mesh background ── */}
      <div className="hero-mesh" aria-hidden="true" />

      <section className="hero-visual">
        <motion.div
          className="hero-copy"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div className="hero-eyebrow" variants={fadeUp}>
            <Star size={13} strokeWidth={2.5} />
            <span>WEB DESIGN AGENCY</span>
            <span className="eyebrow-dot" />
            <span>FOR BUSINESSES THAT WANT RESULTS</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="hero-title" variants={fadeUp}>
            We build websites
            <br />
            <span className="hero-title-muted">that</span>{" "}
            <span className="hero-word-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  key={CYCLING_WORDS[wordIndex]}
                  className="hero-word-cycle"
                  variants={wordVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {CYCLING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p className="hero-subtext" variants={fadeUp}>
            Websites built to load under 2 seconds, rank on Google, and convert visitors into
            paying customers — not just traffic.
          </motion.p>

          {/* CTAs */}
          <motion.div className="hero-actions" variants={fadeUp}>
            <motion.a
              className="hero-cta primary"
              href="#portfolio"
              whileHover={{ scale: 1.04, boxShadow: "0 16px 40px rgba(255,140,0,0.45)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <span>View Our Work</span>
              <ArrowRight size={17} strokeWidth={2.2} />
            </motion.a>
            <motion.button
              type="button"
              className="hero-cta ghost"
              onClick={openBooking}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <span>Book Free Call</span>
              <ExternalLink size={15} strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* Trust pills */}
          <motion.div className="hero-trust-pills" variants={fadeUp}>
            {["No contracts", "Free consultation", "Results guaranteed"].map((t) => (
              <span className="trust-pill" key={t}>
                <CheckCircle2 size={13} strokeWidth={2.5} />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: browser mockup ── */}
        <motion.div
          className="hero-mockup-side"
          initial={{ opacity: 0, x: 50, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.4 }}
        >
          <div className="hero-browser">
            <div className="browser-chrome">
              <span className="bc-dot bc-red" />
              <span className="bc-dot bc-yellow" />
              <span className="bc-dot bc-green" />
              <div className="bc-address">
                <span className="bc-lock">
                  <CheckCircle2 size={10} strokeWidth={3} />
                </span>
                galegrid.com
              </div>
            </div>
            <div className="browser-body">
              <div className="bb-nav">
                <div className="bb-logo" />
                <div className="bb-nav-links">
                  <div className="bb-link" />
                  <div className="bb-link" />
                  <div className="bb-link" />
                  <div className="bb-btn" />
                </div>
              </div>
              <div className="bb-hero-area">
                <div className="bb-headline-1" />
                <div className="bb-headline-2" />
                <div className="bb-sub" />
                <div className="bb-cta-row">
                  <div className="bb-cta-main" />
                  <div className="bb-cta-ghost" />
                </div>
              </div>
              <div className="bb-cards-row">
                <div className="bb-card">
                  <div className="bb-card-img" />
                  <div className="bb-card-line" />
                  <div className="bb-card-line short" />
                </div>
                <div className="bb-card">
                  <div className="bb-card-img" />
                  <div className="bb-card-line" />
                  <div className="bb-card-line short" />
                </div>
                <div className="bb-card">
                  <div className="bb-card-img" />
                  <div className="bb-card-line" />
                  <div className="bb-card-line short" />
                </div>
              </div>
              {/* Pulsing cursor */}
              <motion.div
                className="bb-cursor"
                animate={{ opacity: [1, 0, 1], x: [0, 22, 44, 44, 22, 0], y: [0, 0, 12, 30, 30, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Metric badges floating */}
          <motion.div
            className="hero-metric-badge badge-top"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 80 }}
          >
            <TrendingUp size={16} strokeWidth={2.2} />
            <div>
              <span className="badge-num">+340%</span>
              <span className="badge-label">Avg. Lead Increase</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-metric-badge badge-bot"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.35, type: "spring", stiffness: 80 }}
          >
            <Star size={15} fill="#FF8C00" strokeWidth={0} />
            <div>
              <span className="badge-num">1.8s</span>
              <span className="badge-label">Avg. Load Time</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* ── Marquee trust strip ── */}
      <div className="hero-marquee-wrap" aria-hidden="true">
        <div className="hero-marquee-track">
          {[...marqueePairs, ...marqueePairs, ...marqueePairs].map((p, i) => (
            <span className="hm-pair" key={i}>
              <span className="hm-name">{p.name}</span>
              <span className="hm-sep" />
              <span className="hm-metric">{p.metric}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
