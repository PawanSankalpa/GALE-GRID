import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/PricingSection.css";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$1,499",
    highlight: "Great for small businesses & startups",
    bullets: ["Up to 5 pages", "Mobile-optimized", "1 month support"],
    specs: ["Basic SEO", "Contact form", "Google Analytics", "2-3 week delivery", "Responsive design", "Basic analytics"],
    features: [
      { name: "Design & Pages", value: "Up to 5 pages", included: true },
      { name: "Support", value: "1 month", included: true },
      { name: "SEO", value: "Basic setup", included: true },
      { name: "CMS", value: "Not included", included: false },
      { name: "E-commerce", value: "Not included", included: false },
      { name: "API Integrations", value: "Basic", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$2,999",
    highlight: "Perfect for growing businesses",
    bullets: ["Up to 10 pages", "Custom animations", "3 months support"],
    specs: ["Advanced SEO", "CMS included", "Performance boost", "3-4 week delivery", "Custom animations", "Advanced analytics"],
    features: [
      { name: "Design & Pages", value: "Up to 10 pages", included: true },
      { name: "Support", value: "3 months", included: true },
      { name: "SEO", value: "Advanced strategy", included: true },
      { name: "CMS", value: "Included", included: true },
      { name: "E-commerce", value: "Basic setup", included: true },
      { name: "API Integrations", value: "Limited", included: true },
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$5,999+",
    highlight: "Ideal for large businesses & e-commerce",
    bullets: ["Unlimited pages", "E-commerce ready", "6 months support"],
    specs: ["Full SEO strategy", "API integrations", "Priority dev", "5-8 week delivery", "Custom features", "Enterprise analytics"],
    features: [
      { name: "Design & Pages", value: "Unlimited pages", included: true },
      { name: "Support", value: "6 months", included: true },
      { name: "SEO", value: "Full strategy", included: true },
      { name: "CMS", value: "Advanced CMS", included: true },
      { name: "E-commerce", value: "Full platform", included: true },
      { name: "API Integrations", value: "Custom integrations", included: true },
    ],
    cta: "Get Started",
    popular: false,
  },
];

const featureComparison = [
  { name: "Number of Pages", starter: "Up to 5", professional: "Up to 10", enterprise: "Unlimited" },
  { name: "Support Period", starter: "1 month", professional: "3 months", enterprise: "6 months" },
  { name: "SEO Strategy", starter: "Basic", professional: "Advanced", enterprise: "Full Strategy" },
  { name: "Content Management", starter: "Not included", professional: "Basic CMS", enterprise: "Advanced CMS" },
  { name: "E-commerce", starter: "Not included", professional: "Basic setup", enterprise: "Full platform" },
  { name: "API Integrations", starter: "Limited", professional: "Custom APIs", enterprise: "Advanced integrations" },
  { name: "Development Priority", starter: "Standard", professional: "Priority", enterprise: "Highest priority" },
  { name: "Delivery Time", starter: "2-3 weeks", professional: "3-4 weeks", enterprise: "5-8 weeks" },
];

const PricingSection = () => {
  const [modal, setModal] = useState(null);
  const [activePlan, setActivePlan] = useState("professional");

  return (
    <section className="pricing-section">
      <header className="pricing-header">
        <h2>Simple & Transparent Pricing</h2>
        <p className="subtitle">No hidden fees. Choose the perfect plan for your business growth.</p>
        <p className="comparison-note">Compare features to understand why each plan offers different value</p>
      </header>

      {/* Plan Selector Tabs */}
      <div className="plan-selector">
        {plans.map((plan) => (
          <button
            key={plan.id}
            className={`plan-tab ${activePlan === plan.id ? "active" : ""}`}
            onClick={() => setActivePlan(plan.id)}
          >
            {plan.name}
            {plan.popular && <span className="popular-badge">Most Popular</span>}
          </button>
        ))}
      </div>

      {/* Active Plan Display */}
      <div className="active-plan-display">
        {plans
          .filter((plan) => plan.id === activePlan)
          .map((plan) => (
            <div className="active-plan-card" key={plan.id}>
              <div className="plan-header">
                <div className="plan-title">
                  <h3>{plan.name}</h3>
                  <span className="price">{plan.price}</span>
                  <p className="highlight">{plan.highlight}</p>
                </div>
                <div className="plan-features-grid">
                  {plan.features.map((feature, idx) => (
                    <div className="feature-item" key={idx}>
                      <div className="feature-name">{feature.name}</div>
                      <div className={`feature-value ${feature.included ? "included" : "not-included"}`}>
                        {feature.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="plan-actions">
                <button className="view-specs" onClick={() => setModal(plans.findIndex(p => p.id === plan.id))}>
                  View All Specifications
                </button>
                <Link to="/contact" className="cta-btn">
                  {plan.cta} - {plan.name}
                </Link>
              </div>
            </div>
          ))}
      </div>

      {/* All Plans Grid */}
      <div className="all-plans-grid">
        {plans.map((plan) => (
          <div className={`plan-card ${plan.popular ? "popular" : ""}`} key={plan.id}>
            {plan.popular && <div className="popular-ribbon">Most Popular</div>}
            <div className="card-header">
              <h3>{plan.name}</h3>
              <span className="price">{plan.price}</span>
              <p className="highlight">{plan.highlight}</p>
            </div>

            <ul className="card-bullets">
              {plan.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div className="value-proposition">
              <h4>Why choose {plan.name}?</h4>
              <p>
                {plan.id === "starter" && "Perfect for establishing your online presence with essential features."}
                {plan.id === "professional" && "Includes advanced features for growing businesses with CMS and better SEO."}
                {plan.id === "enterprise" && "Complete solution with unlimited pages, e-commerce, and custom integrations."}
              </p>
            </div>

            <button className="view-specs" onClick={() => setModal(plans.indexOf(plan))}>
              View Full Specs
            </button>
            <Link to="/contact" className="cta-btn">
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="comparison-section">
        <h3>Feature Comparison</h3>
        <p className="comparison-subtitle">See exactly what each plan offers to make an informed decision</p>
        
        <div className="comparison-table">
          <div className="table-header">
            <div className="feature-column">Feature</div>
            <div className="plan-column">Starter</div>
            <div className="plan-column">Professional</div>
            <div className="plan-column">Enterprise</div>
          </div>
          
          {featureComparison.map((row, idx) => (
            <div className="table-row" key={idx}>
              <div className="feature-column">{row.name}</div>
              <div className="plan-column">{row.starter}</div>
              <div className="plan-column highlight">{row.professional}</div>
              <div className="plan-column premium">{row.enterprise}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Explanation */}
      <div className="value-explanation">
        <h3>Understanding the Value</h3>
        <div className="value-points">
          <div className="value-point">
            <div className="value-icon">💰</div>
            <h4>Why Professional costs more</h4>
            <p>Includes CMS for easy content updates, advanced SEO for better rankings, and longer support period.</p>
          </div>
          <div className="value-point">
            <div className="value-icon">⚡</div>
            <h4>Why Enterprise costs more</h4>
            <p>Unlimited pages, full e-commerce capabilities, custom API integrations, and highest priority support.</p>
          </div>
          <div className="value-point">
            <div className="value-icon">🎯</div>
            <h4>Right Plan for You</h4>
            <p>Starter: New businesses. Professional: Growing businesses. Enterprise: Scaling businesses.</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{plans[modal].name} – Complete Specifications</h3>
              <p className="modal-subtitle">Everything included in your {plans[modal].name.toLowerCase()} plan</p>
            </div>
            <div className="modal-content">
              <div className="modal-specs">
                <h4>Core Features</h4>
                <ul>
                  {plans[modal].specs.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-value">
                <h4>Business Value</h4>
                <p>
                  {modal === 0 && "Get your business online quickly with essential features to establish credibility and reach customers."}
                  {modal === 1 && "Scale your online presence with tools that support growth, content management, and improved visibility."}
                  {modal === 2 && "Complete digital solution for enterprises needing custom features, e-commerce, and advanced integrations."}
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <Link to="/contact" className="cta-btn">
                Get {plans[modal].name}
              </Link>
              <button className="close-btn" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="final-cta">
        <h3>Ready to Transform Your Online Presence?</h3>
        <p>Schedule a free consultation to discuss which plan fits your business best.</p>
        <Link to="/contact" className="final-cta-btn">
          Schedule Free Consultation
        </Link>
      </div>
    </section>
  );
};

export default PricingSection;