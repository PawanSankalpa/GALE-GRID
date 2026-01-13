import React, { useState } from 'react';
import { 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Calculator,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
import './PricingPage.css';
import NavBar from '../../components/NavBar';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('one-time');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [openFaq, setOpenFaq] = useState(null);
  const [estimatorValues, setEstimatorValues] = useState({
    pages: 5,
    features: 'basic',
    timeline: 'standard'
  });

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      badge: 'Best for Small Projects',
      price: { 'one-time': 1499, 'monthly': 299 },
      description: 'Perfect for small businesses and startups looking to establish their online presence.',
      features: [
        { text: 'Up to 5 pages', included: true },
        { text: 'Mobile responsive design', included: true },
        { text: 'Basic SEO optimization', included: true },
        { text: 'Contact form integration', included: true },
        { text: 'Google Analytics setup', included: true },
        { text: '1 month support', included: true },
        { text: '2-3 week delivery', included: true },
        { text: 'Content Management System', included: false },
        { text: 'E-commerce functionality', included: false },
        { text: 'Advanced integrations', included: false },
        { text: 'Priority support', included: false }
      ],
      color: '#3B82F6'
    },
    {
      id: 'professional',
      name: 'Professional',
      badge: 'Most Popular',
      price: { 'one-time': 2999, 'monthly': 499 },
      description: 'Ideal for growing businesses that need advanced features and scalability.',
      features: [
        { text: 'Up to 10 pages', included: true },
        { text: 'Mobile responsive design', included: true },
        { text: 'Advanced SEO strategy', included: true },
        { text: 'Content Management System', included: true },
        { text: 'Custom animations', included: true },
        { text: '3 months support', included: true },
        { text: 'Performance optimization', included: true },
        { text: 'Basic e-commerce setup', included: true },
        { text: '3-4 week delivery', included: true },
        { text: 'Limited API integrations', included: true },
        { text: 'Priority email support', included: true }
      ],
      color: '#FF6B00',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      badge: 'Maximum Power',
      price: { 'one-time': 5999, 'monthly': 999 },
      description: 'Complete solution for large businesses requiring custom integrations and features.',
      features: [
        { text: 'Unlimited pages', included: true },
        { text: 'Mobile responsive design', included: true },
        { text: 'Full SEO strategy & execution', included: true },
        { text: 'Advanced CMS platform', included: true },
        { text: 'Custom animations & micro-interactions', included: true },
        { text: '6 months support', included: true },
        { text: 'Full e-commerce platform', included: true },
        { text: 'Custom API integrations', included: true },
        { text: 'Priority development queue', included: true },
        { text: '5-8 week delivery', included: true },
        { text: '24/7 priority support', included: true }
      ],
      color: '#8B5CF6'
    }
  ];

  const faqs = [
    {
      question: 'What is included in the monthly payment option?',
      answer: 'Monthly payments include the full website development split over 6-12 months with no interest. You own the site after final payment. Support and maintenance can be added separately.'
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Absolutely! You can upgrade anytime. We\'ll credit what you\'ve already paid and only charge the difference. Your data and content transfer seamlessly.'
    },
    {
      question: 'What happens after the support period ends?',
      answer: 'After your included support period, you can continue with our maintenance plans starting at $99/month, or handle updates yourself. Your site is fully yours to manage.'
    },
    {
      question: 'Do you offer custom packages?',
      answer: 'Yes! If our standard plans don\'t fit your needs, we create fully custom proposals. Contact us to discuss your specific requirements and get a tailored quote.'
    },
    {
      question: 'What is your refund policy?',
      answer: 'We offer a 100% money-back guarantee within the first 14 days if you\'re not satisfied with our initial concepts. After development begins, refunds are prorated based on work completed.'
    },
    {
      question: 'How long does the development process take?',
      answer: 'Timelines vary by plan: Starter (2-3 weeks), Professional (3-4 weeks), Enterprise (5-8 weeks). Rush delivery available for an additional 20% fee.'
    }
  ];

  const calculateEstimate = () => {
    let base = 1500;
    const pageMultiplier = estimatorValues.pages * 150;
    const featureMultiplier = estimatorValues.features === 'basic' ? 1 : estimatorValues.features === 'advanced' ? 1.5 : 2;
    const timelineMultiplier = estimatorValues.timeline === 'rush' ? 1.2 : 1;
    
    return Math.round((base + pageMultiplier) * featureMultiplier * timelineMultiplier);
  };

  return (
    <div className="pricing-page-root">
      
      {/* Hero Section */}
      <section className="pricing-page-hero">
        <NavBar />
        <div className="pricing-page-hero-container">
          <div className="pricing-page-hero-badge">
            <Sparkles size={16} />
            <span>Transparent Pricing</span>
          </div>
          <h1 className="pricing-page-hero-title">
            Simple, Clear Pricing for Every Business
          </h1>
          <p className="pricing-page-hero-subtitle">
            Choose the perfect plan for your needs. No hidden fees, no surprises. 
            Just honest pricing and exceptional value.
          </p>
          
          {/* Billing Toggle */}
          <div className="pricing-page-billing-toggle">
            <button 
              className={`pricing-page-billing-option ${billingCycle === 'one-time' ? 'active' : ''}`}
              onClick={() => setBillingCycle('one-time')}
            >
              One-Time Payment
            </button>
            <button 
              className={`pricing-page-billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Plan
              <span className="pricing-page-billing-badge">Flexible</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="pricing-page-cards-section">
        <div className="pricing-page-cards-container">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-page-plan-card ${plan.popular ? 'pricing-page-popular-plan' : ''} ${selectedPlan === plan.id ? 'pricing-page-selected-plan' : ''}`}
              style={{ '--plan-color': plan.color }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="pricing-page-popular-ribbon">
                  <Star size={14} fill="currentColor" />
                  <span>{plan.badge}</span>
                </div>
              )}
              
              <div className="pricing-page-plan-card-header">
                <h3 className="pricing-page-plan-name">{plan.name}</h3>
                <div className="pricing-page-plan-price-display">
                  <span className="pricing-page-price-currency">$</span>
                  <span className="pricing-page-price-amount">{plan.price[billingCycle]}</span>
                  <span className="pricing-page-price-period">/{billingCycle === 'one-time' ? 'project' : 'month'}</span>
                </div>
                <p className="pricing-page-plan-description">{plan.description}</p>
              </div>

              <ul className="pricing-page-plan-features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`pricing-page-feature-list-item ${feature.included ? 'included' : 'excluded'}`}> 
                    <div className="pricing-page-feature-icon">
                      {feature.included ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <span className="pricing-page-feature-text">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button className="pricing-page-plan-cta-button">
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Price Calculator */}
      <section className="pricing-page-price-calculator-section">
        <div className="pricing-page-calculator-container">
          <div className="pricing-page-calculator-header">
            <Calculator size={24} />
            <h2>Project Cost Estimator</h2>
            <p>Get an instant estimate based on your requirements</p>
          </div>

          <div className="pricing-page-calculator-grid">
            <div className="pricing-page-calculator-input-group">
              <label>Number of Pages</label>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={estimatorValues.pages}
                onChange={(e) => setEstimatorValues({...estimatorValues, pages: parseInt(e.target.value)})}
                className="pricing-page-range-slider"
              />
              <span className="pricing-page-range-value">{estimatorValues.pages} pages</span>
            </div>

            <div className="pricing-page-calculator-input-group">
              <label>Feature Complexity</label>
              <select 
                value={estimatorValues.features}
                onChange={(e) => setEstimatorValues({...estimatorValues, features: e.target.value})}
                className="pricing-page-select-input"
              >
                <option value="basic">Basic (Forms, Content)</option>
                <option value="advanced">Advanced (CMS, Auth)</option>
                <option value="complex">Complex (E-commerce, APIs)</option>
              </select>
            </div>

            <div className="pricing-page-calculator-input-group">
              <label>Timeline</label>
              <select 
                value={estimatorValues.timeline}
                onChange={(e) => setEstimatorValues({...estimatorValues, timeline: e.target.value})}
                className="pricing-page-select-input"
              >
                <option value="standard">Standard (3-6 weeks)</option>
                <option value="rush">Rush (+20% fee)</option>
              </select>
            </div>
          </div>

          <div className="pricing-page-calculator-result">
            <span className="pricing-page-result-label">Estimated Cost:</span>
            <span className="pricing-page-result-amount">${calculateEstimate().toLocaleString()}</span>
            <p className="pricing-page-result-note">This is an estimate. Final pricing may vary based on specific requirements.</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="pricing-page-trust-indicators-section">
        <div className="pricing-page-trust-indicators-grid">
          <div className="pricing-page-trust-indicator">
            <Shield size={24} />
            <h3>Money-Back Guarantee</h3>
            <p>100% refund within 14 days if not satisfied</p>
          </div>
          <div className="trust-indicator">
            <Clock size={24} />
            <h3>On-Time Delivery</h3>
            <p>98% of projects delivered on or before deadline</p>
          </div>
          <div className="trust-indicator">
            <Users size={24} />
            <h3>150+ Happy Clients</h3>
            <p>Join our community of successful businesses</p>
          </div>
          <div className="trust-indicator">
            <Zap size={24} />
            <h3>Dedicated Support</h3>
            <p>Priority assistance throughout your project</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-page-faq-section">
        <div className="pricing-page-faq-container">
          <div className="pricing-page-faq-header">
            <HelpCircle size={24} />
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our pricing and services</p>
          </div>

          <div className="pricing-page-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`pricing-page-faq-item ${openFaq === index ? 'open' : ''}`}
              >
                <button 
                  className="pricing-page-faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={20} className="faq-icon" />
                </button>
                <div className="pricing-page-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-page-cta-section">
        <div className="pricing-page-cta-container">
          <h2>Still Have Questions?</h2>
          <p>Our team is here to help you choose the perfect plan for your business</p>
          
          <div className="pricing-page-cta-contact-grid">
            <a href="https://wa.me/94776868537" className="pricing-page-cta-contact-card pricing-page-whatsapp">
              <MessageCircle size={24} />
              <span>Chat on WhatsApp</span>
            </a>
            <a href="mailto:hello@galegrid.com" className="pricing-page-cta-contact-card pricing-page-email">
              <Mail size={24} />
              <span>Send an Email</span>
            </a>
            <a href="tel:+94776868537" className="pricing-page-cta-contact-card pricing-page-phone">
              <Phone size={24} />
              <span>Call Us Now</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PricingPage;