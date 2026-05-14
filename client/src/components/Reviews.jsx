import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight, TrendingUp, Award } from "lucide-react";
import "./styles/Reviews.css";

const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "CEO, TechVenture Inc.",
    initials: "SM",
    color: "#3B82F6",
    rating: 5,
    quote:
      "They transformed our entire digital presence. The website doesn't just look incredible — it actively generates leads. Best investment we've ever made.",
    metric: "250% more conversions",
    project: "E-commerce Platform",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder, StartupHub",
    initials: "MC",
    color: "#10B981",
    rating: 5,
    quote:
      "We went from 20 leads per month to 85 in just 6 weeks of the new site going live. The speed optimisations alone were mind-blowing.",
    metric: "20 → 85 leads/month",
    project: "SaaS Landing Page",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director, GrowthCo",
    initials: "ER",
    color: "#8B5CF6",
    rating: 5,
    quote:
      "Every decision was intentional — from the copy structure to the call-to-actions. They think like marketers AND build like engineers. Rare combination.",
    metric: "180% more qualified leads",
    project: "Corporate Website",
  },
  {
    id: 4,
    name: "David Park",
    role: "Owner, Boutique Fashion",
    initials: "DP",
    color: "#FF6B00",
    rating: 5,
    quote:
      "Our online store was barely breaking even. After the redesign, we doubled sales within the first month. The new checkout flow is seamless.",
    metric: "2x sales in 30 days",
    project: "Fashion E-commerce",
  },
  {
    id: 5,
    name: "Jessica Thompson",
    role: "Director, Creative Agency",
    initials: "JT",
    color: "#F59E0B",
    rating: 5,
    quote:
      "As a creative agency ourselves, our standards are high. GALE GRID didn't just meet them — they set a new benchmark for what a web agency can deliver.",
    metric: "95% client satisfaction",
    project: "Portfolio Website",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "CTO, DataFlow Systems",
    initials: "RK",
    color: "#EC4899",
    rating: 5,
    quote:
      "Complex dashboard, clean code, 99.9% uptime. Six months in and we haven't had a single complaint from users. That's the bar they set.",
    metric: "99.9% uptime achieved",
    project: "Web Application",
  },
];

const stats = [
  { icon: Star, value: "5.0", label: "Google Rating", color: "#FBBF24" },
  { icon: TrendingUp, value: "150+", label: "Happy Clients", color: "#10B981" },
  { icon: Award, value: "98%", label: "Satisfaction Rate", color: "#FF6B00" },
];

function StatCard({ s, i }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="rv-stat"
      style={{ "--sc": s.color }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rv-stat-icon">
        <s.icon size={20} strokeWidth={1.8} />
      </div>
      <span className="rv-stat-val">{s.value}</span>
      <span className="rv-stat-label">{s.label}</span>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setActive((p) => (p + 1) % reviews.length), 5500);
    return () => clearInterval(t);
  }, [autoplay]);

  const prev = () => { setAutoplay(false); setActive((p) => (p - 1 + reviews.length) % reviews.length); };
  const next = () => { setAutoplay(false); setActive((p) => (p + 1) % reviews.length); };

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) >= 50) { diff > 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const current = reviews[active];
  const headerRef = React.useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="rv-section">
      <div className="rv-container">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="rv-header"
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="rv-eyebrow">Client Stories</span>
          <h2 className="rv-headline">
            Real results from <em>real businesses</em>
          </h2>
          <p className="rv-sub">
            Every website we build comes with a promise: measurable improvement. Here's what our clients say.
          </p>
        </motion.div>

        {/* Main carousel */}
        <div
          className="rv-carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Thumbnail strip */}
          <div className="rv-thumbs">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                className={`rv-thumb${active === i ? " rv-thumb--active" : ""}`}
                style={{ "--tc": r.color }}
                onClick={() => { setAutoplay(false); setActive(i); }}
                aria-label={`View ${r.name}'s review`}
              >
                <span
                  className="rv-thumb-av"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </span>
                <span className="rv-thumb-name">{r.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Featured card */}
          <div className="rv-feature-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="rv-card"
                style={{ "--rc": current.color }}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Large decorative quote */}
                <Quote
                  className="rv-quote-icon"
                  size={56}
                  aria-hidden="true"
                />

                {/* Reviewer row */}
                <div className="rv-reviewer">
                  <div className="rv-av" style={{ background: current.color }}>
                    {current.initials}
                  </div>
                  <div className="rv-reviewer-info">
                    <strong>{current.name}</strong>
                    <span>{current.role}</span>
                    <div className="rv-stars">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#FBBF24" color="#FBBF24" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote text */}
                <p className="rv-quote-text">"{current.quote}"</p>

                {/* Metric + project badges */}
                <div className="rv-badges">
                  <span className="rv-metric-badge">
                    <TrendingUp size={13} />
                    {current.metric}
                  </span>
                  <span className="rv-project-badge">{current.project}</span>
                </div>

                {/* Glow accent */}
                <div className="rv-card-glow" aria-hidden="true" />
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="rv-controls">
              <button onClick={prev} className="rv-ctrl" aria-label="Previous">
                <ArrowLeft size={18} />
              </button>
              <div className="rv-dots">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    className={`rv-dot${active === i ? " rv-dot--active" : ""}`}
                    style={{ "--dc": reviews[i].color }}
                    onClick={() => { setAutoplay(false); setActive(i); }}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={next} className="rv-ctrl" aria-label="Next">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="rv-stats">
          {stats.map((s, i) => (
            <StatCard key={i} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
