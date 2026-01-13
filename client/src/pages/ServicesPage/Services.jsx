import React, { useState, useEffect } from 'react';
import { Code, Database, Lock, Zap, Palette, Smartphone, Search, ShoppingCart, TrendingUp, Users, Award, Clock, CheckCircle, ArrowRight, Layers, Globe, BarChart3, Shield, Cpu, RefreshCw, MessageCircle, Star, Play, Check, X } from 'lucide-react';
import './Services.css';

const Services = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [priceConfig, setPriceConfig] = useState({
    type: 'landing',
    pages: 5,
    features: [],
    support: 'basic'
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);

  const projectTypes = [
    { id: 'landing', name: 'Landing Page', base: 1500, icon: <Globe size={20} /> },
    { id: 'business', name: 'Business Website', base: 3500, icon: <Code size={20} /> },
    { id: 'ecommerce', name: 'E-commerce', base: 6000, icon: <ShoppingCart size={20} /> },
    { id: 'webapp', name: 'Web Application', base: 10000, icon: <Cpu size={20} /> }
  ];

  const additionalFeatures = [
    { id: 'cms', name: 'CMS Integration', price: 800 },
    { id: 'auth', name: 'User Login/Auth', price: 1200 },
    { id: 'payment', name: 'Payment Gateway', price: 1500 },
    { id: 'api', name: 'API Integration', price: 900 },
    { id: 'analytics', name: 'Analytics Dashboard', price: 1100 },
    { id: 'multilang', name: 'Multi-language', price: 700 }
  ];

  useEffect(() => {
    const basePrice = projectTypes.find(t => t.id === priceConfig.type)?.base || 0;
    const pagesPrice = (priceConfig.pages - 1) * 200;
    const featuresPrice = priceConfig.features.reduce((sum, fId) => {
      const feature = additionalFeatures.find(f => f.id === fId);
      return sum + (feature?.price || 0);
    }, 0);
    const supportMultiplier = priceConfig.support === 'premium' ? 1.25 : 1;
    
    setCalculatedPrice(Math.round((basePrice + pagesPrice + featuresPrice) * supportMultiplier));
  }, [priceConfig]);

  const toggleFeature = (featureId) => {
    setPriceConfig(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const capabilities = [
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      color: '#3B82F6'
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Express', 'REST APIs', 'GraphQL'],
      color: '#10B981'
    },
    {
      category: 'Database',
      skills: ['PostgreSQL', 'MongoDB', 'Redis Cache', 'Prisma ORM'],
      color: '#8B5CF6'
    },
    {
      category: 'DevOps',
      skills: ['AWS', 'Docker', 'CI/CD', 'Monitoring'],
      color: '#F59E0B'
    }
  ];

  return (
    <div className="service-page-wrapper">
      {/* Hero with Floating Elements */}
      <section className="service-page-hero-modern">
        <div className="service-page-hero-bg-pattern"></div>
        
        <div className="service-page-hero-content-wrapper">
          <div className="service-page-hero-text-content">
            <div className="service-page-badge-modern">
              <Star size={14} fill="currentColor" />
              <span>Full-Stack Development Studio</span>
            </div>
            <h1 className="service-page-hero-heading">
              Build Your Dream Website
            </h1>
            <p className="service-page-hero-description">
              From stunning designs to powerful backends—I handle everything. No agencies, no middlemen, just direct communication with the developer building your success.
            </p>
            <div className="service-page-hero-cta-group">
              <button className="service-page-btn-primary" onClick={() => setShowCalculator(true)}>
                <Zap size={18} />
                Calculate Your Project
              </button>
              <button className="service-page-btn-secondary">
                <Play size={18} />
                See Live Projects
              </button>
            </div>
          </div>

          <div className="service-page-hero-visual">
            <div className="service-page-stats-float">
              <div className="service-page-stat-pill">
                <Award size={20} />
                <div>
                  <div className="stat-value">50+</div>
                  <div className="stat-label">Projects</div>
                </div>
              </div>
              <div className="service-page-stat-pill">
                <Users size={20} />
                <div>
                  <div className="stat-value">40+</div>
                  <div className="stat-label">Clients</div>
                </div>
              </div>
              <div className="service-page-stat-pill">
                <TrendingUp size={20} />
                <div>
                  <div className="stat-value">99%</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Services */}
      <section className="service-page-bento-section">
        <div className="service-page-bento-header">
          <h2 className="service-page-section-title-modern">What I Build For You</h2>
          <p className="service-page-section-subtitle-modern">
            End-to-end solutions that work seamlessly together
          </p>
        </div>

        <div className="service-page-bento-grid">
          {/* Large Feature - Web Development */}
          <div className="service-page-bento-item large" style={{ '--accent': '#3B82F6' }}>
            <div className="service-page-bento-image">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop" alt="Web Development" />
              <div className="service-page-bento-overlay"></div>
            </div>
            <div className="service-page-bento-content">
              <div className="service-page-bento-icon">
                <Code size={32} />
              </div>
              <h3>Custom Web Development</h3>
              <p>Full-stack development with React, Node.js, and modern databases. Clean code that scales with your business.</p>
              <ul className="service-page-feature-list">
                <li><Check size={16} /> React & Next.js</li>
                <li><Check size={16} /> RESTful APIs</li>
                <li><Check size={16} /> Database Design</li>
                <li><Check size={16} /> Real-time Features</li>
              </ul>
            </div>
          </div>

          {/* Medium - UI/UX Design */}
          <div className="service-page-bento-item medium" style={{ '--accent': '#8B5CF6' }}>
            <div className="service-page-bento-image">
              <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop" alt="UI/UX Design" />
              <div className="service-page-bento-overlay"></div>
            </div>
            <div className="service-page-bento-content">
              <div className="service-page-bento-icon">
                <Palette size={28} />
              </div>
              <h3>UI/UX Design</h3>
              <p>Beautiful interfaces that convert visitors into customers.</p>
            </div>
          </div>

          {/* Small - Security */}
          <div className="service-page-bento-item small glass" style={{ '--accent': '#F59E0B' }}>
            <div className="service-page-bento-content centered">
              <div className="service-page-bento-icon">
                <Shield size={32} />
              </div>
              <h3>Enterprise Security</h3>
              <p>OAuth 2.0, JWT, encryption</p>
            </div>
          </div>

          {/* Medium - E-commerce */}
          <div className="service-page-bento-item medium" style={{ '--accent': '#10B981' }}>
            <div className="service-page-bento-image">
              <img src="https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop" alt="E-commerce" />
              <div className="service-page-bento-overlay"></div>
            </div>
            <div className="service-page-bento-content">
              <div className="service-page-bento-icon">
                <ShoppingCart size={28} />
              </div>
              <h3>E-commerce Solutions</h3>
              <p>Complete online stores with payment processing and inventory management.</p>
            </div>
          </div>

          {/* Small - Performance */}
          <div className="service-page-bento-item small glass" style={{ '--accent': '#EC4899' }}>
            <div className="service-page-bento-content centered">
              <div className="service-page-bento-icon">
                <Zap size={32} />
              </div>
              <h3>Lightning Fast</h3>
              <p>90+ Lighthouse scores</p>
            </div>
          </div>

          {/* Medium - Database */}
          <div className="service-page-bento-item medium glass" style={{ '--accent': '#06B6D4' }}>
            <div className="service-page-bento-content">
              <div className="service-page-bento-icon">
                <Database size={28} />
              </div>
              <h3>Database & Caching</h3>
              <p>Optimized architecture with Redis caching. Lightning-fast data access even with millions of records.</p>
              <div className="service-page-tech-badges">
                <span>PostgreSQL</span>
                <span>MongoDB</span>
                <span>Redis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Price Calculator - Improved */}
      {showCalculator && (
        <div className="service-page-calculator-modal" onClick={() => setShowCalculator(false)}>
          <div className="service-page-calculator-card" onClick={(e) => e.stopPropagation()}>
            <button className="service-page-close-modal" onClick={() => setShowCalculator(false)}>
              <X size={24} />
            </button>
            
            <div className="service-page-calculator-header-section">
              <h2>Instant Price Estimate</h2>
              <p>Get transparent pricing in real-time. No hidden costs.</p>
            </div>

            <div className="service-page-calculator-body">
              <div className="service-page-calculator-left">
                {/* Project Type */}
                <div className="service-page-calc-section">
                  <label className="service-page-calc-label">Project Type</label>
                  <div className="service-page-project-types">
                    {projectTypes.map(type => (
                      <button
                        key={type.id}
                        className={`service-page-project-type-btn ${priceConfig.type === type.id ? 'active' : ''}`}
                        onClick={() => setPriceConfig({ ...priceConfig, type: type.id })}
                      >
                        {type.icon}
                        <span>{type.name}</span>
                        <span className="type-price">${type.base}+</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pages Slider */}
                <div className="service-page-calc-section">
                  <label className="service-page-calc-label">
                    Number of Pages
                    <span className="label-value">{priceConfig.pages}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={priceConfig.pages}
                    onChange={(e) => setPriceConfig({ ...priceConfig, pages: parseInt(e.target.value) })}
                    className="service-page-range-slider"
                  />
                  <div className="service-page-range-labels">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Features */}
                <div className="service-page-calc-section">
                  <label className="service-page-calc-label">Additional Features</label>
                  <div className="service-page-features-checklist">
                    {additionalFeatures.map(feature => (
                      <button
                        key={feature.id}
                        className={`service-page-feature-checkbox ${priceConfig.features.includes(feature.id) ? 'checked' : ''}`}
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <div className="checkbox-icon">
                          {priceConfig.features.includes(feature.id) && <Check size={14} />}
                        </div>
                        <span className="feature-name">{feature.name}</span>
                        <span className="feature-price">+${feature.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Support Level */}
                <div className="service-page-calc-section">
                  <label className="service-page-calc-label">Support Level</label>
                  <div className="service-page-support-options">
                    <button
                      className={`service-page-support-btn ${priceConfig.support === 'basic' ? 'active' : ''}`}
                      onClick={() => setPriceConfig({ ...priceConfig, support: 'basic' })}
                    >
                      <div>Basic</div>
                      <small>30 days support</small>
                    </button>
                    <button
                      className={`service-page-support-btn ${priceConfig.support === 'premium' ? 'active' : ''}`}
                      onClick={() => setPriceConfig({ ...priceConfig, support: 'premium' })}
                    >
                      <div>Premium</div>
                      <small>90 days + priority</small>
                      <span className="premium-badge">+25%</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="service-page-calculator-right">
                <div className="service-page-price-summary">
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Base Project</span>
                      <span>${projectTypes.find(t => t.id === priceConfig.type)?.base || 0}</span>
                    </div>
                    {priceConfig.pages > 1 && (
                      <div className="price-row">
                        <span>Extra Pages ({priceConfig.pages - 1})</span>
                        <span>${(priceConfig.pages - 1) * 200}</span>
                      </div>
                    )}
                    {priceConfig.features.map(fId => {
                      const feature = additionalFeatures.find(f => f.id === fId);
                      return feature ? (
                        <div key={fId} className="price-row">
                          <span>{feature.name}</span>
                          <span>${feature.price}</span>
                        </div>
                      ) : null;
                    })}
                    {priceConfig.support === 'premium' && (
                      <div className="price-row">
                        <span>Premium Support</span>
                        <span>+25%</span>
                      </div>
                    )}
                  </div>

                  <div className="price-total">
                    <span>Estimated Total</span>
                    <div className="total-amount">${calculatedPrice.toLocaleString()}</div>
                  </div>

                  <button className="service-page-get-quote-btn">
                    <MessageCircle size={20} />
                    Get Exact Quote
                  </button>

                  <p className="price-note">
                    This is an estimate. Final price depends on specific requirements. Free consultation included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Screen - Why Choose Me */}
      <section className="service-page-split-section">
        <div className="service-page-split-image">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1000&fit=crop" alt="Team collaboration" />
          <div className="service-page-image-overlay"></div>
        </div>
        
        <div className="service-page-split-content">
          <h2 className="service-page-section-title-modern">Why Direct Beats Agency</h2>
          <p className="service-page-split-intro">
            You're not just another project number. You get my full attention and expertise.
          </p>

          <div className="service-page-benefits-list">
            <div className="service-page-benefit-item">
              <div className="benefit-icon" style={{ '--color': '#3B82F6' }}>
                <MessageCircle size={24} />
              </div>
              <div className="benefit-content">
                <h3>Direct Communication</h3>
                <p>Talk directly to the person building your site. No account managers or translation layers.</p>
              </div>
            </div>

            <div className="service-page-benefit-item">
              <div className="benefit-icon" style={{ '--color': '#10B981' }}>
                <Layers size={24} />
              </div>
              <div className="benefit-content">
                <h3>Full-Stack Expertise</h3>
                <p>From design to deployment, I handle everything. No coordination headaches with multiple freelancers.</p>
              </div>
            </div>

            <div className="service-page-benefit-item">
              <div className="benefit-icon" style={{ '--color': '#F59E0B' }}>
                <Zap size={24} />
              </div>
              <div className="benefit-content">
                <h3>Performance Obsessed</h3>
                <p>Every project optimized for speed. 90+ Lighthouse scores are my baseline, not my goal.</p>
              </div>
            </div>

            <div className="service-page-benefit-item">
              <div className="benefit-icon" style={{ '--color': '#8B5CF6' }}>
                <Shield size={24} />
              </div>
              <div className="benefit-content">
                <h3>Security First</h3>
                <p>Built-in OAuth, encryption, and security best practices. Your data protected from day one.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack - Liquid Cards */}
      <section className="service-page-tech-showcase">
        <div className="service-page-tech-header">
          <h2 className="service-page-section-title-modern">Modern Tech Stack</h2>
          <p className="service-page-section-subtitle-modern">
            Proven, enterprise-grade technologies that scale
          </p>
        </div>

        <div className="service-page-tech-liquid-grid">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="service-page-liquid-card" style={{ '--card-color': cap.color }}>
              <div className="liquid-card-glow"></div>
              <h3 className="liquid-card-title">{cap.category}</h3>
              <div className="liquid-card-skills">
                {cap.skills.map((skill, i) => (
                  <span key={i} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Timeline - Horizontal */}
      <section className="service-page-process-modern">
        <div className="service-page-process-header">
          <h2 className="service-page-section-title-modern">How We'll Work Together</h2>
          <p className="service-page-section-subtitle-modern">
            Transparent process that keeps you in control
          </p>
        </div>

        <div className="service-page-process-flow">
          {[
            { num: '01', title: 'Discovery', desc: 'Understanding your vision', icon: <Users size={24} /> },
            { num: '02', title: 'Strategy', desc: 'Planning the approach', icon: <BarChart3 size={24} /> },
            { num: '03', title: 'Design', desc: 'Crafting the interface', icon: <Palette size={24} /> },
            { num: '04', title: 'Development', desc: 'Building with precision', icon: <Code size={24} /> },
            { num: '05', title: 'Testing', desc: 'Quality assurance', icon: <CheckCircle size={24} /> },
            { num: '06', title: 'Launch', desc: 'Going live together', icon: <TrendingUp size={24} /> }
          ].map((step, idx) => (
            <div key={idx} className="service-page-process-step">
              <div className="process-step-number">{step.num}</div>
              <div className="process-step-icon">{step.icon}</div>
              <h3 className="process-step-title">{step.title}</h3>
              <p className="process-step-desc">{step.desc}</p>
              {idx < 5 && <div className="process-connector"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA - Immersive */}
      <section className="service-page-cta-immersive">
        <div className="service-page-cta-bg">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop" alt="Success" />
          <div className="service-page-cta-overlay"></div>
        </div>

        <div className="service-page-cta-content-box">
          <h2 className="cta-immersive-title">Ready to Build Something Amazing?</h2>
          <p className="cta-immersive-subtitle">
            Let's turn your vision into reality with a website that drives real results
          </p>

          <div className="service-page-cta-buttons">
            <button className="service-page-cta-btn-large primary" onClick={() => setShowCalculator(true)}>
              <Zap size={20} />
              Calculate Your Project
            </button>
            <button className="service-page-cta-btn-large secondary">
              <Play size={20} />
              View Case Studies
            </button>
          </div>

          <div className="service-page-trust-indicators">
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>No commitment required</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>Free project scoping</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>24hr response time</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;