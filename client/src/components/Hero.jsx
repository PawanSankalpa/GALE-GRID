import React, { useState, useEffect, useRef } from 'react';
import './styles/Hero.css';
import firstSideImage from "../assets/HeroSliderPics/imgCGPT.png";
import secondSideImage from "../assets/HeroSliderPics/cloud-forest-landscape.jpg";
import thirdSideImage from "../assets/HeroSliderPics/high-tech-futuristic-urban-travel-people.jpg";

const slides = [
  {
    id: 1,
    fact: "Growth",
    subtext: "75% OF PEOPLE JUDGE A BUSINESS BY ITS WEBSITE.",
    cta: "View Our Work",
    image: secondSideImage,
    shade: false
  },
  {
    id: 2,
    fact: "Trust",
    subtext: "75% OF PEOPLE JUDGE A BUSINESS BY ITS WEBSITE.",
    cta: "Elevate Your Brand",
    image: firstSideImage,
    shade: false
  },
  {
    id: 3,
    fact: "Trust",
    subtext: "75% OF PEOPLE JUDGE A BUSINESS BY ITS WEBSITE.",
    cta: "Get Started",
    image: thirdSideImage,
    shade: true
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // 3D Parallax
  useEffect(() => {
    let raf = null;
    const state = { mouseX: 0, mouseY: 0 };

    const onMove = (e) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 10;

      if (!raf) {
        raf = requestAnimationFrame(() => {
          const activeSlide = document.querySelector('.slide.active');
          if (activeSlide) {
            const title = activeSlide.querySelector('.fact-title');
            const sub = activeSlide.querySelector('.fact-subtext');
            const btn = activeSlide.querySelector('.portfolio-btn');

            if (title) title.style.transform = `translate3d(${state.mouseX}px, ${state.mouseY}px, 0)`;
            if (sub) sub.style.transform = `translate3d(${state.mouseX * 0.6}px, ${state.mouseY * 0.6}px, 0)`;
            if (btn) btn.style.transform = `translate3d(${state.mouseX * 0.4}px, ${state.mouseY * 0.4}px, 0)`;
          }
          raf = null;
        });
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [current]);

  const prev = (current - 1 + slides.length) % slides.length;
  const next = (current + 1) % slides.length;

  // Accessibility: handle ESC to close and focus management + body scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      // lock body scroll
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // focus first link inside mobile nav
      const firstLink = mobileNavRef.current && mobileNavRef.current.querySelector('a');
      if (firstLink) firstLink.focus();

      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow || '';
        // return focus to hamburger
        if (hamburgerRef.current) hamburgerRef.current.focus();
      };
    }
    return () => {};
  }, [menuOpen]);

  return (
    <div className="hero-container">
      <nav className="navbar">
        <div className="logo">GALE GRID<span>.</span></div>

        {/* Desktop links (hidden on small screens) */}
        <div className="nav-links">
          <a href="#services">Home</a>
          <a href="#services">About</a>
          <a href="#services">Services</a>
          <a href="#services">Projects</a>
          <a href="#portfolio">Team</a>
          <a href="#portfolio">Reviews</a>
          <a href="#portfolio">Contact</a>
          <a href="#contact" className="nav-cta">Let's Talk</a>
        </div>

        {/* Hamburger for mobile */}
        <button
          ref={hamburgerRef}
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile navigation overlay */}
      <div
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        role="dialog"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-nav-inner" ref={mobileNavRef} onClick={(e) => e.stopPropagation()}>
          <button className="mobile-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="#services" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Team</a>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Reviews</a>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#contact" className="nav-cta mobile-cta" onClick={() => setMenuOpen(false)}>Let's Talk</a>
        </div>
      </div>

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
              <p className="fact-subtext">{slide.subtext}</p>
              <button className="portfolio-btn">
                {slide.cta} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="scroll-indicator"></div>

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
