import React from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { 
  Mail, 
  Phone, 
  Clock, 
  Github, 
  Facebook, 
  Linkedin, 
  Instagram,
  ArrowUpRight,
  MapPin
} from "lucide-react";
import "./styles/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { openBooking } = useBooking();

  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      
      {/* CTA Section */}
      

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* Footer Grid */}
          <div className="footer-grid">
            
            {/* Brand Section */}
            <section className="footer-section footer-brand" aria-label="Brand information">
              <h3 className="brand-logo">GALE GRID</h3>
              <p className="brand-tagline">
                Designing Your Digital Future
              </p>
              <p className="brand-description">
                Crafting premium web experiences that drive results for businesses 
                worldwide.
              </p>
            </section>

            {/* Quick Links */}
            <nav className="footer-section footer-links" aria-label="Quick links">
              <h4 className="footer-section-title">Quick Links</h4>
              <ul className="footer-list">
                <li>
                  <Link to="/" aria-label="Home page">
                    <span>Home</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
                <li>
                  <Link to="/services" aria-label="Services page">
                    <span>Services</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" aria-label="Portfolio page">
                    <span>Portfolio</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
                <li>
                  <Link to="/about" aria-label="About page">
                    <span>About</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
                <li>
                  <button type="button" aria-label="Book a discovery call" onClick={openBooking} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "inherit", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}>
                    <span>Contact</span>
                    <ArrowUpRight size={14} />
                  </button>
                </li>
              </ul>
            </nav>

            {/* Contact Information */}
            <section className="footer-section footer-contact" aria-label="Contact information">
              <h4 className="footer-section-title">Get in Touch</h4>
              <address className="footer-contact-list">
                <a href="mailto:hello@galegrid.com" className="footer-contact-item">
                  <div className="contact-icon">
                    <Mail size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">hello@galegrid.com</span>
                  </div>
                </a>
                
                <a href="tel:+94776868537" className="footer-contact-item">
                  <div className="contact-icon">
                    <Phone size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">+94 77 686 8537</span>
                  </div>
                </a>

                <div className="footer-contact-item">
                  <div className="contact-icon">
                    <Clock size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Hours</span>
                    <span className="contact-value">Mon–Fri 09:00–18:00 GST</span>
                  </div>
                </div>

                <div className="footer-contact-item">
                  <div className="contact-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Location</span>
                    <span className="contact-value">International</span>
                  </div>
                </div>
              </address>
            </section>

            {/* Social Media */}
            <section className="footer-section footer-social" aria-label="Social media">
              <h4 className="footer-section-title">Follow Us</h4>
              <p className="social-description">
                Stay connected and see our latest work
              </p>
              <div className="social-links">
                <a
                  href="https://github.com/PawanSankalpa"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="social-link"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://web.facebook.com/pawansankalpanew1123"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="social-link"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://linkedin.com/company/galegrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="social-link"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://instagram.com/galegrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="social-link"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} GALE GRID. All rights reserved.
            </p>
            <nav className="legal-links" aria-label="Legal navigation">
              <Link to="/privacy-policy" aria-label="Privacy Policy">
                Privacy Policy
              </Link>
              <span className="separator" aria-hidden="true">•</span>
              <Link to="/terms-of-service" aria-label="Terms of Service">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;