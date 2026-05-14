import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, X, ArrowRight, Calculator,
  Zap, Shield, Clock, Users, Star,
  ChevronDown, Globe, Lock, TrendingUp
} from 'lucide-react';
import './PricingPage.css';
import NavBar from '../../components/NavBar';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { calcEstimate, getPlanForEstimate } from '../../utils/projectEstimate';
import { cacheGet, cacheSet } from '../../utils/prefetch.js';

const DEFAULT_ESTIMATOR_VALUES = {
  pages: 5,
  features: 'basic',
  timeline: 'standard',
  addOns: [],
};

function getInitialEstimatorState() {
  const warmed = cacheGet('pricing_estimator_seed');
  if (!warmed || !warmed.scenario) return DEFAULT_ESTIMATOR_VALUES;

  const { scenario } = warmed;
  if (
    typeof scenario.pages !== 'number' ||
    typeof scenario.features !== 'string' ||
    typeof scenario.timeline !== 'string' ||
    !Array.isArray(scenario.addOns)
  ) {
    return DEFAULT_ESTIMATOR_VALUES;
  }

  return scenario;
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Launch your presence',
    marketPrice: { 'one-time': 2499, 'monthly': 449 },
    price: { 'one-time': 749, 'monthly': 149 },
    savings: { 'one-time': 1750, 'monthly': 300 },
    roi: 'Return on just 2 new clients paying you',
    description: 'The essential foundation for small businesses ready to get online and start converting.',
    features: [
      { text: 'Up to 6 custom pages', included: true },
      { text: 'Mobile-first responsive design', included: true },
      { text: 'Basic SEO setup', included: true },
      { text: 'Contact form with email alerts', included: true },
      { text: 'Google Analytics integration', included: true },
      { text: '30-day post-launch support', included: true },
      { text: 'Free domain for 1 year', included: true },
      { text: 'Content Management System', included: false },
      { text: 'E-commerce functionality', included: false },
      { text: 'Custom API integrations', included: false },
    ],
    color: '#3B82F6',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'The smart choice for growth',
    marketPrice: { 'one-time': 5999, 'monthly': 899 },
    price: { 'one-time': 1999, 'monthly': 349 },
    savings: { 'one-time': 4000, 'monthly': 550 },
    roi: 'Most businesses break even in under 90 days',
    description: 'Everything you need to compete professionally and scale with confidence.',
    features: [
      { text: 'Up to 15 custom pages', included: true },
      { text: 'Premium responsive design', included: true },
      { text: 'Advanced SEO & speed optimisation', included: true },
      { text: 'Full CMS — edit content yourself', included: true },
      { text: 'Custom animations & interactions', included: true },
      { text: '90-day priority support', included: true },
      { text: 'E-commerce (up to 50 products)', included: true },
      { text: 'Free domain for 1 year', included: true },
      { text: 'Performance monitoring dashboard', included: true },
      { text: '4 design revision rounds', included: true },
    ],
    color: '#FF6B00',
    popular: true,
    valueStack: [
      { item: 'Custom 15-page website design',    value: 3500 },
      { item: 'Mobile & speed optimisation',      value: 400  },
      { item: 'Advanced SEO foundation',          value: 600  },
      { item: 'Full CMS integration',             value: 350  },
      { item: 'Google Analytics setup',           value: 200  },
      { item: 'Free domain for 1 year',           value: 150  },
      { item: 'SSL certificate',                  value: 100  },
      { item: '90-day post-launch support',       value: 900  },
      { item: '4 design revision rounds',         value: 400  },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Maximum growth, zero limits',
    marketPrice: { 'one-time': 14999, 'monthly': 2199 },
    price: { 'one-time': 4999, 'monthly': 899 },
    savings: { 'one-time': 10000, 'monthly': 1300 },
    roi: 'Built to generate $15,000+ in new revenue',
    description: 'Complete digital solution with unlimited scope, advanced integrations, and dedicated support.',
    features: [
      { text: 'Unlimited pages', included: true },
      { text: 'Custom design system & brand guide', included: true },
      { text: 'Full SEO strategy & execution', included: true },
      { text: 'Advanced CMS with user roles', included: true },
      { text: 'Complex animations & 3D elements', included: true },
      { text: '6 months dedicated support', included: true },
      { text: 'Full e-commerce platform', included: true },
      { text: 'Custom API & third-party integrations', included: true },
      { text: 'Priority development queue', included: true },
      { text: '4-hour response time guarantee', included: true },
    ],
    color: '#8B5CF6',
    popular: false,
  },
];

