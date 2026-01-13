import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import modernHouse from "../assets/statsPics/mahmudul-hasan-LIVNlRn1a0s-unsplash.jpg";
import "./styles/Stats.css";

const Stats = () => {
  const introRef = useRef(null);
  const gridRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [gridInView, setGridInView] = useState(false);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGridInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const metrics = [
    {
      title: "Built-In CRM",
      sub: (
        <>
          Manage leads, customers, and follow-ups directly from your website. 
          <strong> No extra tools needed.</strong>
        </>
      ),
    },
    {
      title: "You Get Full Control",
      sub: (
        <>
          Admin access, client data, dashboards, and tools you can actually 
          <strong> use and manage.</strong>
        </>
      ),
    },
    {
      title: "We Set It Up and Keep It Running",
      sub: (
        <>
          Website setup, hosting, security, updates, and fixes 
          <strong> handled by us.</strong>
        </>
      ),
    },
  ];

  return (
    <section className="stats-section" id="stats">
      <div className="stats-intro" ref={introRef}>
        <h2 className={`stats-intro-title center-split ${inView ? "in-view" : ""}`}>
          More than just design
        </h2>
        <p className={`stats-intro-sub fade-delay ${inView ? "in-view" : ""}`}>
          We build complete websites 
          <br />
          with the systems your business needs to run smoothly.
        </p>
      </div>

      <div className="stats-grid" ref={gridRef}>
        <figure className={`stats-image fade-in-left ${gridInView ? "in-view" : ""}`}>
          <img
            src={modernHouse}
            alt="Professional web design showcase"
            loading="lazy"
          />
        </figure>

        <div className={`stats-right fade-in-right ${gridInView ? "in-view" : ""}`}>
          <div className="stats-image-bg">
            <img
              src={modernHouse}
              alt="Website performance and results"
              loading="lazy"
            />
            <div className="stats-overlay" />
          </div>

          <div className="stats-content">
            <ul className="stats-metrics">
              {metrics.map((m, i) => (
                <li key={i}>
                  <h3 className="metric-title">{m.title}</h3>
                  <p className="metric-sub">{m.sub}</p>
                </li>
              ))}
            </ul>

            <Link className="stats-cta" to="/ourWork">
              View Our Projects <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
