import React, { useState, useEffect, useRef } from 'react';
import './styles/Hero.css';
import firstSideImage from "../assets/HeroSliderPics/imgCGPT.png";
import secondSideImage from "../assets/portfolioPics/5060.jpg";
import thirdSideImage from "../assets/portfolioPics/money-fantasy-scene.jpg";
import fourthSideImage from "../assets/HeroSliderPics/beautiful-bright-empire-state-building-nighttime.jpg";

const SLIDE_DURATION = 4800; // 20% faster than 6s (was 6000ms)
const REVIEW_DURATION = SLIDE_DURATION / 2; // exactly 2 reviews per slide, equal time each

const nextIndex = (index, length) => (index + 1) % length;

// Reordered: move first to last, shift others forward
const rawSlides = [
  {
    id: 2,
    fact: "Performance",
    subLines: [
      "STOP LOSING CLIENTS TO SLOW, MESSY WEBSITES.",
      "WE BUILD HIGH SPEED WEBSITES THAT HELP YOU GROW."
    ],
    cta: "Elevate Your Brand",
    image: firstSideImage,
    shade: true
  },
  {
    id: 3,
    fact: "Revenue",
    subLines: [
      "A BEAUTIFUL WEBSITE IS USELESS IF IT DOESN'T SELL.",
      "WE DESIGN SYSTEMS THAT TURN VISITORS INTO PAYING CUSTOMERS."
    ],
    cta: "Get Started",
    image: thirdSideImage,
    shade: true
  },
  {
    id: 4,
    fact: "Dominance",
    subLines: [
      "DON'T JUST COMPETE, WIN.",
      "WE DESIGN POWERFUL WEBSITES THAT PUT YOU AHEAD OF EVERY COMPETITOR."
    ],
    cta: "Explore Solutions",
    image: fourthSideImage,
    shade: true
  },
  {
    id: 1,
    fact: "Foundation",
    subLines: [
      "A WEAK WEBSITE BREAKS YOUR BUSINESS.",
      "WE BUILD THE SOLID DIGITAL FOUNDATION YOU NEED TO SCALE SAFELY."
    ],
    cta: "View Our Work",
    image: secondSideImage,
    shade: true
  }
];
const slides = rawSlides;

