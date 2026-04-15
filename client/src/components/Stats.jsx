import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  HeadphonesIcon,
  Database
} from "lucide-react";
import "./styles/Stats.css";

const Stats = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const features = [
    {
      id: 0,
      icon: LayoutDashboard,
      title: "Built-In CRM",
      description: "Manage leads, customers, and follow-ups directly from your website.",
      highlight: "No extra tools needed.",
      color: "#FF6B00",
      gradient: "linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)",
    },
    {
      id: 1,
      icon: Settings,
      title: "Full Admin Control",
      description: "Admin access, client data, dashboards, and tools you can actually",
      highlight: "use and manage.",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    },
    {
      id: 2,
      icon: HeadphonesIcon,
      title: "We Handle Everything",
      description: "Website setup, hosting, security, updates, and fixes",
      highlight: "all handled by us.",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    },
  ];

  const highlights = [
    { icon: Zap, text: "Lightning Fast Setup" },
    { icon: Shield, text: "Enterprise Security" },
    { icon: Database, text: "Real-Time Analytics" },
    { icon: Users, text: "Unlimited Team Members" },
  ];

  return (
    <section className="stats-section-v2" id="stats" ref={sectionRef}>
      {/* Background Elements */}
      <div className="stats-bg-elements">
        <div className="stats-bg-gradient"></div>
        <div className="stats-bg-pattern"></div>
        <div className="stats-floating-orb orb-1"></div>
        <div className="stats-floating-orb orb-2"></div>
      </div>

      <div className="stats-container">
        {/* Section Header */}
        <div className={`stats-header ${inView ? "in-view" : ""}`}>
          <div className="stats-badge">
            <Sparkles size={16} />
            <span>Complete Solution</span>
          </div>
          
          <h2 className="stats-title">
            More Than Just
            <span className="stats-title-accent"> Design</span>
          </h2>
          
          <p className="stats-subtitle">
            We build complete websites with the systems your business 
            needs to run smoothly and grow consistently.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className={`stats-content-grid ${inView ? "in-view" : ""}`}>
          
          {/* Feature Cards */}
          <div className="stats-features-column">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = activeCard === index;
              
              return (
                <div
                  key={feature.id}
                  className={`stats-feature-card ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                  style={{
                    "--feature-color": feature.color,
                    "--feature-gradient": feature.gradient,
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Card Accent Line */}
                  <div className="feature-accent-line"></div>
                  
                  {/* Icon */}
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>
                    <div className="feature-icon-glow"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">
                      {feature.description} <strong>{feature.highlight}</strong>
                    </p>
                  </div>
                  
                  {/* Check Icon */}
                  <div className="feature-check">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlights Card */}
          <div className="stats-highlights-card">
            <div className="highlights-glass-bg"></div>
            
            <div className="highlights-content">
              <div className="highlights-header">
                <span className="highlights-tag">Everything Included</span>
                <h3 className="highlights-title">
                  Your Complete Digital Infrastructure
                </h3>
                <p className="highlights-description">
                  Stop paying for multiple tools. Get everything in one 
                  unified platform built specifically for your business.
                </p>
              </div>

              <div className="highlights-grid">
                {highlights.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={index} 
                      className="highlight-item"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <div className="highlight-icon">
                        <IconComponent size={18} />
                      </div>
                      <span className="highlight-text">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <Link className="stats-cta-button" to="/ourWork">
                <span>View Our Projects</span>
                <ArrowRight size={18} className="cta-arrow" />
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="highlights-decoration">
              <div className="decoration-ring ring-1"></div>
              <div className="decoration-ring ring-2"></div>
              <div className="decoration-dots"></div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className={`stats-trust-strip ${inView ? "in-view" : ""}`}>
          <div className="trust-item">
            <span className="trust-number">150+</span>
            <span className="trust-label">Projects Delivered</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">98%</span>
            <span className="trust-label">Client Satisfaction</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">24/7</span>
            <span className="trust-label">Support Available</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
