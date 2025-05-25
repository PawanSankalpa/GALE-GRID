import React from "react";
import "./styles/Hero.css";
import { Helmet } from "react-helmet";

function Hero(props) {
  return (
    <div className="hero-container">
      <Helmet>
        <title>Gale Grid - Web Design, Hosting & Cybersecurity | Kamburupitiya, Sri Lanka</title>
        <meta
          name="description"
          content="Gale Grid is your trusted web designing agency in Kamburupitiya, Sri Lanka. We build custom websites, handle hosting, domain buying, and provide cybersecurity expertise. Contact us to impress online."
        />
        <meta name="keywords" content="Web design, Hosting, Cybersecurity, Domain buying, Sri Lanka, Kamburupitiya, Online store, SSL, Responsive websites" />
        <meta name="author" content="Gale Grid Team" />
      </Helmet>

      <section className="hero" role="banner" aria-label="Introduction to Gale Grid web designing agency">
        <div className="hero-left">
          <h1 className="hero-title">GALE GRID</h1>
          <p className="hero-tagline">Built to Impress.</p>

          <h2 className="hero-subtitle">What We Do:</h2>

          <ul className="hero-list">
            <li>We design and build beautiful, custom websites</li>
            <li>Your site will work perfectly on phones, tablets, and computers</li>
            <li>Fast loading, Google-friendly, and secured with SSL</li>
            <li>Online store setup with easy payment options</li>
            <li>We handle everything — you just sit back and relax!</li>
          </ul>

          <div className="hero-buttons">
            <a
              className="primary-button"
              href="mailto:pawansankalpanew123@gmail.com"
              aria-label="Email Gale Grid at pawansankalpanew123@gmail.com"
            >
              Email : pawansankalpanew123@gmail.com
            </a>
            <a
              className="secondary-button"
              href="tel:+94776868537"
              aria-label="Call Gale Grid at +94 77 686 8537"
            >
              telephone : +94 77 686 8537
            </a>
          </div>
        </div>

        <div className="hero-img" role="img" aria-label="GALE GRID Logo">
          <img src="images/logo.jpg" alt="GALE GRID Logo" />
        </div>
        <hr className="featurette-divider" />
      </section>
    </div>
  );
}

export default Hero;