const compareFeatures = [
  { name: 'Custom Pages',          starter: 'Up to 6',   professional: 'Up to 15',  enterprise: 'Unlimited' },
  { name: 'Design Revisions',      starter: '2 rounds',  professional: '4 rounds',  enterprise: 'Unlimited' },
  { name: 'SEO Optimisation',      starter: 'Basic',     professional: 'Advanced',  enterprise: 'Full Strategy' },
  { name: 'Content Management',    starter: '—',         professional: 'Full CMS',  enterprise: 'Advanced CMS + Roles' },
  { name: 'E-commerce',            starter: '—',         professional: '50 products', enterprise: 'Unlimited' },
  { name: 'Support Duration',      starter: '30 days',   professional: '90 days',   enterprise: '6 months' },
  { name: 'Response Time',         starter: '48 hours',  professional: '24 hours',  enterprise: '4 hours' },
  { name: 'Custom Integrations',   starter: '—',         professional: 'Limited',   enterprise: 'Unlimited' },
];

const roiStats = [
  { num: '4.2×', label: 'Average ROI on professional website investment in the first year', src: 'Industry avg, 2024–2025' },
  { num: '90 days', label: 'Average payback period for service businesses after launching a professional website', src: 'Industry avg, 2024–2025' },
  { num: '+32%', label: 'Average increase in bookings for hospitality businesses after integrating an online booking system', src: 'Industry avg, 2024–2025' },
];

const trustItems = [
  { icon: <Shield size={26} />, title: 'Money-Back Guarantee', desc: '100% refund if we don\'t deliver exactly what we agreed, on time.' },
  { icon: <Clock size={26} />, title: 'On-Time Delivery', desc: '98% of projects delivered on or before the agreed deadline.' },
  { icon: <Users size={26} />, title: '10+ Happy Clients', desc: 'Real businesses growing with our websites and systems.' },
  { icon: <Zap size={26} />, title: 'Dedicated Support', desc: 'From first call to post-launch — you\'re never left alone.' },
];

const baseIncludes = [
  { icon: <Globe size={22} />, text: 'Free domain for 1 year' },
  { icon: <Lock size={22} />, text: 'SSL certificate included' },
  { icon: <Zap size={22} />, text: 'Sub-2-second load speed' },
  { icon: <Shield size={22} />, text: 'Post-launch support' },
];

const faqs = [
  {
    question: "What's a Founding Client rate?",
    answer: "We're a new agency building our portfolio. To do that, we're offering our first 10 clients a dramatically reduced rate — up to 70% below US market price for equivalent work. Once all 10 spots are taken, this pricing is gone permanently. The quality of work is identical; the price is a one-time opportunity."
  },
  {
    question: "What payment options do you offer?",
    answer: "We offer flexible payment options: pay the full amount upfront, or split into 2 milestones. Monthly plans spread the cost over 6 months with no interest."
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Absolutely. You can upgrade any time. We'll credit what you've already paid and only charge the difference. Your existing content transfers seamlessly."
  },
  {
    question: "What happens after the support period ends?",
    answer: "After your included support period, you can continue with a maintenance plan starting at $99/month, or handle updates yourself. Your site is fully yours — we hand over all files and source code."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 100% money-back guarantee. If we fail to deliver what we agreed, on time, you get every dollar back. No questions asked. This is our risk — not yours."
  },
  {
    question: "How long does development take?",
    answer: "Starter: 2–3 weeks. Professional: 3–4 weeks. Enterprise: 5–8 weeks. Need it faster? Rush delivery is available for +25%."
  },
];

