import React, { useState, useRef, useEffect } from "react";
import "./Services.css";
import NavBar from "../../components/NavBar";
import { 
  Code2, Database, Shield, 
  ArrowUpRight, Check,
  BarChart3, RefreshCw, MessageCircle, 
  Mail, Phone, Sparkles,
  Globe, Palette, HeartHandshake, 
  Star, Target,
  Cpu, GitBranch, Fingerprint, LineChart
} from 'lucide-react';

// Service Data
const services = [
  {
    id: "strategy",
    number: "01",
    title: "Digital Strategy",
    subtitle: "& Discovery",
    description: "We don't just build—we strategize. Deep-dive into your business model, user psychology, and market positioning before a single pixel is designed.",
    highlight: "Where vision meets execution",
    features: ["Business Model Analysis", "User Research & Personas", "Competitive Landscape", "Technical Architecture", "ROI Projections"],
    icon: <Target size={32} />,
    color: "#FF6B00",
    gradient: "linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)"
  },
  {
    id: "design",
    number: "02",
    title: "Experience",
    subtitle: "Design",
    description: "Interfaces that feel inevitable. We craft experiences so intuitive, users forget they're using software—they're just accomplishing goals.",
    highlight: "Design that converts",
    features: ["UI/UX Design Systems", "Interactive Prototypes", "Motion Design", "Brand Integration", "Accessibility First"],
    icon: <Palette size={32} />,
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)"
  },
  {
    id: "development",
    number: "03",
    title: "Full-Stack",
    subtitle: "Engineering",
    description: "Architecture that scales. From lightning-fast frontends to robust backends, we engineer systems that grow with your ambition.",
    highlight: "Built for scale",
    features: ["React/Next.js Frontend", "Node.js/Python Backend", "Database Architecture", "API Development", "Cloud Infrastructure"],
    icon: <Code2 size={32} />,
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
  },
  {
    id: "growth",
    number: "04",
    title: "Performance",
    subtitle: "& Growth",
    description: "Speed is revenue. We obsess over milliseconds because every delay costs you conversions. SEO-engineered from the first commit.",
    highlight: "Measurable results",
    features: ["Core Web Vitals", "Technical SEO", "Analytics Integration", "A/B Testing", "Conversion Optimization"],
    icon: <LineChart size={32} />,
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)"
  }
];

// Process Steps
const processSteps = [
  { phase: "01", title: "Discovery", duration: "Week 1-2", description: "Deep understanding of your business, users, and goals" },
  { phase: "02", title: "Strategy", duration: "Week 2-3", description: "Technical architecture and experience design planning" },
  { phase: "03", title: "Design", duration: "Week 3-5", description: "UI/UX design with interactive prototypes" },
  { phase: "04", title: "Develop", duration: "Week 5-10", description: "Agile development with weekly demos" },
  { phase: "05", title: "Launch", duration: "Week 10-11", description: "Deployment, testing, and optimization" },
  { phase: "06", title: "Grow", duration: "Ongoing", description: "Continuous improvement and support" }
];

// Stats
const stats = [
  { value: "50+", label: "Projects Shipped", suffix: "" },
  { value: "2", label: "Second Load Times", suffix: "s" },
  { value: "99", label: "Uptime Guarantee", suffix: "%" },
  { value: "4.9", label: "Client Rating", suffix: "/5" }
];

// Capabilities
const capabilities = [
  { icon: <Globe size={24} />, title: "Web Applications", desc: "Custom platforms that scale" },
  { icon: <Database size={24} />, title: "Backend Systems", desc: "Robust data architecture" },
  { icon: <Cpu size={24} />, title: "API Development", desc: "Seamless integrations" },
  { icon: <Shield size={24} />, title: "Security", desc: "Enterprise-grade protection" },
  { icon: <BarChart3 size={24} />, title: "Analytics", desc: "Data-driven insights" },
  { icon: <RefreshCw size={24} />, title: "Maintenance", desc: "Proactive support" }
];

