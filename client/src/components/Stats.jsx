import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import modernHouse from "../assets/portfolioPics/bwink_edu_05_single_05.jpg";
import "./styles/Stats.css";

const Stats = () => {
  const metrics = [
    { value: 12, title: "Websites launched", sub: "for small businesses building a strong digital presence and attracting more customers online" },
    { value: 15, title: "Active projects", sub: "currently in design and build, focused on performance, usability, and modern UI" },
    { value: 22, title: "Clients supported", sub: "with ongoing improvements, updates, and optimization to support continuous growth" },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [displayValues, setDisplayValues] = useState(metrics.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const [introInView, setIntroInView] = useState(false);

  const toggleMetric = (idx) => setExpandedIndex((p) => (p === idx ? null : idx));
  const onRowKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMetric(idx); }
  };

  // Easing function for smooth counter animations
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // One-time count-up animation when section enters viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasAnimated) return;

    const animationDuration = 1800; // 1.8 seconds for smooth count-up

    // RAF animation loop for counting from 0 to target
    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeOutCubic(progress);

      const newValues = metrics.map((m) => 
        Math.round(Number(m.value) * easedProgress)
      );
      setDisplayValues(newValues);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - set final values and mark as done
        setDisplayValues(metrics.map((m) => Number(m.value)));
        setHasAnimated(true);
        startTimeRef.current = null;
      }
    };

    // Intersection observer to trigger animation when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    observer.observe(node);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Match IntroText transition (no delay)
  useEffect(() => {
    const node = introRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.25 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className="stats-section" id="stats" ref={sectionRef}>
      <div className="stats-intro" ref={introRef}>
        <h2 className={`stats-intro-title stats-center-split ${introInView ? "in-view" : ""}`}>
          We Build Websites That Bring Customers
        </h2>
        <p className={`stats-intro-sub stats-fade-up ${introInView ? "in-view" : ""}`}>
          Easy to use. Easy to understand.
          <br />
          Made to turn visitors into customers.
        </p>
      </div>
      <div className="stats-grid">
        <figure className="stats-image left">
          <img src={modernHouse} alt="Modern house portfolio preview" />
        </figure>

        <div className="stats-right">
          <div className="stats-image-bg">
            <img src={modernHouse} alt="Modern house portfolio background" />
            <div className="stats-overlay" />
          </div>
          <div className="stats-content">
            <div className="stats-metrics">
              {metrics.map((m, idx) => (
                <div
                  className={`metric-row${expandedIndex === idx ? " expanded" : ""}`}
                  key={idx}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedIndex === idx}
                  aria-controls={`metric-sub-${idx}`}
                  onClick={() => toggleMetric(idx)}
                  onKeyDown={(e) => onRowKeyDown(e, idx)}
                >
                  <div className="metric-number">{displayValues[idx]}</div>
                  <div className="metric-text">
                    <div className="metric-title">
                      {m.title}
                      <span className="metric-chevron" aria-hidden="true">▼</span>
                    </div>
                    <div className="metric-sub" id={`metric-sub-${idx}`}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="stats-copy">
              We blend modern aesthetics with performance-focused builds. See how our sites turn visits into leads and help businesses grow.
            </p>
            <Link className="stats-cta" to="/ourWork" aria-label="View our full projects">
              View Our Projects <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