/* ─────────────────────────────────────────
   PLAN CARD (sub-component)
───────────────────────────────────────── */
const PlanCard = ({ plan, billingCycle, isAnimating, recommendedPlan, openValueStack, setOpenValueStack }) => {
  const cardRef = useRef(null);
  const [cx, setCx] = useState(-999);
  const [cy, setCy] = useState(-999);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setCx(e.clientX - rect.left);
    setCy(e.clientY - rect.top);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCx(-999);
    setCy(-999);
  }, []);

  const isRecommended = recommendedPlan === plan.id;
  const totalStackValue = plan.valueStack ? plan.valueStack.reduce((a, b) => a + b.value, 0) : 0;

  return (
    <div
      ref={cardRef}
      className={`pp-plan-card${plan.popular ? ' pp-plan-featured' : ''}${isRecommended ? ' pp-plan-recommended' : ''}`}
      style={{
        '--plan-color': plan.color,
        '--cx': `${cx}px`,
        '--cy': `${cy}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Accent color strip at top */}
      <div className="pp-card-accent" aria-hidden="true" />

      {/* Popular badge floats above the card */}
      {plan.popular && (
        <div className="pp-popular-badge">
          <Star size={13} fill="currentColor" />
          <span>Most Popular</span>
        </div>
      )}

      {/* Card inner — sits above ::before/::after pseudo-elements */}
      <div className="pp-plan-card-inner">

        {/* Savings badge */}
        <div className="pp-savings-badge" style={{ background: plan.color }}>
          Save ${plan.savings[billingCycle].toLocaleString()}
        </div>

        <p className="pp-plan-tagline">{plan.tagline}</p>
        <h3 className="pp-plan-name" style={{ color: plan.color }}>{plan.name}</h3>

        {/* Price block */}
        <div className="pp-price-block">
          <p className="pp-market-price">
            Market rate: ${plan.marketPrice[billingCycle].toLocaleString()}
            <span className="pp-market-label">/{billingCycle === 'one-time' ? 'project' : 'mo'}</span>
          </p>
          <div className={`pp-price-row${isAnimating ? ' pp-price-animating' : ''}`}>
            <span className="pp-currency">$</span>
            <span className="pp-price-amount">
              {typeof plan.price[billingCycle] === 'number'
                ? plan.price[billingCycle].toLocaleString()
                : plan.price[billingCycle]}
            </span>
            <span className="pp-period">
              /{billingCycle === 'one-time' ? 'project' : 'mo'}
            </span>
          </div>
          <p className="pp-roi-line">{plan.roi}</p>
        </div>

        <p className="pp-plan-desc">{plan.description}</p>

        {/* Features */}
        <ul className="pp-features-list">
          {plan.features.map((f, i) => (
            <li key={i} className={f.included ? 'pp-feat-yes' : 'pp-feat-no'}>
              <span className="pp-feat-icon">
                {f.included ? <Check size={15} /> : <X size={15} />}
              </span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        {/* Value stack (Pro only) */}
        {plan.valueStack && (
          <div className="pp-value-stack-wrapper">
            <button
              className="pp-value-toggle"
              onClick={() => setOpenValueStack(openValueStack === plan.id ? null : plan.id)}
              style={{ color: plan.color }}
            >
              <TrendingUp size={15} />
              <span>See what's included (valued at ${totalStackValue.toLocaleString()})</span>
              <ChevronDown
                size={15}
                className={`pp-chevron${openValueStack === plan.id ? ' pp-chevron-open' : ''}`}
              />
            </button>
            {openValueStack === plan.id && (
              <div className="pp-value-stack">
                {plan.valueStack.map((item, i) => (
                  <div key={i} className="pp-vs-row">
                    <span className="pp-vs-item">{item.item}</span>
                    <span className="pp-vs-value">${item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pp-vs-total">
                  <span>Total market value</span>
                  <span>${totalStackValue.toLocaleString()}</span>
                </div>
                <div className="pp-vs-you-pay">
                  <span>You pay today (founding rate)</span>
                  <span style={{ color: plan.color }}>${plan.price['one-time'].toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA area — pushed to bottom by flex-col on card-inner */}
        <div className="pp-card-cta-area">
          <Link
            to="/plan"
            className={`pp-plan-cta${plan.popular ? ' pp-plan-cta-featured' : ' pp-plan-cta-ghost'}`}
            style={plan.popular ? { background: plan.color } : { borderColor: plan.color, color: plan.color }}
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>
          <p className="pp-guarantee-line">
            <Shield size={13} />
            100% money-back if not delivered on time
          </p>
        </div>

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const PricingPage = () => {
  const initialEstimatorValues = getInitialEstimatorState();
  const [billingCycle, setBillingCycle] = useState('one-time');
  const [isAnimating, setIsAnimating] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [openValueStack, setOpenValueStack] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const [estimatorValues, setEstimatorValues] = useState(initialEstimatorValues);
  const [animatedPrice, setAnimatedPrice] = useState(calcEstimate(initialEstimatorValues));
  const [recommendedPlan, setRecommendedPlan] = useState('professional');
  const [pingKey, setPingKey] = useState(0);
  const rafRef = useRef(null);
  const prevPriceRef = useRef(animatedPrice);

  // Billing toggle animation
  const handleBillingToggle = (cycle) => {
    if (cycle === billingCycle) return;
    setIsAnimating(true);
    setTimeout(() => {
      setBillingCycle(cycle);
      setIsAnimating(false);
    }, 180);
  };

  // Estimator price animation
  useEffect(() => {
    const target = calcEstimate(estimatorValues);
    const newPlan = getPlanForEstimate(target);

    if (newPlan !== recommendedPlan) {
      setRecommendedPlan(newPlan);
      setPingKey(k => k + 1);
    }

    const start = prevPriceRef.current;
    const startTime = performance.now();
    const duration = 450;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      setAnimatedPrice(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevPriceRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [estimatorValues]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const estimate = calcEstimate(estimatorValues);
    const predictedPlan = getPlanForEstimate(estimate);
    cacheSet(
      'pricing_estimator_seed',
      {
        scenario: estimatorValues,
        estimate,
        predictedPlan,
        warmedAt: Date.now(),
      },
      24 * 60 * 60 * 1000
    );
  }, [estimatorValues]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisibleSections((prev) => ({ ...prev, [e.target.id]: true }));
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    document.querySelectorAll('[data-pp-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => (visibleSections[id] ? 'pp-sect-visible' : 'pp-sect-hidden');

  const toggleAddOn = (id) => {
    setEstimatorValues(prev => ({
      ...prev,
      addOns: prev.addOns.includes(id)
        ? prev.addOns.filter(a => a !== id)
        : [...prev.addOns, id],
    }));
  };

  const planNameMap = { starter: 'Starter', professional: 'Professional', enterprise: 'Enterprise' };

  return (
    <div className="pp-page">

      {/* ══════════════════════════════════════
          HERO — Dark, floating orbs
          ══════════════════════════════════════ */}
      <div className="pp-hero-wrapper">
        <NavBar />
        <section className="pp-hero">
          <div className="pp-orb pp-orb-1" aria-hidden="true" />
          <div className="pp-orb pp-orb-2" aria-hidden="true" />
          <div className="pp-orb pp-orb-3" aria-hidden="true" />
          <div className="pp-hero-content">
            <p className="pp-eyebrow">- INVESTMENT CLARITY -</p>
            <h1 className="pp-hero-title">
              Clear Pricing.<br /><span className="pp-hero-accent">Serious Results.</span>
            </h1>
            <p className="pp-hero-subtext">
              No hidden fees. No surprises. Just honest founding-client rates that deliver
              measurable results — before we raise prices for good.
            </p>
            <div className="pp-hero-actions">
              <a className="pp-btn-primary" href="#pp-plans">View Plans ↓</a>
              <Link className="pp-btn-ghost" to="/plan">Get Custom Quote →</Link>
            </div>
            <div className="pp-hero-trust">
              <span className="pp-trust-badge"><Check size={14} /> 100% money-back</span>
              <span className="pp-trust-badge"><Check size={14} /> Free consultation</span>
              <span className="pp-trust-badge"><Check size={14} /> 98% on-time</span>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════
          BILLING TOGGLE
          ══════════════════════════════════════ */}
      <section className="pp-toggle-section">
        <div className="pp-toggle-container">
          <div className="pp-billing-toggle">
            <button
              className={`pp-billing-btn${billingCycle === 'one-time' ? ' pp-billing-active' : ''}`}
              onClick={() => handleBillingToggle('one-time')}
            >
              One-Time Payment
              <span className="pp-billing-tag">Save 10%</span>
            </button>
            <button
              className={`pp-billing-btn${billingCycle === 'monthly' ? ' pp-billing-active' : ''}`}
              onClick={() => handleBillingToggle('monthly')}
            >
              Monthly Retainer
              <span className="pp-billing-tag">Flexible</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLANS SECTION
          ══════════════════════════════════════ */}
      <section className="pp-plans-section" id="pp-plans">
        <div className="pp-plans-container">

          {/* Plans section header */}
          <div className="pp-plans-header">
            <p className="pp-plans-eyebrow">- SELECT YOUR PACKAGE -</p>
            <h2 className="pp-plans-title">Choose Your Founding Rate</h2>
            <p className="pp-plans-subtitle">
              Prices reset to market rate after 10 founding clients. Lock yours in now.
            </p>
          </div>

          {/* Founding spots scarcity counter */}
          <div className="pp-founding-banner">
            <div className="pp-founding-inner">
              <span className="pp-founding-dot" />
              <p>
                <strong>Founding client pricing</strong> — only 10 spots ever.
                Prices reset to market rate once filled.
              </p>
              <div className="pp-spots-counter">
                <span className="pp-spots-text">8 of 10 spots remaining</span>
                <div className="pp-spots-bar">
                  <div className="pp-spots-fill" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pp-plans-grid" key={pingKey}>
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isAnimating={isAnimating}
                recommendedPlan={recommendedPlan}
                openValueStack={openValueStack}
                setOpenValueStack={setOpenValueStack}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BASE INCLUDES STRIP
          ══════════════════════════════════════ */}
      <section id="pp-base" data-pp-animate className={`pp-base-section ${vis('pp-base')}`}>
        <div className="pp-base-container">
          <p className="pp-base-label">Included in every plan</p>
          <div className="pp-base-grid">
            {baseIncludes.map((item, i) => (
              <div key={i} className="pp-base-item">
                <span className="pp-base-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ROI PROOF — Dark section
          ══════════════════════════════════════ */}
      <section id="pp-roi" data-pp-animate className={`pp-roi-section ${vis('pp-roi')}`}>
        <div className="pp-roi-inner">
          <div className="pp-roi-header">
            <span className="pp-roi-eyebrow">- THE MATH IS SIMPLE -</span>
            <h2 className="pp-roi-title">
              A Website Isn't a Cost.<br />It's Your Best Salesperson.
            </h2>
          </div>
          <div className="pp-roi-stats">
            {roiStats.map((s, i) => (
              <div key={i} className="pp-roi-stat">
                <span className="pp-roi-num">{s.num}</span>
                <p className="pp-roi-label">{s.label}</p>
                <span className="pp-roi-src">{s.src}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPARISON TABLE
          ══════════════════════════════════════ */}
      <section id="pp-compare" data-pp-animate className={`pp-compare-section ${vis('pp-compare')}`}>
        <div className="pp-compare-container">
          <h2 className="pp-compare-title">Side-by-Side Comparison</h2>
          <div className="pp-compare-scroll">
            <table className="pp-compare-table">
              <thead>
                <tr>
                  <th className="pp-compare-feature-col">Feature</th>
                  <th style={{ color: '#3B82F6' }}>Starter</th>
                  <th className="pp-compare-pro-col" style={{ color: '#FF6B00' }}>Professional</th>
                  <th style={{ color: '#8B5CF6' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((row, i) => (
                  <tr key={i}>
                    <td className="pp-compare-feature-col">{row.name}</td>
                    <td>{row.starter}</td>
                    <td className="pp-compare-pro-col">{row.professional}</td>
                    <td>{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROJECT COST ESTIMATOR
          ══════════════════════════════════════ */}
      <section id="pp-estimator" data-pp-animate className={`pp-estimator-section ${vis('pp-estimator')}`}>
        <div className="pp-estimator-container">
          <div className="pp-estimator-header">
            <div className="pp-estimator-icon">
              <Calculator size={26} />
            </div>
            <h2>Project Cost Estimator</h2>
            <p>Customise your project and get an instant estimate</p>
          </div>

          <div className="pp-estimator-body">
            <div className="pp-estimator-inputs">

              {/* Pages slider */}
              <div className="pp-input-group">
                <div className="pp-input-header">
                  <label>Number of Pages</label>
                  <span className="pp-input-val">{estimatorValues.pages} pages</span>
                </div>
                <input
                  type="range"
                  min="1" max="25"
                  value={estimatorValues.pages}
                  onChange={e => setEstimatorValues(v => ({ ...v, pages: parseInt(e.target.value) }))}
                  className="pp-range-slider"
                  style={{ '--progress': `${(estimatorValues.pages - 1) / 24 * 100}%` }}
                />
                <div className="pp-range-labels"><span>1</span><span>25+</span></div>
              </div>

              {/* Feature complexity */}
              <div className="pp-input-group">
                <label>Feature Complexity</label>
                <div className="pp-radio-cards">
                  {[
                    { id: 'basic',    label: 'Basic',    desc: 'Forms, content pages' },
                    { id: 'advanced', label: 'Advanced', desc: 'CMS, user auth' },
                    { id: 'complex',  label: 'Complex',  desc: 'E-commerce, APIs' },
                  ].map(opt => (
                    <label key={opt.id} className={`pp-radio-card${estimatorValues.features === opt.id ? ' pp-radio-active' : ''}`}>
                      <input
                        type="radio" name="pp-features" value={opt.id}
                        checked={estimatorValues.features === opt.id}
                        onChange={e => setEstimatorValues(v => ({ ...v, features: e.target.value }))}
                      />
                      <span className="pp-radio-label">{opt.label}</span>
                      <span className="pp-radio-desc">{opt.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="pp-input-group">
                <label>Timeline</label>
                <div className="pp-radio-cards pp-radio-two">
                  {[
                    { id: 'standard', label: 'Standard', desc: '3–6 weeks' },
                    { id: 'rush',     label: 'Rush +25%', desc: '1–2 weeks' },
                  ].map(opt => (
                    <label key={opt.id} className={`pp-radio-card${estimatorValues.timeline === opt.id ? ' pp-radio-active' : ''}`}>
                      <input
                        type="radio" name="pp-timeline" value={opt.id}
                        checked={estimatorValues.timeline === opt.id}
                        onChange={e => setEstimatorValues(v => ({ ...v, timeline: e.target.value }))}
                      />
                      <span className="pp-radio-label">{opt.label}</span>
                      <span className="pp-radio-desc">{opt.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="pp-input-group">
                <label>Optional Add-ons</label>
                <div className="pp-addon-grid">
                  {[
                    { id: 'seo',         label: 'SEO Package',    price: '+$500' },
                    { id: 'copywriting', label: 'Copywriting',    price: '+$800' },
                    { id: 'branding',    label: 'Brand Identity', price: '+$1,200' },
                    { id: 'hosting',     label: '1 Year Hosting', price: '+$300' },
                  ].map(addon => (
                    <label
                      key={addon.id}
                      className={`pp-addon-card${estimatorValues.addOns.includes(addon.id) ? ' pp-addon-active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={estimatorValues.addOns.includes(addon.id)}
                        onChange={() => toggleAddOn(addon.id)}
                      />
                      <span className="pp-addon-label">{addon.label}</span>
                      <span className="pp-addon-price">{addon.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Result panel */}
            <div className="pp-result-panel">
              <div className="pp-result-label">Your Estimate</div>
              <div className="pp-result-price">
                <span className="pp-result-currency">$</span>
                <span className="pp-result-amount">{animatedPrice.toLocaleString()}</span>
              </div>
              <p className="pp-result-plan">
                Your project fits our <strong>{planNameMap[recommendedPlan]}</strong> plan perfectly
              </p>
              <p className="pp-result-note">
                Final pricing may vary based on specific requirements.
              </p>
              <Link to="/plan" className="pp-result-cta">
                <span>Get Exact Quote</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST STRIP
          ══════════════════════════════════════ */}
      <section id="pp-trust" data-pp-animate className={`pp-trust-section ${vis('pp-trust')}`}>
        <div className="pp-trust-container">
          {trustItems.map((item, i) => (
            <div key={i} className="pp-trust-card">
              <div className="pp-trust-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
          ══════════════════════════════════════ */}
      <section id="pp-faq" data-pp-animate className={`pp-faq-section ${vis('pp-faq')}`}>
        <div className="pp-faq-container">
          <div className="pp-faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know before deciding</p>
          </div>
          <div className="pp-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`pp-faq-item${openFaq === i ? ' pp-faq-open' : ''}`}>
                <button
                  className="pp-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={19} className={`pp-chevron${openFaq === i ? ' pp-chevron-open' : ''}`} />
                </button>
                <div className="pp-faq-a">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
};

export default PricingPage;
