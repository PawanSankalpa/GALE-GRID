import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  Calculator,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  BarChart3,
  Sliders
} from 'lucide-react';
import './PricingPage.css';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

// Pricing Plans Data
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small businesses',
    price: { 'one-time': 1499, 'monthly': 299 },
    description: 'Get online with a professional website that converts visitors into customers.',
    features: [
      { text: 'Up to 5 custom pages', included: true },
      { text: 'Mobile-first responsive design', included: true },
      { text: 'Basic SEO optimization', included: true },
      { text: 'Contact form with email alerts', included: true },
      { text: 'Google Analytics integration', included: true },
      { text: '30 days post-launch support', included: true },
      { text: '2-3 week delivery', included: true },
      { text: 'Content Management System', included: false },
      { text: 'E-commerce functionality', included: false },
      { text: 'Custom API integrations', included: false },
    ],
    color: '#3B82F6'
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Most popular choice',
    price: { 'one-time': 2999, 'monthly': 499 },
    description: 'Everything you need to scale your business with advanced features.',
    features: [
      { text: 'Up to 12 custom pages', included: true },
      { text: 'Premium responsive design', included: true },
      { text: 'Advanced SEO & speed optimization', included: true },
      { text: 'Full CMS (edit content yourself)', included: true },
      { text: 'Custom animations & interactions', included: true },
      { text: '90 days priority support', included: true },
      { text: 'Basic e-commerce (up to 50 products)', included: true },
      { text: 'Performance monitoring dashboard', included: true },
      { text: '3-4 week delivery', included: true },
      { text: 'Priority email & chat support', included: true },
    ],
    color: '#FF6B00',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For serious growth',
    price: { 'one-time': 5999, 'monthly': 999 },
    description: 'Complete digital solution with unlimited possibilities and dedicated support.',
    features: [
      { text: 'Unlimited pages', included: true },
      { text: 'Custom design system', included: true },
      { text: 'Full SEO strategy & execution', included: true },
      { text: 'Advanced CMS with user roles', included: true },
      { text: 'Complex animations & 3D elements', included: true },
      { text: '6 months dedicated support', included: true },
      { text: 'Full e-commerce platform', included: true },
      { text: 'Custom API & third-party integrations', included: true },
      { text: 'Priority development queue', included: true },
      { text: '24/7 phone & video support', included: true },
    ],
    color: '#8B5CF6'
  }
];

// FAQs
const faqs = [
  {
    question: 'What payment options do you offer?',
    answer: 'We offer flexible payment options: pay the full amount upfront for a 10% discount, or split payments into 2-3 milestones. Monthly plans spread the cost over 6-12 months with no interest.'
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Absolutely! You can upgrade anytime. We\'ll credit what you\'ve already paid and only charge the difference. Your existing content transfers seamlessly.'
  },
  {
    question: 'What happens after the support period ends?',
    answer: 'After your included support period, you can continue with our maintenance plans starting at $99/month, or handle updates yourself. Your site is fully yours—we hand over all source code.'
  },
  {
    question: 'Do you offer custom packages?',
    answer: 'Yes! If our standard plans don\'t fit your needs, we create fully custom proposals. Contact us to discuss your requirements and get a tailored quote within 24 hours.'
  },
  {
    question: 'What\'s your refund policy?',
    answer: 'We offer a 100% money-back guarantee within the first 14 days if you\'re not satisfied with our initial concepts. After development begins, refunds are prorated based on work completed.'
  },
  {
    question: 'How long does the development process take?',
    answer: 'Timelines vary by plan: Starter (2-3 weeks), Professional (3-4 weeks), Enterprise (5-8 weeks). Need it faster? Rush delivery available for +25%.'
  }
];

