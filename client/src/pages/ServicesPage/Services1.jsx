import React, { useState, useEffect } from 'react';
import { Code, Database, Lock, Zap, Palette, Smartphone, Search, ShoppingCart, TrendingUp, Users, Award, Clock, CheckCircle, ArrowRight, Layers, Globe, BarChart3, Shield, Cpu, RefreshCw, MessageCircle } from 'lucide-react';
import './Services1.css';

const Services = () => {
  const [selectedService, setSelectedService] = useState(0);
  const [priceEstimate, setPriceEstimate] = useState({
    pages: 5,
    features: [],
    timeline: 'standard'
  });
  const [estimatedPrice, setEstimatedPrice] = useState(2500);

  // Interactive Price Calculator
  const features = [
    { id: 'ecommerce', name: 'E-commerce', price: 1500 },
    { id: 'cms', name: 'CMS Integration', price: 800 },
    { id: 'auth', name: 'User Authentication', price: 600 },
    { id: 'api', name: 'API Integration', price: 700 },
    { id: 'analytics', name: 'Analytics Dashboard', price: 900 },
    { id: 'seo', name: 'Advanced SEO', price: 500 }
  ];

  useEffect(() => {
    let base = priceEstimate.pages * 300;
    let featuresTotal = priceEstimate.features.reduce((acc, f) => {
      const feature = features.find(feat => feat.id === f);
      return acc + (feature?.price || 0);
    }, 0);
    let timeline = priceEstimate.timeline === 'rush' ? 1.3 : 1;
    setEstimatedPrice(Math.round((base + featuresTotal) * timeline));
  }, [priceEstimate]);

  const services = [
    {
      id: 1,
      icon: <Code size={28} />,
      title: 'Custom Web Development',
      tagline: 'Built exactly how you need it',
      description: 'Full-stack development with React, Node.js, and modern databases. Every line of code is crafted for performance, security, and scalability.',
      features: ['React & Next.js', 'RESTful APIs', 'Database Design', 'Real-time Features'],
      color: '#3B82F6',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      icon: <Palette size={28} />,
      title: 'UI/UX Design',
      tagline: 'Beautiful meets functional',
      description: 'Design systems that convert. User research, prototyping, and testing ensure every interaction delights your customers.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      color: '#8B5CF6',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      icon: <ShoppingCart size={28} />,
      title: 'E-commerce Solutions',
      tagline: 'Sell more, stress less',
      description: 'Complete online stores with payment processing, inventory management, and conversion optimization built in.',
      features: ['Payment Gateway', 'Inventory System', 'Order Management', 'Marketing Tools'],
      color: '#10B981',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      icon: <Lock size={28} />,
      title: 'Security & Authentication',
      tagline: 'Fort Knox for your data',
      description: 'OAuth 2.0, JWT, encryption, and security best practices. Your users\' data is protected with enterprise-grade security.',
      features: ['OAuth Integration', 'JWT Authentication', 'Data Encryption', 'Security Audits'],
      color: '#F59E0B',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      icon: <Database size={28} />,
      title: 'Database & Caching',
      tagline: 'Lightning-fast data access',
      description: 'Optimized database architecture with intelligent caching strategies. Your app loads instantly, even with millions of records.',
      features: ['PostgreSQL/MongoDB', 'Redis Caching', 'Query Optimization', 'Data Migration'],
      color: '#EC4899',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      icon: <Search size={28} />,
      title: 'SEO & Performance',
      tagline: 'Get found, load fast',
      description: 'Technical SEO, performance optimization, and Core Web Vitals mastery. Rank higher and convert more visitors.',
      features: ['Technical SEO', 'Speed Optimization', 'Core Web Vitals', 'Analytics Setup'],
      color: '#06B6D4',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    }
  ];

  const whyChooseUs = [
    {
      icon: <Layers size={24} />,
      title: 'Full-Stack Expertise',
      description: 'From design to deployment, I handle everything. No coordination headaches with multiple freelancers.',
      color: '#3B82F6'
    },
    {
      icon: <Zap size={24} />,
      title: 'Performance First',
      description: 'Every project is optimized for speed. 90+ Lighthouse scores are my baseline, not my goal.',
      color: '#F59E0B'
    },
    {
      icon: <Shield size={24} />,
      title: 'Security by Default',
      description: 'Built-in OAuth, encryption, and security best practices. Your data is protected from day one.',
      color: '#10B981'
    },
    {
      icon: <Cpu size={24} />,
      title: 'Modern Tech Stack',
      description: 'React, Node.js, PostgreSQL, Redis. I use proven technologies that scale with your business.',
      color: '#8B5CF6'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Direct Communication',
      description: 'Talk directly to the person building your site. No account managers or translation layers.',
      color: '#EC4899'
    },
    {
      icon: <Award size={24} />,
      title: 'Quality Guarantee',
      description: 'Unlimited revisions until you\'re happy. I don\'t consider a project done until you do.',
      color: '#06B6D4'
    }
  ];

  const techStack = [
    { name: 'React', category: 'Frontend', icon: <Code size={20} /> },
    { name: 'Next.js', category: 'Framework', icon: <Layers size={20} /> },
    { name: 'Node.js', category: 'Backend', icon: <Cpu size={20} /> },
    { name: 'PostgreSQL', category: 'Database', icon: <Database size={20} /> },
    { name: 'MongoDB', category: 'Database', icon: <Database size={20} /> },
    { name: 'Redis', category: 'Caching', icon: <Zap size={20} /> },
    { name: 'OAuth 2.0', category: 'Security', icon: <Lock size={20} /> },
    { name: 'AWS', category: 'Hosting', icon: <Globe size={20} /> }
  ];

  const process = [
    { step: '01', title: 'Discovery', desc: 'Understanding your business goals and user needs', icon: <Users size={24} /> },
    { step: '02', title: 'Strategy', desc: 'Planning the technical architecture and user journey', icon: <BarChart3 size={24} /> },
    { step: '03', title: 'Design', desc: 'Creating beautiful, conversion-focused interfaces', icon: <Palette size={24} /> },
    { step: '04', title: 'Development', desc: 'Building with clean, scalable, secure code', icon: <Code size={24} /> },
    { step: '05', title: 'Testing', desc: 'Rigorous QA across devices and browsers', icon: <CheckCircle size={24} /> },
    { step: '06', title: 'Launch', desc: 'Deployment, monitoring, and ongoing support', icon: <TrendingUp size={24} /> }
  ];

  const stats = [
    { icon: <Award size={32} />, value: '50+', label: 'Projects Delivered', color: '#3B82F6' },
    { icon: <Clock size={32} />, value: '5+', label: 'Years Experience', color: '#10B981' },
    { icon: <Users size={32} />, value: '40+', label: 'Happy Clients', color: '#8B5CF6' },
    { icon: <TrendingUp size={32} />, value: '99%', label: 'Client Satisfaction', color: '#F59E0B' }
  ];

  const handleFeatureToggle = (featureId) => {
    setPriceEstimate(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  return (
    <div className="service-page-wrapper">
      {/* Hero Section */}
      <section className="service-page-hero">
        <div className="service-page-hero-container">
          <div className="service-page-hero-badge">
            <Zap size={14} />
            <span>Premium Web Development Services</span>
          </div>
          <h1 className="service-page-hero-title">
            Your Vision, Built Right
          </h1>
          <p className="service-page-hero-subtitle">
            Full-stack development, modern design, and security expertise—all from one developer who actually cares about your success.
          </p>
          <div className="service-page-hero-actions">
            <button className="service-page-cta-primary">
              Start Your Project
              <ArrowRight size={18} />
            </button>
            <button className="service-page-cta-secondary">
              View Live Work
            </button>
          </div>
        </div>
        
        {/* Floating Stats */}
        <div className="service-page-floating-stats">
          {stats.map((stat, idx) => (
            <div key={idx} className="service-page-stat-card" style={{ '--stat-color': stat.color }}>
              <div className="service-page-stat-icon">{stat.icon}</div>
              <div className="service-page-stat-value">{stat.value}</div>
              <div className="service-page-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="service-page-services-section">
        <div className="service-page-section-header">
          <h2 className="service-page-section-title">What I Build</h2>
          <p className="service-page-section-subtitle">
            End-to-end solutions that work together seamlessly
          </p>
        </div>

        <div className="service-page-services-grid">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`service-page-service-card ${selectedService === idx ? 'active' : ''}`}
              onMouseEnter={() => setSelectedService(idx)}
              style={{ '--service-color': service.color }}
            >
              <div className="service-page-service-image">
                <img src={service.image} alt={service.title} />
                <div className="service-page-service-overlay">
                  <div className="service-page-service-icon">{service.icon}</div>
                </div>
              </div>
              
              <div className="service-page-service-content">
                <h3 className="service-page-service-title">{service.title}</h3>
                <p className="service-page-service-tagline">{service.tagline}</p>
                <p className="service-page-service-description">{service.description}</p>
                
                <ul className="service-page-service-features">
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Price Calculator Tool */}
      <section className="service-page-calculator-section">
        <div className="service-page-calculator-container">
          <div className="service-page-calculator-header">
            <h2 className="service-page-section-title">Project Price Estimator</h2>
            <p className="service-page-section-subtitle">
              Get an instant estimate for your project. This is what makes me different—full transparency from day one.
            </p>
          </div>

          <div className="service-page-calculator-tool">
            <div className="service-page-calculator-inputs">
              <div className="service-page-input-group">
                <label>Number of Pages</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={priceEstimate.pages}
                  onChange={(e) => setPriceEstimate({ ...priceEstimate, pages: parseInt(e.target.value) })}
                />
                <span className="service-page-input-value">{priceEstimate.pages} pages</span>
              </div>

              <div className="service-page-features-group">
                <label>Additional Features</label>
                <div className="service-page-features-grid">
                  {features.map(feature => (
                    <button
                      key={feature.id}
                      className={`service-page-feature-chip ${priceEstimate.features.includes(feature.id) ? 'active' : ''}`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <CheckCircle size={16} />
                      <span>{feature.name}</span>
                      <span className="service-page-feature-price">+${feature.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="service-page-timeline-group">
                <label>Timeline</label>
                <div className="service-page-timeline-options">
                  <button
                    className={`service-page-timeline-btn ${priceEstimate.timeline === 'standard' ? 'active' : ''}`}
                    onClick={() => setPriceEstimate({ ...priceEstimate, timeline: 'standard' })}
                  >
                    <Clock size={20} />
                    <span>Standard (4-6 weeks)</span>
                  </button>
                  <button
                    className={`service-page-timeline-btn ${priceEstimate.timeline === 'rush' ? 'active' : ''}`}
                    onClick={() => setPriceEstimate({ ...priceEstimate, timeline: 'rush' })}
                  >
                    <Zap size={20} />
                    <span>Rush (2-3 weeks) +30%</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="service-page-calculator-result">
              <div className="service-page-result-card">
                <div className="service-page-result-label">Estimated Investment</div>
                <div className="service-page-result-price">${estimatedPrice.toLocaleString()}</div>
                <div className="service-page-result-note">
                  This is a starting estimate. Final pricing depends on specific requirements.
                </div>
                <button className="service-page-result-cta">
                  Get Exact Quote
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="service-page-why-section">
        <div className="service-page-section-header">
          <h2 className="service-page-section-title">Why Choose Me Over Agencies</h2>
          <p className="service-page-section-subtitle">
            Direct access to a senior developer who does it all—no middlemen, no communication breakdowns
          </p>
        </div>

        <div className="service-page-why-grid">
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="service-page-why-card" style={{ '--card-color': item.color }}>
              <div className="service-page-why-icon">{item.icon}</div>
              <h3 className="service-page-why-title">{item.title}</h3>
              <p className="service-page-why-description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="service-page-tech-section">
        <div className="service-page-section-header">
          <h2 className="service-page-section-title">Modern Tech Stack</h2>
          <p className="service-page-section-subtitle">
            I use proven, enterprise-grade technologies that scale
          </p>
        </div>

        <div className="service-page-tech-grid">
          {techStack.map((tech, idx) => (
            <div key={idx} className="service-page-tech-item">
              <div className="service-page-tech-icon">{tech.icon}</div>
              <div className="service-page-tech-name">{tech.name}</div>
              <div className="service-page-tech-category">{tech.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="service-page-process-section">
        <div className="service-page-section-header">
          <h2 className="service-page-section-title">How We'll Work Together</h2>
          <p className="service-page-section-subtitle">
            A transparent, collaborative process that keeps you in control
          </p>
        </div>

        <div className="service-page-process-timeline">
          {process.map((item, idx) => (
            <div key={idx} className="service-page-process-item">
              <div className="service-page-process-number">{item.step}</div>
              <div className="service-page-process-icon">{item.icon}</div>
              <h3 className="service-page-process-title">{item.title}</h3>
              <p className="service-page-process-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="service-page-final-cta">
        <div className="service-page-cta-content">
          <h2 className="service-page-cta-title">Ready to Build Something Amazing?</h2>
          <p className="service-page-cta-subtitle">
            Let's turn your vision into a high-performing website that drives real results
          </p>
          <div className="service-page-cta-actions">
            <button className="service-page-cta-primary large">
              Schedule Free Consultation
              <ArrowRight size={20} />
            </button>
            <button className="service-page-cta-secondary large">
              View Case Studies
            </button>
          </div>
          <div className="service-page-cta-trust">
            <CheckCircle size={16} />
            <span>No commitment required • Free project scoping • Response within 24 hours</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;