import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaStar, FaClock } from "react-icons/fa";
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

  return (
    <section id="portfolio" className="pf-section" aria-labelledby="pf-title" ref={pfRef}>
      <div className="pf-shell">
        <header className="pf-header reveal">
          <h2 id="pf-title">SOME OF OUR RECENT WORK</h2>
          <p className="pf-sub">
            A few recent projects we’ve designed and built. Feel free to explore the live sites.
          </p>
        </header>

        <div className="pf-mosaic">
          {/* ROW 1: three equal cards (4 cols each) */}
          <article className="pf-card pf-r1-left reveal pf-magnetic" aria-label="SunMax Energy" tabIndex={0}>
            <div className="hover-scrim" />
            <img src={modernHouse} loading="lazy" decoding="async" alt="SunMax Energy project" className="pf-img" />
            <div className="pf-glass-overlay">
              <div className="pf-glass-title">LIFECARE MEDICAL</div>
              <div className="pf-glass-hook">+45% Conversion</div>
              <div className="pf-glass-industry">Healthcare Platform</div>
            </div>
            <div className="pf-arrow-fixed"><span className="arrow">↗</span></div>
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

          <article className="pf-card pf-r1-right reveal pf-magnetic" aria-label="Hotel project" tabIndex={0}>
            <div className="hover-scrim" />
            <img src={leftImg} loading="lazy" decoding="async" alt="Hotel project screenshot" className="pf-img" />
            <div className="pf-glass-overlay">
              <div className="pf-glass-title">GRAND HOTEL</div>
              <div className="pf-glass-hook">+30% Bookings</div>
              <div className="pf-glass-industry">Luxury Hospitality</div>
            </div>
            <div className="pf-arrow-fixed"><span className="arrow">↗</span></div>
          </article>

          {/* ROW 2: Left large image, right stack with banner + rate */}
          <article className="pf-card pf-r2-left-large reveal pf-magnetic" aria-label="Luxury hotel" tabIndex={0}>
            <div className="hover-scrim" />
            <img src={proj4} loading="lazy" decoding="async" alt="Emerald Estates project" className="pf-img" />
            <div className="pf-glass-overlay">
              <div className="pf-glass-title">EMERALD ESTATES</div>
              <div className="pf-glass-hook">+35% Conversion Rate</div>
              <div className="pf-glass-industry">Luxury Real Estate · Dubai</div>
            </div>
            <div className="pf-arrow-fixed"><span className="arrow">↗</span></div>
          </article>

          {/* Right top with dark banner overlay */}
          <article className="pf-card pf-r2-right-top reveal pf-magnetic" aria-label="Property listing" tabIndex={0}>
            <div className="hover-scrim" />
            <img src={rightImg} loading="lazy" decoding="async" alt="Property listing page" className="pf-img" />
            <div className="pf-glass-overlay">
              <div className="pf-glass-title">OPERA LISTINGS</div>
              <div className="pf-glass-hook">Virtual Tours</div>
              <div className="pf-glass-industry">Real Estate</div>
            </div>
            <div className="pf-arrow-fixed"><span className="arrow">↗</span></div>
          </article>

          {/* Right bottom: mirror center stat (99%) */}
          <article className="pf-card pf-r2-right-bottom pf-no-tilt reveal" aria-label="Customer recommendation" tabIndex={0}>
            <img src={luxiaHero3} loading="lazy" decoding="async" alt="Customer satisfaction" />
            <div className="pf-veil pf-veil-stat" />
            <div className="pf-stat-overlay" aria-hidden="true">
              <div className="pf-stat-percent">99%</div>
              <p className="pf-stat-line">Clients recommend us to their network</p>
              <Link to="/contact" className="pf-stat-btn" aria-label="Start your project">Start Your Project</Link>
            </div>
          </article>
        </div>
      </div>
      {/* Stats Footer: below portfolio images */}
      <div className="stats-footer">
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fa fa-google"><FaGoogle /></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Google Rating</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fa fa-star"><FaStar /></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">200+</div>
            <div className="stat-label">Projects</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fa fa-clock"><FaClock /></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">2-8</div>
            <div className="stat-label">Weeks Delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
