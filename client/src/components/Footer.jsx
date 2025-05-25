import React from "react";
import "./styles/Footer.css";
import { FaGithub, FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section brand">
          <h2 className="brand-title">GALE GRID</h2>
          <p className="brand-tagline">Designing Your Digital Future</p>
        </div>

        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>
            <a href="mailto:pawansankalpanew123@gmail.com">
              pawansankalpanew123@gmail.com
            </a>
          </p>
          <p>
            <a href="tel:+94776868537">+94 77 686 8537</a>
          </p>
          <p>Contact us to ask any questions</p>
        </div>

        <div className="footer-section links">
          <h3>Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3>Follow</h3>
          <div className="social-icons">
            <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://twitter.com/your-x" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
            <a href="https://facebook.com/your-facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} GALE GRID. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
