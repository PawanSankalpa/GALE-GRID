import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  Crown,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Star,
  Check,
  X,
  MessageCircle,
  Headphones,
  Award,
} from "lucide-react";
import "./styles/PricingSection.css";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect Start",
    price: "1,499",
    originalPrice: "1,999",
    period: "one-time payment",
    description: "Launch your professional online presence with everything you need to get started.",
    icon: Zap,
    color: "#10B981",
    accentLight: "rgba(16, 185, 129, 0.1)",
    deliveryTime: "2-3 weeks",
    outcome: "Get online fast with instant credibility",
    features: [
      { text: "5 Custom Pages", included: true },
      { text: "Mobile-First Design", included: true },
      { text: "Basic SEO Setup", included: true },
      { text: "Contact Form", included: true },
      { text: "Analytics Dashboard", included: true },
      { text: "1 Month Support", included: true },
      { text: "CMS Access", included: false },
      { text: "E-commerce", included: false },
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Most Popular",
    price: "2,999",
    originalPrice: "3,999",
    period: "one-time payment",
    description: "Scale your business with advanced features and conversion-focused design.",
    icon: Rocket,
    color: "#FF6B00",
    accentLight: "rgba(255, 107, 0, 0.1)",
    deliveryTime: "3-4 weeks",
    outcome: "2x more conversions guaranteed",
    features: [
      { text: "10 Custom Pages", included: true },
      { text: "Premium Animations", included: true },
      { text: "Advanced SEO", included: true },
      { text: "CMS Dashboard", included: true },
      { text: "Speed Optimization", included: true },
      { text: "3 Months Support", included: true },
      { text: "Basic E-commerce", included: true },
      { text: "Custom Integrations", included: false },
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Full Power",
    price: "5,999",
    originalPrice: "7,999",
    period: "starting price",
    description: "Complete digital solution with unlimited potential and dedicated support.",
    icon: Crown,
    color: "#8B5CF6",
    accentLight: "rgba(139, 92, 246, 0.1)",
    deliveryTime: "5-8 weeks",
    outcome: "Unlimited growth & full automation",
    features: [
      { text: "Unlimited Pages", included: true },
      { text: "Full E-commerce", included: true },
      { text: "Custom APIs", included: true },
      { text: "Advanced CMS", included: true },
      { text: "AI Features", included: true },
      { text: "6 Months Support", included: true },
      { text: "Priority Queue", included: true },
      { text: "White-Glove Setup", included: true },
    ],
    popular: false,
  },
];

const hireTeamOptions = [
  {
    id: "monthly-team",
    name: "Monthly Team",
    tagline: "Ongoing Support",
    price: "3,999",
    originalPrice: "5,999",
    period: "per month",
    description: "Get a dedicated web design team to handle all your digital needs continuously.",
    icon: Users,
    color: "#3B82F6",
    accentLight: "rgba(59, 130, 246, 0.1)",
    features: [
      { text: "3-Person Design Team", included: true },
      { text: "Unlimited Revisions", included: true },
      { text: "Website Maintenance", included: true },
      { text: "40 Project Hours/Month", included: true },
      { text: "Priority Support 24/7", included: true },
      { text: "Strategy Consulting", included: true },
      { text: "Weekly Check-ins", included: true },
      { text: "Custom Integrations", included: true },
    ],
    popular: true,
  },
  {
    id: "quarterly-team",
    name: "Quarterly Team",
    tagline: "Quarterly Sprints",
    price: "10,999",
    originalPrice: "14,999",
    period: "per quarter",
    description: "Intensive quarterly projects with full team dedication and advanced features.",
    icon: Rocket,
    color: "#FF6B00",
    accentLight: "rgba(255, 107, 0, 0.1)",
    features: [
      { text: "5-Person Expert Team", included: true },
      { text: "Unlimited Revisions", included: true },
      { text: "Full App Development", included: true },
      { text: "120 Project Hours/Quarter", included: true },
      { text: "24/7 Priority Support", included: true },
      { text: "Quarterly Roadmap Planning", included: true },
      { text: "Bi-weekly Strategy Meetings", included: true },
      { text: "Advanced Analytics Setup", included: true },
    ],
    popular: false,
  },
  {
    id: "annual-team",
    name: "Annual Team",
    tagline: "Best Value",
    price: "39,999",
    originalPrice: "54,999",
    period: "per year",
    description: "Year-long partnership with dedicated team, unlimited projects, and complete digital transformation.",
    icon: Crown,
    color: "#8B5CF6",
    accentLight: "rgba(139, 92, 246, 0.1)",
    features: [
      { text: "Full-time Design Team", included: true },
      { text: "Unlimited Projects", included: true },
      { text: "Complete Digital Suite", included: true },
      { text: "500+ Project Hours/Year", included: true },
      { text: "24/7 White-Glove Support", included: true },
      { text: "Monthly Strategy Sessions", included: true },
      { text: "Performance Reviews", included: true },
      { text: "Executive Reporting", included: true },
    ],
    popular: false,
  },
];

