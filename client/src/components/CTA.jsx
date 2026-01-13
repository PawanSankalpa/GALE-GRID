import React from 'react';
import { MessageCircle, Mail, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import './styles/CTA.css';

const CTA = () => {
  return (
    <section className="homepage-cta-section">
      <div className="homepage-cta-container">
        
        {/* Glass Card */}
        <div className="homepage-cta-card">
          
          {/* Header Section */}
          <div className="cta-header">
            <div className="cta-badge">
              <Sparkles size={16} />
              <span>Let's Work Together</span>
            </div>
            <h2 className="cta-title">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="cta-subtitle">
              Get in touch with us today and let's discuss how we can help you 
              achieve your business goals with a stunning, high-performing website.
            </p>
          </div>

          {/* Contact Options Grid */}
          <div className="contact-options-grid">
            
            {/* WhatsApp Card */}
            <a href="https://wa.me/94776868537" className="contact-card whatsapp-card">
              <div className="contact-card-icon">
                <MessageCircle size={24} />
              </div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Chat on WhatsApp</h3>
                <p className="contact-card-subtitle">Quick response • Instant support</p>
              </div>
              <div className="contact-card-arrow">
                <ArrowRight size={20} />
              </div>
            </a>

            {/* Email Card */}
            <a href="mailto:hello@galegrid.com" className="contact-card email-card">
              <div className="contact-card-icon">
                <Mail size={24} />
              </div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Send us an Email</h3>
                <p className="contact-card-subtitle">hello@galegrid.com</p>
              </div>
              <div className="contact-card-arrow">
                <ArrowRight size={20} />
              </div>
            </a>

            {/* Call Card */}
            <a href="tel:+94776868537" className="contact-card call-card">
              <div className="contact-card-icon">
                <Phone size={24} />
              </div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Give us a Call</h3>
                <p className="contact-card-subtitle">+94 77 686 8537</p>
              </div>
              <div className="contact-card-arrow">
                <ArrowRight size={20} />
              </div>
            </a>

          </div>

          {/* Trust Indicators */}
          <div className="cta-trust-section">
            <div className="trust-item">
              <CheckCircle2 size={18} />
              <span>Free consultation included</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <CheckCircle2 size={18} />
              <span>No obligation quote</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <CheckCircle2 size={18} />
              <span>Fast turnaround time</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;