// Compare features for the comparison table
const compareFeatures = [
  { name: 'Custom Pages', starter: 'Up to 5', professional: 'Up to 12', enterprise: 'Unlimited' },
  { name: 'Design Revisions', starter: '2 rounds', professional: '4 rounds', enterprise: 'Unlimited' },
  { name: 'SEO Optimization', starter: 'Basic', professional: 'Advanced', enterprise: 'Full Strategy' },
  { name: 'Content Management', starter: '—', professional: 'Full CMS', enterprise: 'Advanced CMS' },
  { name: 'E-commerce', starter: '—', professional: '50 products', enterprise: 'Unlimited' },
  { name: 'Support Duration', starter: '30 days', professional: '90 days', enterprise: '6 months' },
  { name: 'Response Time', starter: '48 hours', professional: '24 hours', enterprise: '4 hours' },
  { name: 'Custom Integrations', starter: '—', professional: 'Limited', enterprise: 'Unlimited' },
];

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('one-time');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [openFaq, setOpenFaq] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [estimatorValues, setEstimatorValues] = useState({
    pages: 5,
    features: 'basic',
    timeline: 'standard',
    addOns: []
  });
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const calculatorRef = useRef(null);

  // Calculate estimate
  const calculateEstimate = () => {
    let base = 1200;
    const pagePrice = estimatorValues.pages * 180;
    const featureMultiplier = 
      estimatorValues.features === 'basic' ? 1 : 
      estimatorValues.features === 'advanced' ? 1.6 : 2.2;
    const timelineMultiplier = estimatorValues.timeline === 'rush' ? 1.25 : 1;
    
    let addOnsCost = 0;
    if (estimatorValues.addOns.includes('seo')) addOnsCost += 500;
    if (estimatorValues.addOns.includes('copywriting')) addOnsCost += 800;
    if (estimatorValues.addOns.includes('branding')) addOnsCost += 1200;
    if (estimatorValues.addOns.includes('hosting')) addOnsCost += 300;
    
    return Math.round((base + pagePrice) * featureMultiplier * timelineMultiplier + addOnsCost);
  };

  // Animate price changes
  useEffect(() => {
    const target = calculateEstimate();
    const duration = 500;
    const start = animatedPrice;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedPrice(Math.round(start + (target - start) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [estimatorValues]);

  const toggleAddOn = (addOn) => {
    setEstimatorValues(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOn) 
        ? prev.addOns.filter(a => a !== addOn)
        : [...prev.addOns, addOn]
    }));
  };

  return (
    <div className="pricing-page">
      <NavBar />
      {/* Hero Section - Dark Overlay Style */}
      <section className="pricing-hero">
        <div className="pricing-hero-bg">
          <div className="pricing-hero-overlay"></div>
        </div>
        <div className="pricing-hero-container">
          <h1 className="pricing-hero-title">
            Invest in Growth,<br />
            <span className="title-highlight">Not Just a Website</span>
          </h1>
          <p className="pricing-hero-subtitle">
            Transparent pricing. No hidden fees. Just honest value that delivers measurable ROI.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="pricing-toggle-section">
        <div className="pricing-toggle-container">
          <div className="billing-toggle">
            <button 
              className={`billing-option ${billingCycle === 'one-time' ? 'active' : ''}`}
              onClick={() => setBillingCycle('one-time')}
            >
              One-Time Payment
              <span className="billing-discount">Save 10%</span>
            </button>
            <button 
              className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Plan
              <span className="billing-badge">Flexible</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="pricing-cards-container">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
              style={{ '--plan-color': plan.color }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Star size={14} fill="currentColor" />
                  <span>Most Popular</span>
                </div>
              )}
              
              <div className="pricing-card-header">
                <span className="plan-tagline">{plan.tagline}</span>
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price[billingCycle].toLocaleString()}</span>
                  <span className="period">/{billingCycle === 'one-time' ? 'project' : 'month'}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={feature.included ? 'included' : 'excluded'}>
                    <span className="feature-icon">
                      {feature.included ? <Check size={16} /> : <X size={16} />}
                    </span>
                    <span className="feature-text">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button className="plan-cta">
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Toggle */}
        <button 
          className="comparison-toggle"
          onClick={() => setShowComparison(!showComparison)}
        >
          <BarChart3 size={20} />
          <span>{showComparison ? 'Hide' : 'Show'} Full Comparison</span>
          <ChevronDown size={18} className={showComparison ? 'rotated' : ''} />
        </button>
      </section>

      {/* Comparison Table */}
      {showComparison && (
        <section className="comparison-section">
          <div className="comparison-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th><span style={{ color: '#3B82F6' }}>Starter</span></th>
                  <th><span style={{ color: '#FF6B00' }}>Professional</span></th>
                  <th><span style={{ color: '#8B5CF6' }}>Enterprise</span></th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((feature, idx) => (
                  <tr key={idx}>
                    <td>{feature.name}</td>
                    <td>{feature.starter}</td>
                    <td>{feature.professional}</td>
                    <td>{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Interactive Price Calculator */}
      <section className="calculator-section" ref={calculatorRef}>
        <div className="calculator-container">
          <div className="calculator-header">
            <div className="calculator-icon">
              <Calculator size={28} />
            </div>
            <h2>Project Cost Estimator</h2>
            <p>Customize your project and get an instant estimate</p>
          </div>

          <div className="calculator-body">
            <div className="calculator-inputs">
              {/* Pages Slider */}
              <div className="input-group">
                <div className="input-header">
                  <label>Number of Pages</label>
                  <span className="input-value">{estimatorValues.pages} pages</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="25" 
                  value={estimatorValues.pages}
                  onChange={(e) => setEstimatorValues({...estimatorValues, pages: parseInt(e.target.value)})}
                  className="range-slider"
                  style={{ '--progress': `${(estimatorValues.pages - 1) / 24 * 100}%` }}
                />
                <div className="range-labels">
                  <span>1</span>
                  <span>25+</span>
                </div>
              </div>

              {/* Feature Complexity */}
              <div className="input-group">
                <label>Feature Complexity</label>
                <div className="radio-cards">
                  {[
                    { id: 'basic', label: 'Basic', desc: 'Forms, content pages' },
                    { id: 'advanced', label: 'Advanced', desc: 'CMS, user auth' },
                    { id: 'complex', label: 'Complex', desc: 'E-commerce, APIs' }
                  ].map(option => (
                    <label 
                      key={option.id}
                      className={`radio-card ${estimatorValues.features === option.id ? 'active' : ''}`}
                    >
                      <input 
                        type="radio" 
                        name="features" 
                        value={option.id}
                        checked={estimatorValues.features === option.id}
                        onChange={(e) => setEstimatorValues({...estimatorValues, features: e.target.value})}
                      />
                      <span className="radio-label">{option.label}</span>
                      <span className="radio-desc">{option.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="input-group">
                <label>Timeline</label>
                <div className="radio-cards two-col">
                  <label className={`radio-card ${estimatorValues.timeline === 'standard' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="timeline" 
                      value="standard"
                      checked={estimatorValues.timeline === 'standard'}
                      onChange={(e) => setEstimatorValues({...estimatorValues, timeline: e.target.value})}
                    />
                    <span className="radio-label">Standard</span>
                    <span className="radio-desc">3-6 weeks</span>
                  </label>
                  <label className={`radio-card ${estimatorValues.timeline === 'rush' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="timeline" 
                      value="rush"
                      checked={estimatorValues.timeline === 'rush'}
                      onChange={(e) => setEstimatorValues({...estimatorValues, timeline: e.target.value})}
                    />
                    <span className="radio-label">Rush <span className="rush-badge">+25%</span></span>
                    <span className="radio-desc">1-2 weeks</span>
                  </label>
                </div>
              </div>

              {/* Add-ons */}
              <div className="input-group">
                <label>Optional Add-ons</label>
                <div className="addon-grid">
                  {[
                    { id: 'seo', label: 'SEO Package', price: '+$500' },
                    { id: 'copywriting', label: 'Copywriting', price: '+$800' },
                    { id: 'branding', label: 'Brand Identity', price: '+$1,200' },
                    { id: 'hosting', label: '1 Year Hosting', price: '+$300' }
                  ].map(addon => (
                    <label 
                      key={addon.id}
                      className={`addon-card ${estimatorValues.addOns.includes(addon.id) ? 'active' : ''}`}
                    >
                      <input 
                        type="checkbox"
                        checked={estimatorValues.addOns.includes(addon.id)}
                        onChange={() => toggleAddOn(addon.id)}
                      />
                      <span className="addon-label">{addon.label}</span>
                      <span className="addon-price">{addon.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="calculator-result">
              <div className="result-header">
                <Sliders size={20} />
                <span>Your Estimate</span>
              </div>
              <div className="result-price">
                <span className="result-currency">$</span>
                <span className="result-amount">{animatedPrice.toLocaleString()}</span>
              </div>
              <p className="result-note">
                This is an estimate based on typical projects. Final pricing may vary based on specific requirements.
              </p>
              <a href="/contact" className="result-cta">
                <span>Get Exact Quote</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-section">
        <div className="trust-container">
          <div className="trust-card">
            <div className="trust-icon">
              <Shield size={28} />
            </div>
            <h3>Money-Back Guarantee</h3>
            <p>100% refund within 14 days if you're not satisfied with our direction</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">
              <Clock size={28} />
            </div>
            <h3>On-Time Delivery</h3>
            <p>98% of projects delivered on or before the agreed deadline</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">
              <Users size={28} />
            </div>
            <h3>150+ Happy Clients</h3>
            <p>Join our growing community of successful businesses</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">
              <Zap size={28} />
            </div>
            <h3>Dedicated Support</h3>
            <p>Priority assistance from project start to launch and beyond</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq-section">
        <div className="pricing-faq-container">
          <div className="pricing-faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our pricing and services</p>
          </div>

          <div className="pricing-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`pricing-faq-item ${openFaq === index ? 'open' : ''}`}
              >
                <button 
                  className="pricing-faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={20} />
                </button>
                <div className="pricing-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta-section">
        <div className="pricing-cta-container">
          <div className="pricing-cta-card">
            <Sparkles size={32} />
            <h2>Still Have Questions?</h2>
            <p>Our team is ready to help you choose the perfect plan for your business goals</p>
            
            <div className="contact-grid">
              <a href="https://wa.me/94776868537" className="contact-card whatsapp">
                <MessageCircle size={24} />
                <span>WhatsApp</span>
              </a>
              <a href="mailto:hello@galegrid.com" className="contact-card email">
                <Mail size={24} />
                <span>Email Us</span>
              </a>
              <a href="tel:+94776868537" className="contact-card phone">
                <Phone size={24} />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
        
      </section>
      <Footer />
    </div>
  );
};

export default PricingPage;