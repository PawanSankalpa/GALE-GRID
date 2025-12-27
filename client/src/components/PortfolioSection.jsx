import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import leftImg from "../assets/portfolioPics/hotel11.png"; // third image in row 1
import rightImg from "../assets/portfolioPics/luxia-item.png"; // right column images in row 2
import proj4 from "../assets/portfolioPics/hotel-full.png"; // first image in row 2
import modernHouse from "../assets/portfolioPics/lifecare.jpeg"; // first image in row 1
import luxiaHero3 from "../assets/portfolioPics/luxia-hero3.png"; // center stat card in row 1
import "./styles/PortfolioSection.css";

// Legacy metrics moved to Stats.jsx for home page placement

// Modern mosaic section (new)
const PortfolioSection = () => {
  const pfRef = useRef(null);

  // In-view animations for header and cards
  useEffect(() => {
    const root = pfRef.current; if (!root) return;
    const items = Array.from(root.querySelectorAll('.reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = items.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('is-visible'), Math.max(0, idx) * 80);
      });
    }, { threshold: 0.18 });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Pointer-tilt effect: move images slightly when hovering the entire section
  // The card edges remain fixed; only the images rotate a bit.
  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    const root = pfRef.current; if (!root) return;

    const baseScale = 1.03; // very gentle zoom so edges never show
    const maxShift = 4; // tiny movement for calm parallax
    const onMove = (e) => {
      const imgs = Array.from(root.querySelectorAll('.pf-card:not(.pf-no-tilt) img'));
      imgs.forEach((img) => {
        const r = img.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);
        const dist = Math.min(1, Math.hypot(dx, dy));
        const emphasis = 1 - 0.4 * dist; // even softer weighting
        const tx = dx * maxShift * emphasis;
        const ty = dy * maxShift * emphasis;
        img.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${baseScale})`;
        img.style.willChange = 'transform';
      });
    };
    const onLeave = () => {
      const imgs = root.querySelectorAll('.pf-card:not(.pf-no-tilt) img');
      imgs.forEach((img) => {
        img.style.transform = `scale(${baseScale})`;
        img.style.willChange = '';
      });
    };
    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section id="portfolio" className="pf-section" aria-labelledby="pf-title" ref={pfRef}>
      <div className="pf-shell">
        <header className="pf-header reveal">
          <h2 id="pf-title">Our Digital Solutions</h2>
          <p className="pf-sub">
            From concept to launch, we craft high-performing websites that drive growth and elevate your brand. Each project reflects our commitment to excellence and results-driven design.
          </p>
        </header>

        <div className="pf-mosaic">
          {/* ROW 1: three equal cards (4 cols each) */}
          <article className="pf-card pf-r1-left reveal" aria-label="SunMax Energy" tabIndex={0}>
            <img src={modernHouse} loading="lazy" decoding="async" alt="SunMax Energy project" />
            <div className="pf-project-info" aria-hidden="true">
              <p className="pf-info-desc">Healthcare platform with seamless booking and patient management</p>
              <a href="https://example.com/sunmax" target="_blank" rel="noopener noreferrer" className="pf-info-btn">View Site</a>
            </div>
          </article>

          <article className="pf-card pf-r1-center pf-no-tilt reveal" aria-label="Customer satisfaction" tabIndex={0}>
            <img src={luxiaHero3} loading="lazy" decoding="async" alt="Luxury property architecture" />
            <div className="pf-veil pf-veil-stat" />
            <div className="pf-stat-overlay" aria-hidden="true">
              <div className="pf-stat-percent">99%</div>
              <p className="pf-stat-line">Clients recommend us to their network</p>
              <Link to="/contact" className="pf-stat-btn" aria-label="Start your project">Start Your Project</Link>
            </div>
          </article>

          <article className="pf-card pf-r1-right reveal" aria-label="Hotel project" tabIndex={0}>
            <img src={leftImg} loading="lazy" decoding="async" alt="Hotel project screenshot" />
            <div className="pf-project-info" aria-hidden="true">
              <p className="pf-info-desc">Luxury hotel website with immersive gallery and direct booking</p>
              <a href="https://example.com/hotel" target="_blank" rel="noopener noreferrer" className="pf-info-btn">View Site</a>
            </div>
          </article>

          {/* ROW 2: Left large image, right stack with banner + rate */}
          <article className="pf-card pf-r2-left-large reveal" aria-label="Luxury hotel" tabIndex={0}>
            <img src={proj4} loading="lazy" decoding="async" alt="Hotel hero screenshot" />
            <div className="pf-project-info" aria-hidden="true">
              <p className="pf-info-desc">Premium hotel showcase with stunning visuals and smooth navigation</p>
              <a href="https://example.com/luxia" target="_blank" rel="noopener noreferrer" className="pf-info-btn">View Site</a>
            </div>
          </article>

          {/* Right top with dark banner overlay */}
          <article className="pf-card pf-r2-right-top reveal" aria-label="Property listing" tabIndex={0}>
            <img src={rightImg} loading="lazy" decoding="async" alt="Property listing page" />
            <div className="pf-project-info" aria-hidden="true">
              <p className="pf-info-desc">High-end property listing with interactive pricing details</p>
              <a href="https://example.com/opera" target="_blank" rel="noopener noreferrer" className="pf-info-btn">View Site</a>
            </div>
          </article>

          {/* Right bottom: finance/percentage card */}
          <article className="pf-card pf-r2-right-bottom pf-no-tilt reveal" aria-label="Financing options" tabIndex={0}>
            <img src={rightImg} loading="lazy" decoding="async" alt="Financing backdrop" />
            <div className="pf-veil" />
            <div className="pf-finance-content">
              <span className="pf-finance-label">Starting from</span>
              <div className="pf-rate">3.99%</div>
              <p className="pf-finance-sub">Flexible financing available</p>
              <Link to="/contact" className="pf-finance-btn">Get Quote</Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