// Differentiators
const differentiators = [
  {
    title: "Not Templates",
    description: "Every line of code is written for your specific business logic and growth trajectory.",
    icon: <Fingerprint size={28} />
  },
  {
    title: "Not Agencies",
    description: "We're engineers who understand business, not salespeople who outsource development.",
    icon: <GitBranch size={28} />
  },
  {
    title: "Not Contractors",
    description: "We're partners invested in your success, not vendors waiting for the next gig.",
    icon: <HeartHandshake size={28} />
  }
];

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const [activeProcess, setActiveProcess] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({ projects: 0, time: 0, uptime: 0, rating: 0 });
  const servicesRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (isVisible['stats-section']) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setCounters({
          projects: Math.round(50 * easeOut),
          time: Math.round(2 * easeOut * 10) / 10,
          uptime: Math.round(99 * easeOut),
          rating: Math.round(4.9 * easeOut * 10) / 10
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isVisible['stats-section']]);

  // Auto-advance process
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcess(prev => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="services-page">
      <NavBar />
      
      {/* ========== HERO SECTION ========== */}
      <section className="services-hero">
        <div className="services-hero-bg"></div>
        <div className="services-hero-overlay"></div>
        <div className="services-hero-container">
          <h1 className="services-hero-title">
            We Build <span className="services-title-highlight">Systems</span>,<br />
            Not Just Websites
          </h1>
          <p className="services-hero-subtitle">
            Strategy. Design. Engineering. Custom digital products 
            that transform how businesses operate and scale.
          </p>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="services-stats-bar" id="stats-section" data-animate>
        <div className="services-stats-container">
          {stats.map((stat, i) => (
            <div key={i} className={`services-stat-item ${isVisible['stats-section'] ? 'animate' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="services-stat-value">
                {i === 0 && counters.projects}
                {i === 1 && counters.time}
                {i === 2 && counters.uptime}
                {i === 3 && counters.rating}
                <span className="services-stat-suffix">{stat.suffix}</span>
              </span>
              <span className="services-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="services-main-section" id="services" ref={servicesRef}>
        <div className="services-inner">
          <div className="services-section-intro" id="services-intro" data-animate>
            <span className="services-intro-label">
              <Sparkles size={16} />
              What We Do
            </span>
            <h2 className="services-intro-title">
              End-to-End <span className="services-gradient-text">Digital Solutions</span>
            </h2>
            <p className="services-intro-description">
              From strategy to launch and beyond, we handle every aspect of your digital product 
              with the precision of a world-class engineering team.
            </p>
          </div>

          <div className="services-showcase">
            <div className="services-nav">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  className={`services-nav-item ${activeService === index ? 'active' : ''}`}
                  onClick={() => setActiveService(index)}
                  style={{ '--accent': service.color }}
                >
                  <span className="services-nav-number">{service.number}</span>
                  <span className="services-nav-title">{service.title}</span>
                  <div className="services-nav-indicator"></div>
                </button>
              ))}
            </div>

            <div className="services-display">
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  className={`services-panel ${activeService === index ? 'active' : ''}`}
                  style={{ '--accent': service.color, '--gradient': service.gradient }}
                >
                  <div className="services-panel-content">
                    <div className="services-panel-header">
                      <div className="services-panel-icon">{service.icon}</div>
                      <div className="services-panel-titles">
                        <h3 className="services-panel-title">{service.title}</h3>
                        <span className="services-panel-subtitle">{service.subtitle}</span>
                      </div>
                    </div>
                    
                    <p className="services-panel-description">{service.description}</p>
                    
                    <div className="services-panel-highlight">
                      <Sparkles size={16} />
                      <span>{service.highlight}</span>
                    </div>
                    
                    <ul className="services-panel-features">
                      {service.features.map((feature, i) => (
                        <li key={i}>
                          <Check size={16} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a href="#contact" className="services-panel-cta">
                      <span>Discuss Your Project</span>
                      <ArrowUpRight size={18} />
                    </a>
                  </div>
                  
                  <div className="services-panel-visual">
                    <div className="services-visual-gradient"></div>
                    <div className="services-visual-pattern"></div>
                    <div className="services-visual-number">{service.number}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CAPABILITIES GRID ========== */}
      <section className="services-capabilities-section" id="capabilities" data-animate>
        <div className="services-capabilities-container">
          <div className="services-capabilities-header">
            <span className="services-section-label">Full Stack Capabilities</span>
            <h2 className="services-section-headline">Everything You Need, <br /><span className="services-gradient-text">Under One Roof</span></h2>
          </div>
          
          <div className="services-capabilities-grid">
            {capabilities.map((cap, i) => (
              <div 
                key={i} 
                className={`services-capability-card ${isVisible['capabilities'] ? 'animate' : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="services-cap-icon">{cap.icon}</div>
                <h3 className="services-cap-title">{cap.title}</h3>
                <p className="services-cap-desc">{cap.desc}</p>
                <div className="services-cap-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className="services-process-section" id="process" data-animate>
        <div className="services-process-inner">
          <div className="services-process-header">
            <span className="services-section-label">Our Process</span>
            <h2 className="services-section-headline">
              Predictable <span className="services-gradient-text">Excellence</span>
            </h2>
            <p className="services-process-subtitle">
              A proven methodology that delivers results, every single time.
            </p>
          </div>

          <div className="services-process-visualization">
            <div className="services-timeline-track">
              <div 
                className="services-timeline-progress" 
                style={{ width: `${((activeProcess + 1) / processSteps.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="services-process-steps">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`services-process-step ${activeProcess === index ? 'active' : ''} ${activeProcess > index ? 'completed' : ''}`}
                  onClick={() => setActiveProcess(index)}
                >
                  <div className="services-step-dot">
                    <span className="services-dot-inner">{step.phase}</span>
                  </div>
                  <div className="services-step-info">
                    <h4>{step.title}</h4>
                    <span className="services-step-duration">{step.duration}</span>
                  </div>
                  <p className="services-step-desc">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== DIFFERENTIATORS ========== */}
      <section className="services-differentiators-section" id="different" data-animate>
        <div className="services-diff-container">
          <div className="services-diff-header">
            <span className="services-section-label">Why Different</span>
            <h2 className="services-section-headline">
              We're <span className="services-gradient-text">Not</span> Like The Others
            </h2>
          </div>
          
          <div className="services-diff-grid">
            {differentiators.map((diff, i) => (
              <div key={i} className={`services-diff-card ${isVisible['different'] ? 'animate' : ''}`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="services-diff-icon">{diff.icon}</div>
                <h3 className="services-diff-title">{diff.title}</h3>
                <p className="services-diff-description">{diff.description}</p>
                <div className="services-diff-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIAL MARQUEE ========== */}
      <section className="services-testimonial-strip">
        <div className="services-marquee-track">
          <div className="services-marquee-content">
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                <span className="services-marquee-item">★ "Transformed our entire business" — Tech Startup CEO</span>
                <span className="services-marquee-divider">◆</span>
                <span className="services-marquee-item">★ "Best investment we ever made" — E-commerce Founder</span>
                <span className="services-marquee-divider">◆</span>
                <span className="services-marquee-item">★ "They actually understand business" — SaaS Director</span>
                <span className="services-marquee-divider">◆</span>
                <span className="services-marquee-item">★ "10x better than our old agency" — Marketing VP</span>
                <span className="services-marquee-divider">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="services-cta-section" id="contact">
        <div className="services-cta-inner">
          <div className="services-cta-content">
            <span className="services-cta-eyebrow">Ready to Start?</span>
            <h2 className="services-cta-headline">
              Let's Build Something<br />
              <span className="services-gradient-text">Extraordinary</span>
            </h2>
            <p className="services-cta-description">
              Book a free strategy call. We'll discuss your vision, challenges, 
              and how we can help you achieve your goals.
            </p>
            
            <div className="services-cta-actions">
              <a href="https://wa.me/yourphone" className="services-action-card whatsapp">
                <div className="services-action-icon"><MessageCircle size={28} /></div>
                <div className="services-action-content">
                  <span className="services-action-title">WhatsApp</span>
                  <span className="services-action-subtitle">Quick response</span>
                </div>
                <ArrowUpRight size={20} className="services-action-arrow" />
              </a>
              
              <a href="mailto:hello@agency.com" className="services-action-card email">
                <div className="services-action-icon"><Mail size={28} /></div>
                <div className="services-action-content">
                  <span className="services-action-title">Email</span>
                  <span className="services-action-subtitle">Detailed inquiry</span>
                </div>
                <ArrowUpRight size={20} className="services-action-arrow" />
              </a>
              
              <a href="#book" className="services-action-card call">
                <div className="services-action-icon"><Phone size={28} /></div>
                <div className="services-action-content">
                  <span className="services-action-title">Book a Call</span>
                  <span className="services-action-subtitle">30 min strategy</span>
                </div>
                <ArrowUpRight size={20} className="services-action-arrow" />
              </a>
            </div>
            
            <div className="services-cta-trust-signals">
              <div className="services-trust-signal"><Check size={16} /> No commitment required</div>
              <div className="services-trust-signal"><Check size={16} /> Response within 24 hours</div>
              <div className="services-trust-signal"><Check size={16} /> NDA available</div>
            </div>
          </div>
          
          <div className="services-cta-visual">
            <div className="services-visual-ring ring-1"></div>
            <div className="services-visual-ring ring-2"></div>
            <div className="services-visual-ring ring-3"></div>
            <div className="services-visual-center">
              <Star size={48} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