const stats = [
  { value: "150+", label: "Projects", icon: Award },
  { value: "5.0", label: "Rating", icon: Star },
  { value: "100%", label: "Satisfaction", icon: Shield },
];

const guarantees = [
  { icon: Shield, text: "Money-back guarantee" },
  { icon: Headphones, text: "24/7 support" },
  { icon: Clock, text: "On-time delivery" },
  { icon: MessageCircle, text: "Unlimited revisions" },
];

const PricingSection = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [inView, setInView] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [pricingMode, setPricingMode] = useState("packages"); // "packages" or "hire"
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pricing-v3" ref={sectionRef}>
      {/* Ambient Background */}
      <div className="pricing-v3-bg">
        <div className="bg-gradient-orb bg-orb-1"></div>
        <div className="bg-gradient-orb bg-orb-2"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="pricing-v3-container">
        {/* Header */}
        <header className={`pricing-v3-header ${inView ? "animate-in" : ""}`}>
          <div className="header-badge">
            <Sparkles size={14} />
            <span>Simple Pricing</span>
          </div>
          
          <h2 className="header-title">
            Choose Your <span className="gradient-text">Growth Plan</span>
          </h2>
          
          <p className="header-subtitle">
            No hidden fees. No surprises. Just results.
          </p>

          {/* Pricing Mode Toggle */}
          <div className="pricing-mode-toggle">
            <button 
              className={`toggle-btn ${pricingMode === "packages" ? "active" : ""}`}
              onClick={() => setPricingMode("packages")}
            >
              <Zap size={16} />
              <span>Complete a Project</span>
            </button>
            <div className="toggle-divider"></div>
            <button 
              className={`toggle-btn ${pricingMode === "hire" ? "active" : ""}`}
              onClick={() => setPricingMode("hire")}
            >
              <Users size={16} />
              <span>Hire Our Team</span>
            </button>
          </div>
        </header>

        {/* ===== SECTION 1: PROJECT-BASED PRICING ===== */}
        {pricingMode === "packages" && (
          <div className="pricing-section-wrapper fade-in">
            {/* Pricing Cards */}
            <div className={`pricing-v3-cards ${inView ? "animate-in" : ""}`}>
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const isHovered = hoveredPlan === plan.id;
              const isPopular = plan.popular;
              
              return (
                <div 
                  className={`pricing-card-v3 ${isPopular ? "popular" : ""} ${isHovered ? "hovered" : ""}`}
                  key={plan.id}
                  style={{ 
                    "--plan-color": plan.color,
                    "--plan-accent": plan.accentLight,
                    "--delay": `${index * 0.1}s`
                  }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Popular Indicator */}
                  {isPopular && (
                    <div className="popular-ribbon">
                      <Star size={12} fill="currentColor" />
                      <span>Best Value</span>
                    </div>
                  )}

                  {/* Card Top Section */}
                  <div className="card-top">
                    <div className="plan-icon-badge">
                      <IconComponent size={22} strokeWidth={2} />
                    </div>
                    
                    <div className="plan-header">
                      <span className="plan-tagline">{plan.tagline}</span>
                      <h3 className="plan-name">{plan.name}</h3>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="plan-pricing-block">
                    <div className="price-main">
                      <span className="price-currency">$</span>
                      <span className="price-amount">{plan.price}</span>
                    </div>
                    <div className="price-meta">
                      <span className="price-original">${plan.originalPrice}</span>
                      <span className="price-period">{plan.period}</span>
                    </div>
                  </div>

                  {/* Outcome Badge */}
                  <div className="outcome-badge">
                    <TrendingUp size={14} />
                    <span>{plan.outcome}</span>
                  </div>

                  {/* Features */}
                  <ul className="features-list-v3">
                    {plan.features.map((feature, idx) => (
                      <li 
                        key={idx} 
                        className={`feature-item ${feature.included ? "included" : "excluded"}`}
                        onMouseEnter={() => setActiveFeature(`${plan.id}-${idx}`)}
                        onMouseLeave={() => setActiveFeature(null)}
                      >
                        <span className={`feature-check ${activeFeature === `${plan.id}-${idx}` ? "pulse" : ""}`}>
                          {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={10} strokeWidth={2.5} />}
                        </span>
                        <span className="feature-text">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Delivery */}
                  <div className="delivery-info">
                    <Clock size={14} />
                    <span>{plan.deliveryTime}</span>
                  </div>

                  {/* CTA */}
                  <Link 
                    to="/contact" 
                    className={`card-cta ${isPopular ? "cta-primary" : "cta-secondary"}`}
                  >
                    <span>Get Started</span>
                    <ArrowRight size={16} className="cta-arrow" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* ===== SECTION 2: TEAM HIRE PRICING ===== */}
        {pricingMode === "hire" && (
        <div className="team-hire-section fade-in">
          {/* Team Hire Cards */}
          <div className={`pricing-v3-cards team-hire-cards ${inView ? "animate-in" : ""}`}>
            {hireTeamOptions.map((plan, index) => {
              const IconComponent = plan.icon;
              const isHovered = hoveredPlan === plan.id;
              const isPopular = plan.popular;
              
              return (
                <div 
                  className={`pricing-card-v3 ${isPopular ? "popular" : ""} ${isHovered ? "hovered" : ""}`}
                  key={plan.id}
                  style={{ 
                    "--plan-color": plan.color,
                    "--plan-accent": plan.accentLight,
                    "--delay": `${index * 0.1}s`
                  }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Popular Indicator */}
                  {isPopular && (
                    <div className="popular-ribbon">
                      <Star size={12} fill="currentColor" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  {/* Card Top Section */}
                  <div className="card-top">
                    <div className="plan-icon-badge">
                      <IconComponent size={22} strokeWidth={2} />
                    </div>
                    
                    <div className="plan-header">
                      <span className="plan-tagline">{plan.tagline}</span>
                      <h3 className="plan-name">{plan.name}</h3>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="plan-pricing-block">
                    <div className="price-main">
                      <span className="price-currency">$</span>
                      <span className="price-amount">{plan.price}</span>
                    </div>
                    <div className="price-meta">
                      <span className="price-original">${plan.originalPrice}</span>
                      <span className="price-period">{plan.period}</span>
                    </div>
                  </div>

                  {/* Team Badge */}
                  <div className="outcome-badge team-badge">
                    <Users size={14} />
                    <span>Dedicated Team Partnership</span>
                  </div>

                  {/* Features */}
                  <ul className="features-list-v3">
                    {plan.features.map((feature, idx) => (
                      <li 
                        key={idx} 
                        className={`feature-item ${feature.included ? "included" : "excluded"}`}
                        onMouseEnter={() => setActiveFeature(`${plan.id}-${idx}`)}
                        onMouseLeave={() => setActiveFeature(null)}
                      >
                        <span className={`feature-check ${activeFeature === `${plan.id}-${idx}` ? "pulse" : ""}`}>
                          {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={10} strokeWidth={2.5} />}
                        </span>
                        <span className="feature-text">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link 
                    to="/contact" 
                    className={`card-cta ${isPopular ? "cta-primary" : "cta-secondary"}`}
                  >
                    <span>Schedule Consultation</span>
                    <ArrowRight size={16} className="cta-arrow" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Guarantees Strip */}
        <div className={`guarantees-strip ${inView ? "animate-in" : ""}`}>
          {guarantees.map((item, i) => (
            <div className="guarantee-chip" key={i}>
              <item.icon size={16} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`pricing-v3-cta ${inView ? "animate-in" : ""}`}>
          <div className="cta-box">
            <div className="cta-content">
              <h3>Need something custom?</h3>
              <p>Let's discuss your specific requirements and create a tailored solution.</p>
            </div>
            <Link to="/contact" className="cta-button">
              <MessageCircle size={18} />
              <span>Book Free Call</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;