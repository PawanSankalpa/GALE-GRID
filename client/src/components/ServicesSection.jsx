import React, { useState } from 'react';
import { 
  Palette, 
  Code2, 
  ShoppingCart, 
  Smartphone,
  Rocket,
  Sparkles,
  ArrowUpRight,
  Layers,
  Zap,
  Star
} from 'lucide-react';
import './styles/ServicesSection.css';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 0,
      icon: Palette,
      title: 'Web Design',
      tagline: 'Visual Excellence',
      description: 'Stunning, conversion-focused designs that capture your brand essence and engage your audience from the first click.',
      features: ['Custom UI/UX', 'Brand Identity', 'Responsive Design', 'Figma Prototypes'],
      color: '#FF6B00',
      gradient: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
      glowColor: 'rgba(255, 107, 0, 0.15)'
    },
    {
      id: 1,
      icon: Code2,
      title: 'Web Development',
      tagline: 'Performance First',
      description: 'Lightning-fast, scalable websites built with cutting-edge technologies. Clean code, smooth animations, perfect functionality.',
      features: ['React & Next.js', 'Performance Optimization', 'SEO Ready', 'Clean Code'],
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      glowColor: 'rgba(59, 130, 246, 0.15)'
    },
    {
      id: 2,
      icon: ShoppingCart,
      title: 'E-Commerce',
      tagline: 'Sales Optimized',
      description: 'Complete online stores with seamless checkout experiences, inventory management, and payment integration.',
      features: ['Stripe Integration', 'Cart & Checkout', 'Product Management', 'Analytics'],
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      glowColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 3,
      icon: Smartphone,
      title: 'Mobile First',
      tagline: 'Anywhere, Anytime',
      description: 'Flawless mobile experiences that work perfectly on every device. Progressive web apps that feel native.',
      features: ['PWA Development', 'Touch Optimized', 'Offline Support', 'App-Like Feel'],
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      glowColor: 'rgba(139, 92, 246, 0.15)'
    },
    {
      id: 4,
      icon: Rocket,
      title: 'Launch & Scale',
      tagline: 'Beyond Deployment',
      description: 'From deployment to growth. Continuous optimization, updates, and support to keep your site performing at its peak.',
      features: ['Deployment', 'Monitoring', 'Updates & Support', 'Performance Tuning'],
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      glowColor: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 5,
      icon: Layers,
      title: 'Full Stack',
      tagline: 'Complete Solutions',
      description: 'End-to-end development with backend APIs, databases, authentication, and third-party integrations.',
      features: ['API Development', 'Database Design', 'Authentication', 'Integrations'],
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      glowColor: 'rgba(236, 72, 153, 0.15)'
    }
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        
        {/* Section Header */}
        <div className="services-header">
          <div className="services-badge">
            <Sparkles size={16} />
            <span>What We Do</span>
          </div>
          <h2 className="services-title">
            Comprehensive Digital Solutions
          </h2>
          <p className="services-subtitle">
            From concept to launch and beyond, we provide everything you need 
            to build a powerful digital presence that drives real results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isActive = activeService === index;
            
            return (
              <div
                key={service.id}
                className={`service-card ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setActiveService(index)}
                style={{
                  '--service-color': service.color,
                  '--service-glow': service.glowColor
                }}
              >
                
                {/* Card Background Gradient */}
                <div 
                  className="service-card-gradient"
                  style={{ background: service.gradient }}
                ></div>

                {/* Icon Section */}
                <div className="service-icon-wrapper">
                  <div className="service-icon">
                    <IconComponent size={28} />
                  </div>
                  <div className="service-icon-glow"></div>
                </div>

                {/* Content */}
                <div className="service-content">
                  <div className="service-header-content">
                    <h3 className="service-title">{service.title}</h3>
                    <span className="service-tagline">{service.tagline}</span>
                  </div>
                  
                  <p className="service-description">{service.description}</p>
                  
                  {/* Features List */}
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="feature-item">
                        <Zap size={14} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More Link */}
                <button type="button" className="service-link">
                  <span>Learn more</span>
                  <ArrowUpRight size={16} />
                </button>

                {/* Floating Elements */}
                <div className="service-float-element service-float-1"></div>
                <div className="service-float-element service-float-2"></div>
                <div className="service-float-element service-float-3"></div>

              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="services-bottom-stats">
          <div className="stat-box">
            <Star size={20} fill="currentColor" />
            <div className="stat-content">
              <span className="stat-value">6+</span>
              <span className="stat-label">Core Services</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <Zap size={20} />
            <div className="stat-content">
              <span className="stat-value">100%</span>
              <span className="stat-label">Custom Solutions</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <Rocket size={20} />
            <div className="stat-content">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;