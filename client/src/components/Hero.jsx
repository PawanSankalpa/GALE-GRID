import React from "react";
import "./styles/Hero.css";

function Hero(props) {
  return (
    <div className="hero-container">
      <section className="hero">
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
            >
              Email : pawansankalpanew123@gmail.com
            </a>
            <a className="secondary-button" href="tel:+94776868537">
              telephone : +94 77 686 8537           
            </a>
          </div>
        </div>

        <div className="hero-img">
          <img src="images/logo.jpg" alt="GALE GRID Logo" />
        </div>
        <hr className="featurette-divider" />
      </section>
      
    </div>
  );
}

export default Hero;