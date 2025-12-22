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
  const activeSlide = slides[current];

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

    const resetAllSlideTransforms = () => {
      document.querySelectorAll('.slide').forEach(sl => {
        const t = sl.querySelector('.fact-title');
        const p = sl.querySelector('.fact-pretext');
        const b = sl.querySelector('.portfolio-btn');
        if (t) t.style.transform = '';
        if (p) p.style.transform = '';
        if (b) b.style.transform = '';
      });
    };

    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      state.mouseX = (clientX / window.innerWidth - 0.5) * 20;
      state.mouseY = (clientY / window.innerHeight - 0.5) * 20;

      if (!raf) {
        raf = requestAnimationFrame(() => {
          const activeSlide = document.querySelector('.slide.active');
          if (activeSlide) {
            const title = activeSlide.querySelector('.fact-title');
            const pre = activeSlide.querySelector('.fact-pretext');
            const btn = activeSlide.querySelector('.portfolio-btn');

            if (title) title.style.transform = `translate3d(${state.mouseX * 1.2}px, ${state.mouseY * 1.2}px, 0)`;
            // subtext moves less than title for 3D effect
            if (pre) pre.style.transform = `translate3d(${state.mouseX * 0.5}px, ${state.mouseY * 0.5}px, 0)`;
            if (btn) btn.style.transform = `translate3d(${state.mouseX * 0.4}px, ${state.mouseY * 0.4}px, 0)`;
          }
          raf = null;
        });
      }
    };

    // Clear any stale transforms (important if user toggles slides quickly)
    resetAllSlideTransforms();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [current]);

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

  const splitInTwo = (text) => {
    const words = text.split(' ');
    if (words.length <= 2) return [text, ''];
    let best = Math.ceil(words.length / 2);
    let bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' ');
      const b = words.slice(i).join(' ');
      const diff = Math.abs(a.length - b.length);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }
    return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
  };

  // Mobile nav accessibility and body scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const first = mobileNavRef.current && mobileNavRef.current.querySelector('a');
        if (first) first.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      if (hamburgerRef.current) hamburgerRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const prev = (current - 1 + slides.length) % slides.length;
  const next = (current + 1) % slides.length;

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
                {(() => {
                  const [l1, l2] = splitInTwo(slide.subtext);
                  return (
                    <>
                      <span className="pre-line">{l1}</span>
                      {l2 ? <span className="pre-line second">{l2}</span> : null}
                    </>
                  );
                })()}
              </div>

              <button className="portfolio-btn">
                {slide.cta} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom-right liquid glass info card */}
      <aside className="hero-info-card" aria-label="Projects highlight">
        <div className="info-content">
          <h3 className="info-title">{activeSlide?.fact || 'Projects'}</h3>
          <p className="info-desc">
            {activeSlide?.subtext || 'Explore our latest work and case studies.'}
          </p>
          <a href="#portfolio" className="info-cta" aria-label="Discover our projects">Discover More</a>
        </div>
      </aside>

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
