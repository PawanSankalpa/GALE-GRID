


import React, { useState, useRef, useEffect } from "react";
import "./Services.css";
import NavBar from "../../components/NavBar";
import { 
  Code2, Database, Layout, Zap, Shield, 
  ArrowRight, Check, X, Play, Pause,
  ChevronDown, ChevronRight, Layers, 
  BarChart3, Lock, RefreshCw, MessageCircle, 
  Mail, Phone, Sparkles, TrendingUp, Users
} from 'lucide-react';

// Real images
import heroImg from "../../assets/HeroSliderPics/beautiful-bright-empire-state-building-nighttime.jpg";
import systemImg from "../../assets/portfolioPics/luxia-hero2.png";
import fullstackImg from "../../assets/portfolioPics/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg";
import dashboardImg from "../../assets/portfolioPics/visitor-management.jpeg";

const services = [
  {
    id: "custom-systems",
    icon: <Layers size={28} />,
    title: "Custom Website Systems",
    subtitle: "Not templates. Not themes. Systems built for your business.",
    problem: "Most websites are cobbled from templates that break, slow you down, and limit growth.",
    solution: "We build custom systems designed around how your business actually works.",
    outcomes: [
      "Faster load times = better Google rankings",
      "Built specifically for your workflow",
      "No bloated plugins or maintenance nightmares",
      "Scales with your business without breaking"
    ],
    includes: [
      "Custom UI & UX design",
      "Modern frontend development (React/Next.js)",
      "Performance optimization from day one",
      "SEO-ready architecture",
      "Fully responsive on all devices",
      "Mobile-first approach"
    ],
    image: systemImg,
    notIncluded: ["Generic templates", "Outdated WordPress builds", "Plugin dependency"]
  },
  {
    id: "fullstack-dev",
    icon: <Database size={28} />,
    title: "Full-Stack Development & Databases",
    subtitle: "We build the logic behind your website, not just the visuals.",
    problem: "Designers make things look good. We make things work.",
    solution: "Complete backend systems that handle data, users, and automation.",
    outcomes: [
      "User accounts that actually make sense",
      "Admin panels you can actually use",
      "Data managed securely and intelligently",
      "Automation that saves you hours per week"
    ],
    includes: [
      "Backend logic & API development",
      "Database design & setup",
      "User authentication & security",
      "Secure data handling",
      "Third-party integrations",
      "Real-time features when needed"
    ],
    image: fullstackImg,
    notIncluded: ["Frontend-only builds", "Quick template hacks", "Unsecured systems"]
  },
  {
    id: "admin-dashboards",
    icon: <BarChart3 size={28} />,
    title: "Admin Dashboards & Internal Tools",
    subtitle: "Manage your business without technical headaches.",
    problem: "Most websites leave you helpless without a developer on speed dial.",
    solution: "Custom admin panels built for humans, not engineers.",
    outcomes: [
      "Update content without calling us",
      "View leads and data in real-time",
      "Control users and permissions safely",
      "Make changes confidently without breaking things"
    ],
    includes: [
      "Custom admin interface design",
      "Content management system (your way)",
      "User & role management",
      "Analytics dashboard",
      "Safe editing environments",
      "Training & documentation"
    ],
    image: dashboardImg,
    notIncluded: ["Generic WordPress admin", "Confusing interfaces", "Technical jargon"]
  },
  {
    id: "performance-seo",
    icon: <Zap size={28} />,
    title: "Performance, SEO & Stability",
    subtitle: "Built for speed, reliability, and long-term success.",
    problem: "Slow websites lose customers. Unstable sites lose trust.",
    solution: "Engineered for performance from the first line of code.",
    outcomes: [
      "Sub-2-second page loads",
      "Higher Google rankings naturally",
      "Fewer crashes = fewer support tickets",
      "Lower long-term maintenance costs"
    ],
    includes: [
      "Performance optimization",
      "Technical SEO implementation",
      "Code splitting & lazy loading",
      "Image optimization",
      "Caching strategies",
      "Core Web Vitals tuning"
    ],
    image: systemImg,
    notIncluded: ["Quick SEO fixes", "Plugin-based optimization", "Hope-based strategies"]
  },
  {
    id: "ongoing-support",
    icon: <RefreshCw size={28} />,
    title: "Ongoing Maintenance & Growth",
    subtitle: "We don't disappear after launch.",
    problem: "Websites decay. Technology changes. You need a partner, not a contractor.",
    solution: "Proactive maintenance and strategic improvements over time.",
    outcomes: [
      "Sleep better knowing someone's watching",
      "Issues caught before customers notice",
      "Continuous small improvements",
      "Your site grows with your business"
    ],
    includes: [
      "Proactive monitoring & alerts",
      "Security updates & patches",
      "Performance optimization",
      "Content updates (within scope)",
      "Monthly reports",
      "Priority support access"
    ],
    image: fullstackImg,
    notIncluded: ["Major redesigns", "New feature development", "24/7 phone support"]
  }
];

