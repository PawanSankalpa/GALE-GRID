
import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import './styles/Hero.css';
import compassImage from "../assets/processPics/grabster-wg_3atFNaRg-unsplash.jpg";

const Hero = () => {

  // Refs for static background layers
  const gradientRef = useRef();
  const parallaxRef = useRef();

  return (
    <div className="hero-container">
      <NavBar />
      <section className="hero-visual">
        {/* Cursor-reactive gradient */}
        <div ref={gradientRef} className="hero-gradient-bg" aria-hidden="true" />
        {/* Static background image layer */}
        <div
          ref={parallaxRef}
          className="hero-parallax-bg"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(14, 15, 19, 0.88), rgba(20, 22, 28, 0.85)), url(${compassImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-hidden="true"
        />
        {/* Soft noise overlay */}
        <div className="hero-noise-bg" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">WEBSITES FOR BUSINESS GROWTH</p>
          <h1 className="hero-title">Grow your business online</h1>
          <p className="hero-subtext">
            Websites built to load under 2 seconds, rank on Google, and convert visitors into leads.
          </p>
          <div className="hero-actions">
            <a className="hero-cta primary" href="#portfolio">View Our Work</a>
            <a className="hero-cta ghost" href="#contact">Book Free Consultation</a>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            <path d="M11 15l5 5 5-5" stroke="#F2F4F8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Hero;