// Two reviews per slide
const reviews = [
  { name: "Sarah Mitchell", review: "Transformed our online presence completely. Revenue increased by 240%.", project: "#portfolio" },
  { name: "James Chen", review: "Exceptional attention to detail. The team delivered beyond our expectations.", project: "#portfolio" },
  { name: "Maria Rodriguez", review: "Professional, creative, and reliable. Our traffic doubled in 3 months.", project: "#portfolio" },
  { name: "David Park", review: "Best investment we made. The design speaks for itself.", project: "#portfolio" },
  { name: "Emma Thompson", review: "Stunning work that perfectly captures our brand vision.", project: "#portfolio" },
  { name: "Alex Kumar", review: "Fast turnaround without compromising quality. Highly recommend.", project: "#portfolio" }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [wipeNonce, setWipeNonce] = useState(0); // ensures wipe re-triggers even on wrap
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const isFirstSlideRef = useRef(true);
  const activeReview = reviews[reviewIndex];

  // Auto-slide (4.8 seconds per slide) — reset timer on each slide change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current]);

  // Reviews: exactly 2 per slide, equally split across the slide duration.
  // Anchored to the slide index to avoid timer drift.
  useEffect(() => {
    // When the slide changes (auto or manual), immediately show the next review.
    if (!isFirstSlideRef.current) {
      setReviewIndex((prev) => nextIndex(prev, reviews.length));
    } else {
      isFirstSlideRef.current = false;
    }

    // Halfway through the slide, show the second review for this slide.
    const halfTimer = window.setTimeout(() => {
      setReviewIndex((prev) => nextIndex(prev, reviews.length));
    }, REVIEW_DURATION);

    return () => window.clearTimeout(halfTimer);
  }, [current]);

  // bump nonce whenever review changes (including last->first)
  useEffect(() => {
    setWipeNonce(n => n + 1);
  }, [reviewIndex]);

  // Mobile nav accessibility and body scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      // prevent layout shift when scrollbar disappears by compensating padding
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const first = mobileNavRef.current && mobileNavRef.current.querySelector('a');
        if (first) first.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (hamburgerRef.current) hamburgerRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [menuOpen]);

  // Safety: if the mobile drawer is open and the viewport becomes desktop,
  // close it so body scroll isn't accidentally left locked.
  useEffect(() => {
    const closeIfDesktop = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    closeIfDesktop();
    window.addEventListener('resize', closeIfDesktop);
    return () => window.removeEventListener('resize', closeIfDesktop);
  }, [menuOpen]);

  // Keyboard navigation: ArrowLeft/ArrowRight to move slides
  useEffect(() => {
    const onKeyDown = (e) => {
      // avoid interfering while mobile drawer is open
      if (menuOpen) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const prev = (current - 1 + slides.length) % slides.length;
  const next = (current + 1) % slides.length;

  // Single universal progress color (keeps visuals consistent across slides)

  return (
    <div className="hero-container">
      <nav className="navbar sticky">
        <div className="logo">GALE GRID<span>.</span></div>

        <div className="nav-links desktop-only">
          <a href="#services">Home</a>
          <a href="#services">About</a>
          <div className="nav-item has-submenu">
            <button className="submenu-toggle" aria-expanded="false">Services</button>
            <ul className="submenu">
              <li><a href="#web">Web Design</a></li>
              <li><a href="#ecom">E‑commerce</a></li>
              <li><a href="#branding">Branding</a></li>
            </ul>
          </div>
          <a href="#services">Projects</a>
          <a href="#portfolio">Team</a>
          <a href="#portfolio">Reviews</a>
          <a href="#portfolio">Contact</a>
          <a href="#contact" className="nav-cta">Let's Talk</a>
        </div>

        <button
          ref={hamburgerRef}
          className={`hamburger mobile-only ${menuOpen ? 'open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="mobileNav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="mobileNav"
          ref={mobileNavRef}
          className={`mobile-drawer ${menuOpen ? 'open' : ''}`}
          aria-hidden={!menuOpen}
          role="dialog"
        >
          <div className="drawer-header">
            <div className="logo">GALE GRID<span>.</span></div>
            <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          </div>
          <nav className="drawer-nav">
            <ul>
              <li><a href="#services">Home</a></li>
              <li><a href="#services">About</a></li>
              <li>
                <details className="drawer-submenu">
                  <summary>Services</summary>
                  <ul>
                    <li><a href="#web">Web Design</a></li>
                    <li><a href="#ecom">E‑commerce</a></li>
                    <li><a href="#branding">Branding</a></li>
                  </ul>
                </details>
              </li>
              <li><a href="#services">Projects</a></li>
              <li><a href="#portfolio">Team</a></li>
              <li><a href="#portfolio">Reviews</a></li>
              <li><a href="#portfolio">Contact</a></li>
              <li><a href="#contact" className="nav-cta">Let's Talk</a></li>
            </ul>
          </nav>
        </div>
        {/* backdrop behind drawer */}
        <div
          className={`drawer-backdrop ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden={!menuOpen}
        />
      </nav>

      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === current ? 'active' : index === prev ? 'prev' : index === next ? 'next' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          >
            {/* ✅ Conditional gray shade ONLY for slide 3 */}
            {slide.shade && <div className="slide-gray-overlay" />}

            {/* Existing dark gradient stays */}
            <div className="slide-dark-overlay" />

            <div className="content-wrapper">
              <h2 className="fact-title">{slide.fact}</h2>

              <div className="fact-pretext" aria-hidden={false}>
                <>
                  <span className="pre-line">{slide.subLines[0]}</span>
                  {slide.subLines[1] ? <span className="pre-line second">{slide.subLines[1]}</span> : null}
                </>
              </div>

              <button className="portfolio-btn">
                {slide.cta} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom-right liquid glass info card */}
      <aside className="hero-info-card" aria-label="Client testimonial">
        {/* Minimal wrapper to isolate the wipe animation and re-trigger on change */}
        <div className="wipe-reveal" key={wipeNonce}>
          <div className="info-content">
            <div className="info-text">
              <h3 className="info-title">{activeReview.name}</h3>
              <p className="info-desc">
                {activeReview.review}
              </p>
            </div>
            <a href={activeReview.project} className="info-cta" aria-label={`View ${activeReview.name}'s project`}>Discover More</a>
          </div>
        </div>
      </aside>

      {/* Linear slide progress bar: fills left→right over slide duration */}
      <div
        className="slide-progress"
        key={current}
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Time until next slide"
        style={{ '--progress-duration': `${SLIDE_DURATION}ms` }}
      >
        <div className="progress-fill" />
      </div>

      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === current ? 'active-dot' : ''}`}
            onClick={() => setCurrent(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
