import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import modernHouse from "../assets/HeroSliderPics/luxia.png";
import "./styles/PortfolioSection.css";

const PortfolioSection = ({
  // Static values as requested; edit to match real totals
  metrics = [
    { value: 12, title: "Websites launched", sub: "for small businesses building a strong digital presence and attracting more customers online" },
    { value: 15, title: "Active projects", sub: "currently in design and build, focused on performance, usability, and modern UI" },
    { value: 22, title: "Clients supported", sub: "with ongoing improvements, updates, and optimization to support continuous growth" },
  ],
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [displayValues, setDisplayValues] = useState(metrics.map(() => 0));
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const scrollIdleTimerRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const snapFinalRef = useRef(false);

  const toggleMetric = (idx) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  const onRowKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMetric(idx);
    }
  };

  // IntersectionObserver-driven progress: updates with visibility ratio while scrolling
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const ratio = Math.max(0, Math.min(1, entry.intersectionRatio || 0));
        // Bidirectional progress: numbers increase/decrease with visibility
        setScrollProgress(ratio);
      },
      { threshold: thresholds }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Map scroll progress to counts with easing
  useEffect(() => {
    // If we've snapped to final values (scroll idle), don't overwrite
    if (snapFinalRef.current) return;
    const endValues = metrics.map((m) => Number(m.value) || 0);
    // Linear mapping: counts move smoothly up/down with scroll
    const eased = Math.max(0, Math.min(1, scrollProgress));
    setDisplayValues(endValues.map((end) => Math.round(end * eased)));
  }, [scrollProgress, metrics]);

  // Keep a ref of latest progress for idle detection
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // When scrolling stops, snap to real counts (always)
  useEffect(() => {
    const onScroll = () => {
      if (scrollIdleTimerRef.current) clearTimeout(scrollIdleTimerRef.current);
      // Scrolling started/continued: allow dynamic updates
      snapFinalRef.current = false;
      scrollIdleTimerRef.current = setTimeout(() => {
        const endValues = metrics.map((m) => Number(m.value) || 0);
        // Scrolling is idle: snap and lock to final values
        snapFinalRef.current = true;
        setDisplayValues(endValues);
      }, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimerRef.current) clearTimeout(scrollIdleTimerRef.current);
    };
  }, [metrics]);
  return (
    <section className="portfolio-section" id="portfolio" ref={sectionRef}>
      <div className="portfolio-grid">
        {/* Left image */}
        <figure className="portfolio-image left">
          <img src={modernHouse} alt="Modern house portfolio preview" />
        </figure>

        {/* Right image with overlay content */}
        <div className="portfolio-right">
          <div className="portfolio-image-bg">
            <img src={modernHouse} alt="Modern house portfolio background" />
            <div className="image-overlay" />
          </div>

          <div className="portfolio-content">
            <div className="portfolio-metrics">
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
                  <div className="metric-number">{displayValues[idx] ?? m.value}</div>
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

            <p className="portfolio-copy">
              We blend modern aesthetics with performance-focused builds. See how our sites turn visits into leads and help businesses grow.
            </p>

            <Link className="portfolio-cta" to="/ourWork" aria-label="View our full projects">
              View Our Projects
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