const comparisonData = {
  template: {
    title: "Template Websites",
    subtitle: "WordPress, Wix, Squarespace",
    points: [
      { text: "Built from pre-made themes", negative: true },
      { text: "Loaded with unused features", negative: true },
      { text: "Slow performance out of the box", negative: true },
      { text: "Security vulnerabilities from plugins", negative: true },
      { text: "Breaks with updates", negative: true },
      { text: "Looks like everyone else", negative: true },
      { text: "Limited scalability", negative: true }
    ]
  },
  custom: {
    title: "Custom Systems",
    subtitle: "React, Next.js, Purpose-Built",
    points: [
      { text: "Built specifically for your business", negative: false },
      { text: "Only what you need—nothing you don't", negative: false },
      { text: "Optimized for speed from day one", negative: false },
      { text: "Secure by design, no plugin risks", negative: false },
      { text: "Stable and predictable", negative: false },
      { text: "Unique to your brand", negative: false },
      { text: "Grows with you without limits", negative: false }
    ]
  }
};

const processSteps = [
  {
    number: "01",
    title: "Discovery & Strategy",
    description: "We understand your business, goals, and technical needs before writing a single line of code.",
    duration: "1-2 weeks"
  },
  {
    number: "02",
    title: "Design & Architecture",
    description: "UI/UX design and technical architecture planning. You see exactly what you're getting.",
    duration: "2-3 weeks"
  },
  {
    number: "03",
    title: "Development & Testing",
    description: "We build, you review. Clear milestones, regular check-ins, no surprises.",
    duration: "4-8 weeks"
  },
  {
    number: "04",
    title: "Launch & Training",
    description: "Smooth deployment, admin training, and documentation. You're never left guessing.",
    duration: "1 week"
  },
  {
    number: "05",
    title: "Support & Growth",
    description: "Ongoing monitoring, updates, and improvements. We're with you for the long haul.",
    duration: "Ongoing"
  }
];

