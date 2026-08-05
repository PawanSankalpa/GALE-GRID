/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { useBooking } from "../context/BookingContext.jsx";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Star, ExternalLink, ChevronDown } from "lucide-react";
import leftImg from "../assets/portfolioPics/hotel11.png";
import rightImg from "../assets/portfolioPics/luxia-item.png";
import proj4 from "../assets/portfolioPics/hotel-full.png";
import modernHouse from "../assets/portfolioPics/lifecare.jpeg";
import luxiaHero3 from "../assets/portfolioPics/luxia-hero3.png";
import reflectImg from "../assets/portfolioPics/reflect.png";
import sunmaxImg from "../assets/portfolioPics/sunmaxenergy1.png";
import aurumImg from "../assets/portfolioPics/AURUM.png";
import lostFoundImg from "../assets/portfolioPics/lost and found.jpg";
import diaryImg from "../assets/portfolioPics/Diary.jpeg";
import droppedImg from "../assets/statsPics/dropped.png";
import "./styles/PortfolioSection.css";

const cards = [
  {
    cls: "pf-r1-left",
    img: modernHouse,
    alt: "LifeCare Medical project",
    title: "LIFECARE MEDICAL",
    hook: "+45% Conversion",
    industry: "Healthcare Platform",
    link: "https://jayathura-lifecare.vercel.app/",
    stat: true,
    delay: 0,
  },
  {
    cls: "pf-r1-center pf-stat-only",
    img: luxiaHero3,
    alt: "Client satisfaction metric",
    isStat: true,
    delay: 0.08,
  },
  {
    cls: "pf-r1-right",
    img: leftImg,
    alt: "Grand Hotel project",
    title: "GRAND HOTEL",
    hook: "+30% Bookings",
    industry: "Luxury Hospitality",
    link: "https://serenity-bay.gale-grid.com",
    delay: 0.16,
  },
  {
    cls: "pf-r2-left-large",
    img: proj4,
    alt: "Emerald Estates",
    title: "EMERALD ESTATES",
    hook: "+35% Conversion Rate",
    industry: "Luxury Real Estate · Dubai",
    link: "https://emerald-estates.gale-grid.com",
    delay: 0.24,
  },
  {
    cls: "pf-r2-right-top",
    img: rightImg,
    alt: "Opera Listings",
    title: "OPERA LISTINGS",
    hook: "Virtual Tours",
    industry: "Real Estate",
    link: "https://opera-listings.gale-grid.com",
    delay: 0.32,
  },
  {
    cls: "pf-r2-right-bottom pf-stat-only",
    img: luxiaHero3,
    alt: "Client recommendation",
    isStat: true,
    delay: 0.4,
  },
  {
    cls: "pf-r3-left",
    img: reflectImg,
    alt: "Reflect Fashion project",
    title: "REFLECT FASHION",
    hook: "E-Commerce Experience",
    industry: "Fashion E-Commerce",
    link: "https://reflect-sandy.vercel.app/",
    delay: 0.48,
  },
  {
    cls: "pf-r3-right",
    img: aurumImg,
    alt: "AURUM Jewellery Shop project",
    title: "AURUM JEWELLERY",
    hook: "Elegant E-Commerce Store",
    industry: "Jewellery E-Commerce",
    link: "https://e-commerce-1-ruby.vercel.app/",
    delay: 0.56,
  },
  {
    cls: "pf-r4-left",
    img: sunmaxImg,
    alt: "SunMax Energy project",
    title: "SUNMAX ENERGY",
    hook: "Page 1 Google SEO",
    industry: "Clean Energy Platform",
    link: "https://sunmax-energy.gale-grid.com",
    delay: 0.15,
  },
  {
    cls: "pf-r4-center",
    img: lostFoundImg,
    alt: "Lost & Found Hub mobile application",
    title: "LOST & FOUND HUB",
    hook: "Cross-Platform University Mobile App",
    industry: "Mobile Application",
    link: "https://www.linkedin.com/in/tharani-jayathura-96235226b/details/projects/",
    delay: 0.2,
  },
  {
    cls: "pf-r4-right",
    img: diaryImg,
    alt: "WorkDiary AI mobile application",
    title: "WORKDIARY AI",
    hook: "Voice & AI Enhancer (Gemini API)",
    industry: "Internship Management Mobile App",
    link: "https://www.linkedin.com/in/tharani-jayathura-96235226b/details/projects/",
    delay: 0.25,
  },
];

const PortfolioSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10% 0px" });
  const [expanded, setExpanded] = useState(false);

  const visibleCards = expanded ? cards : cards.slice(0, 6);

  return (
    <section id="portfolio" className="pf-section" aria-labelledby="pf-title">
      {/* Liquid drip transition from stats showcase above */}
      <div className="pf-drip-container">
        <img src={droppedImg} alt="" className="pf-drip-img" aria-hidden="true" />
      </div>
      <div className="pf-shell">
        {/* Header */}
        <motion.header
          ref={headerRef}
          className="pf-header"
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <span className="pf-hd-eyebrow">Our Work</span>
          <h2 className="pf-hd-headline" id="pf-title">Recent work. Real <em>results.</em></h2>
          <p className="pf-hd-sub">Real projects. Measurable results. Feel free to explore the live sites.</p>
        </motion.header>

        {/* Mosaic */}
        <div className="pf-mosaic">
          {visibleCards.map((card, i) => (
            <PfCard key={i} card={card} />
          ))}
        </div>

        {/* See More Actions */}
        <div className="pf-more-actions">
          <button
            type="button"
            className="pf-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See Less" : "See More"}
            <ChevronDown
              size={18}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.28s ease",
              }}
            />
          </button>
        </div>
      </div>

      {/* Stats footer */}
      <div className="pf-stats-footer">
        <div className="psf-item">
          <Star size={22} fill="#FBBF24" strokeWidth={0} />
          <div>
            <span className="psf-num">4.9/5</span>
            <span className="psf-label">Google Rating</span>
          </div>
        </div>
        <div className="psf-divider" />
        <div className="psf-item">
          <ArrowUpRight size={22} className="psf-icon" />
          <div>
            <span className="psf-num">10+</span>
            <span className="psf-label">Projects</span>
          </div>
        </div>
        <div className="psf-divider" />
        <div className="psf-item">
          <ExternalLink size={22} className="psf-icon" />
          <div>
            <span className="psf-num">2–8</span>
            <span className="psf-label">Weeks Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Individual card ──────────────────────────── */
function PfCard({ card }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const { openBooking } = useBooking();

  if (card.isStat) {
    return (
      <motion.article
        ref={ref}
        className={`pf-card ${card.cls}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 90, damping: 20, delay: card.delay }}
        tabIndex={0}
        aria-label="Client recommendation"
      >
        <img src={card.img} loading="lazy" decoding="async" alt={card.alt} />
        <div className="pf-veil pf-veil-stat" />
        <div className="pf-stat-overlay">
          <div className="pf-stat-percent">99%</div>
          <p className="pf-stat-line">Clients recommend us to their network</p>
          <button type="button" className="pf-stat-btn" onClick={openBooking}>Start Your Project</button>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={ref}
      className={`pf-card ${card.cls}`}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: card.delay }}
      whileHover={{ scale: 1.025, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      tabIndex={0}
      aria-label={card.title}
    >
      <img src={card.img} loading="lazy" decoding="async" alt={card.alt} className="pf-img" />
      <div className="pf-card-info">
        <span className="pf-card-industry">{card.industry}</span>
        <span className="pf-card-title">{card.title}</span>
        <span className="pf-card-hook">{card.hook}</span>
      </div>
      <motion.a
        href={card.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="pf-arrow-fixed"
        whileHover={{ rotate: 45, scale: 1.1, transition: { type: "spring", stiffness: 300 } }}
        aria-label={`Visit ${card.title} website`}
      >
        <ArrowUpRight size={20} />
      </motion.a>
    </motion.article>
  );
}

export default PortfolioSection;
