import React, { useState } from "react";
import { Link } from "react-router-dom";
import modernHouse from "../assets/HeroSliderPics/modernhouse.png";
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

  const toggleMetric = (idx) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  const onRowKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMetric(idx);
    }
  };
  return (
    <section className="portfolio-section" id="portfolio">
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
                  <div className="metric-number">{m.value}</div>
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