const Services = () => {
  const [expandedService, setExpandedService] = useState(null);
  const [comparisonSlider, setComparisonSlider] = useState(50);
  const [activeProcess, setActiveProcess] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const sliderRef = useRef(null);

  // Auto-advance process steps
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveProcess(prev => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleSliderDrag = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const percentage = ((x - rect.left) / rect.width) * 100;
    setComparisonSlider(Math.min(Math.max(percentage, 0), 100));
  };

  const toggleService = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="services-page">
      <NavBar />
      
      {/* POSITIONING HERO */}
      <section className="positioning-hero">
        <div className="positioning-content">
          <div className="positioning-badge">
            <Sparkles size={16} />
            <span>FOR SERVICE-BASED BUSINESSES</span>
          </div>
          <h1 className="positioning-title">
            We Don't Build Websites.<br />We Build Business Systems.
          </h1>
          <p className="positioning-subtitle">
            Most websites are cobbled from templates that break, slow you down, and limit growth.<br />
            We build custom systems designed around how your business actually works.
          </p>
          <div className="positioning-filters">
            <div className="filter-item">
              <Check size={20} />
              <span>You need predictable leads, not just a pretty website</span>
            </div>
            <div className="filter-item">
              <Check size={20} />
              <span>You're tired of technical limitations holding you back</span>
            </div>
            <div className="filter-item">
              <Check size={20} />
              <span>You want a system that scales with your business</span>
            </div>
          </div>
          <a href="#services" className="positioning-cta">
            See What We Actually Build
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* SERVICES - INTERACTIVE EXPANDABLE */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2 className="section-title">What We Build</h2>
          <p className="section-subtitle">Services designed as systems, not tasks</p>
        </div>

        <div className="services-list">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`service-item ${expandedService === service.id ? 'expanded' : ''}`}
            >
              <div 
                className="service-header"
                onClick={() => toggleService(service.id)}
              >
                <div className="service-header-left">
                  <div className="service-icon-wrapper">{service.icon}</div>
                  <div className="service-header-text">
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-subtitle">{service.subtitle}</p>
                  </div>
                </div>
                <div className="service-expand-icon">
                  {expandedService === service.id ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                </div>
              </div>

              {expandedService === service.id && (
                <div className="service-details">
                  <div className="service-details-grid">
                    <div className="service-detail-col">
                      <h4 className="detail-heading">The Problem</h4>
                      <p className="detail-text problem">{service.problem}</p>
                      
                      <h4 className="detail-heading">Our Solution</h4>
                      <p className="detail-text solution">{service.solution}</p>
                    </div>

                    <div className="service-detail-col">
                      <h4 className="detail-heading">What You Get</h4>
                      <ul className="outcomes-list">
                        {service.outcomes.map((outcome, i) => (
                          <li key={i}>
                            <TrendingUp size={18} />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="service-detail-col">
                      <h4 className="detail-heading">Includes</h4>
                      <ul className="includes-list">
                        {service.includes.map((item, i) => (
                          <li key={i}>
                            <Check size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <h4 className="detail-heading not-included-heading">Does NOT Include</h4>
                      <ul className="not-included-list">
                        {service.notIncluded.map((item, i) => (
                          <li key={i}>
                            <X size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="service-image-wrapper">
                    <img src={service.image} alt={service.title} className="service-detail-image" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON SLIDER */}
      <section className="comparison-section">
        <div className="section-header">
          <h2 className="section-title">Template Websites vs Custom Systems</h2>
          <p className="section-subtitle">Drag the slider to compare</p>
        </div>

        <div 
          className="comparison-container"
          ref={sliderRef}
          onMouseMove={handleSliderDrag}
          onMouseDown={(e) => {
            e.preventDefault();
            const onMove = (moveEvent) => handleSliderDrag(moveEvent);
            const onUp = () => {
              document.removeEventListener('mousemove', onMove);
              document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
          }}
          onTouchMove={handleSliderDrag}
        >
          <div className="comparison-side template" style={{ clipPath: `inset(0 ${100 - comparisonSlider}% 0 0)` }}>
            <div className="comparison-content">
              <div className="comparison-header">
                <X className="comparison-icon negative" size={32} />
                <h3>{comparisonData.template.title}</h3>
                <p>{comparisonData.template.subtitle}</p>
              </div>
              <ul className="comparison-list">
                {comparisonData.template.points.map((point, i) => (
                  <li key={i}>
                    <X size={18} className="negative-icon" />
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="comparison-side custom">
            <div className="comparison-content">
              <div className="comparison-header">
                <Check className="comparison-icon positive" size={32} />
                <h3>{comparisonData.custom.title}</h3>
                <p>{comparisonData.custom.subtitle}</p>
              </div>
              <ul className="comparison-list">
                {comparisonData.custom.points.map((point, i) => (
                  <li key={i}>
                    <Check size={18} className="positive-icon" />
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="comparison-slider" style={{ left: `${comparisonSlider}%` }}>
            <div className="slider-handle">
              <ChevronRight size={20} />
              <ChevronRight size={20} style={{ marginLeft: '-10px' }} />
            </div>
          </div>
        </div>

        <div className="comparison-footer">
          <p className="comparison-note">
            Technology should feel like infrastructure, not a selling pitch.<br />
            We use React and Next.js because they enable this level of performance—not because they sound impressive.
          </p>
        </div>
      </section>

      {/* PROCESS - INTERACTIVE TIMELINE */}
      <section className="process-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Clear steps. Clear handoffs. No surprises.</p>
        </div>

        <div className="process-controls">
          <button 
            className="process-control-btn"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
          >
            {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
            <span>{isAutoPlay ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        <div className="process-timeline">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className={`process-step ${activeProcess === index ? 'active' : ''} ${activeProcess > index ? 'completed' : ''}`}
              onClick={() => {
                setActiveProcess(index);
                setIsAutoPlay(false);
              }}
            >
              <div className="process-step-number">{step.number}</div>
              <div className="process-step-content">
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-description">{step.description}</p>
                <span className="process-step-duration">{step.duration}</span>
              </div>
              {index < processSteps.length - 1 && (
                <div className={`process-connector ${activeProcess > index ? 'completed' : ''}`}></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PROOF SECTION */}
      <section className="proof-section">
        <div className="section-header">
          <h2 className="section-title">How We're Different</h2>
          <p className="section-subtitle">Proof beats praise</p>
        </div>

        <div className="proof-grid">
          <div className="proof-card">
            <Code2 className="proof-icon" size={28} />
            <h3>Clean, Maintainable Code</h3>
            <p>No spaghetti code. No technical debt. Systems built to last and scale without breaking.</p>
          </div>

          <div className="proof-card">
            <Shield className="proof-icon" size={28} />
            <h3>Security by Design</h3>
            <p>Built with security from line one. No plugin vulnerabilities, no hope-based strategies.</p>
          </div>

          <div className="proof-card">
            <Zap className="proof-icon" size={28} />
            <h3>Performance Engineering</h3>
            <p>Sub-2-second loads aren't luck. They're engineered through code splitting, optimization, and smart architecture.</p>
          </div>

          <div className="proof-card">
            <Users className="proof-icon" size={28} />
            <h3>Built for Humans</h3>
            <p>Admin panels you can actually use. No technical jargon. Documentation that makes sense.</p>
          </div>

          <div className="proof-card">
            <Lock className="proof-icon" size={28} />
            <h3>Clear Boundaries</h3>
            <p>Explicit scope. Clear deliverables. No scope creep. You know exactly what you're getting.</p>
          </div>

          <div className="proof-card">
            <BarChart3 className="proof-icon" size={28} />
            <h3>Data-Driven Decisions</h3>
            <p>Built-in analytics. Real insights. Know what's working before guessing what to fix.</p>
          </div>
        </div>
      </section>

      {/* PRICING CONTEXT */}
      <section className="pricing-context-section">
        <div className="pricing-context-card">
          <div className="pricing-context-header">
            <h2>Investment Range</h2>
            <p>Clear expectations, no surprises</p>
          </div>
          
          <div className="pricing-tiers">
            <div className="pricing-tier">
              <h3>Custom Website System</h3>
              <p className="tier-price">Starting from $6,500</p>
              <p className="tier-description">5-10 page custom system with admin panel</p>
            </div>

            <div className="pricing-tier featured">
              <div className="tier-badge">MOST POPULAR</div>
              <h3>Full-Stack Platform</h3>
              <p className="tier-price">Starting from $15,000</p>
              <p className="tier-description">Complete system with backend, database, user management</p>
            </div>

            <div className="pricing-tier">
              <h3>Enterprise Solution</h3>
              <p className="tier-price">Custom Quote</p>
              <p className="tier-description">Multi-system platforms with advanced integrations</p>
            </div>
          </div>

          <div className="pricing-notes">
            <div className="pricing-note">
              <Check size={18} />
              <span>All projects include admin training & documentation</span>
            </div>
            <div className="pricing-note">
              <Check size={18} />
              <span>2-3 month typical timeline for full-stack systems</span>
            </div>
            <div className="pricing-note">
              <Check size={18} />
              <span>Ongoing maintenance available from $500/month</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta-section">
        <div className="services-cta-card">
          <div className="cta-header">
            <div className="cta-badge">
              <Sparkles size={14} />
              <span>READY TO START?</span>
            </div>
            <h2 className="cta-title">Talk to Us Before Choosing a Platform</h2>
            <p className="cta-subtitle">
              Book a 30-minute discovery call. We'll discuss your business, technical needs, and whether we're the right fit.
            </p>
          </div>

          <div className="contact-options-grid">
            <a href="#" className="contact-card">
              <div className="contact-card-icon">
                <MessageCircle size={24} />
              </div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">WhatsApp</h3>
                <p className="contact-card-subtitle">Quick questions? Message us</p>
              </div>
              <ArrowRight className="contact-card-arrow" size={20} />
            </a>

            <a href="#" className="contact-card featured">
              <div className="contact-card-icon">
                <Mail size={24} />
              </div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Email</h3>
                <p className="contact-card-subtitle">hello@agency.com</p>
              </div>
              <ArrowRight className="contact-card-arrow" size={20} />
            </a>

            <a href="#" className="contact-card">
              <div className="contact-card-icon">
                <Phone size={24} />
              </div>
              <div className="contact-card-content">
                <h3 className="contact-card-title">Call</h3>
                <p className="contact-card-subtitle">Schedule a discovery call</p>
              </div>
              <ArrowRight className="contact-card-arrow" size={20} />
            </a>
          </div>

          <div className="cta-trust-section">
            <div className="trust-item">
              <Check size={18} />
              <span>No pressure sales calls</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <Check size={18} />
              <span>Clear, honest pricing</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <Check size={18} />
              <span>Response within 24 hours</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

