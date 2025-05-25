import React from "react";
import "./styles/Footer.css";
import { FaGithub, FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <div className="footer-container">

        <section className="footer-section brand" aria-label="Brand information">
          <h2 className="brand-title">GALE GRID</h2>
          <p className="brand-tagline">Designing Your Digital Future</p>
        </section>

        <section className="footer-section contact" aria-label="Contact information">
          <h3>Contact</h3>
          <address>
            <p>
              <a href="mailto:pawansankalpanew123@gmail.com" aria-label="Email GALE GRID">
                pawansankalpanew123@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+94776868537" aria-label="Call GALE GRID">
                +94 77 686 8537
              </a>
            </p>
            <p>Contact us to ask any questions</p>
          </address>
        </section>

        <nav className="footer-section links" aria-label="Footer navigation">
          <h3>Links</h3>
          <ul>
            <li><a href="/" aria-label="Home page">Home</a></li>
            <li><a href="/services" aria-label="Services page">Services</a></li>
            <li><a href="/portfolio" aria-label="Portfolio page">Portfolio</a></li>
            <li><a href="/about" aria-label="About page">About</a></li>
            <li><a href="/contact" aria-label="Contact page">Contact</a></li>
          </ul>
        </nav>

        <section className="footer-section social" aria-label="Social media links">
          <h3>Follow</h3>
          <div className="social-icons">
            <a
              href="https://github.com/your-github"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/your-x"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X Twitter"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://facebook.com/your-facebook"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </section>

      </div>

      <div className="footer-bottom" aria-label="Legal information">
        <p>&copy; {currentYear} GALE GRID. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy-policy" aria-label="Privacy Policy">Privacy Policy</a>
          <span aria-hidden="true">|</span>
          <a href="/terms-of-service" aria-label="Terms of Service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
