import React, { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useBooking } from "../context/BookingContext.jsx";
import {
  Sparkles, Zap, Rocket, Crown, ArrowRight,
  Shield, Clock, TrendingUp, Users, Star,
  Check, X, MessageCircle, Headphones,
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
    icon: Zap,
    color: "#10B981",
    deliveryTime: "2–3 weeks",
    outcome: "Get online with instant credibility",
    features: [
      { text: "5 Custom Pages", included: true },
      { text: "Mobile-First Design", included: true },
      { text: "Basic SEO Setup", included: true },
      { text: "Contact Form", included: true },
      { text: "Analytics Setup", included: true },
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
    icon: Rocket,
    color: "#FF6B00",
    deliveryTime: "3–4 weeks",
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
    icon: Crown,
    color: "#8B5CF6",
    deliveryTime: "5–8 weeks",
    outcome: "Unlimited growth & automation",
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
    icon: Users,
    color: "#3B82F6",
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
    icon: Rocket,
    color: "#FF6B00",
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
    icon: Crown,
    color: "#8B5CF6",
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

const guarantees = [
  { icon: Shield, text: "Money-back guarantee" },
  { icon: Headphones, text: "24/7 support" },
  { icon: Clock, text: "On-time delivery" },
  { icon: MessageCircle, text: "Unlimited revisions" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

function PricingCard({ plan, index }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = plan.icon;
  const { openBooking } = useBooking();

  return (
    <motion.div
      ref={ref}
      className={`ps-card${plan.popular ? " ps-card--popular" : ""}`}
      style={{ "--pc": plan.color }}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 260, damping: 20 } }}
    >
      {plan.popular && (
        <div className="ps-popular-badge">
          <Star size={11} fill="currentColor" /> Best Value
        </div>
      )}

      <div className="ps-card-top">
        <div className="ps-icon">
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <div>
          <span className="ps-tagline">{plan.tagline}</span>
          <h3 className="ps-name">{plan.name}</h3>
        </div>
      </div>

      <div className="ps-price-block">
        <div className="ps-price-row">
          <span className="ps-currency">$</span>
          <span className="ps-amount">{plan.price}</span>
        </div>
        <div className="ps-price-meta">
          <span className="ps-original">${plan.originalPrice}</span>
          <span className="ps-period">{plan.period}</span>
        </div>
      </div>

      <div className="ps-outcome">
        <TrendingUp size={13} />
        <span>{plan.outcome}</span>
      </div>

      <ul className="ps-features">
        {plan.features.map((f, i) => (
          <li key={i} className={f.included ? "ps-f-yes" : "ps-f-no"}>
            {f.included
              ? <Check size={12} strokeWidth={3} />
              : <X size={10} strokeWidth={2.5} />}
            {f.text}
          </li>
        ))}
      </ul>

      {plan.deliveryTime && (
        <div className="ps-delivery">
          <Clock size={13} /> {plan.deliveryTime}
        </div>
      )}

      <button type="button" className={`ps-cta${plan.popular ? " ps-cta--primary" : ""}`} onClick={openBooking}>
        Get Started <ArrowRight size={15} />
      </button>
    </motion.div>
  );
}

export default function PricingSection() {
  const [mode, setMode] = useState("packages");
  const headerRef = React.useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const { openBooking } = useBooking();

  const activePlans = mode === "packages" ? plans : hireTeamOptions;

  return (
    <section className="ps-section">
      {/* Background orbs */}
      <div className="ps-bg" aria-hidden="true">
        <div className="ps-orb ps-orb-1" />
        <div className="ps-orb ps-orb-2" />
      </div>

      <div className="ps-container">
        {/* Header */}
        <motion.header
          ref={headerRef}
          className="ps-header"
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ps-eyebrow">
            <Sparkles size={13} strokeWidth={2} />
            <span>Simple Pricing</span>
          </div>
          <h2 className="ps-headline">
            Choose your <em>growth plan</em>
          </h2>
          <p className="ps-sub">No hidden fees. No surprises. Just results.</p>

          {/* Toggle */}
          <div className="ps-toggle">
            <button
              className={`ps-toggle-btn${mode === "packages" ? " active" : ""}`}
              onClick={() => setMode("packages")}
            >
              <Zap size={15} /> Complete a Project
            </button>
            <button
              className={`ps-toggle-btn${mode === "hire" ? " active" : ""}`}
              onClick={() => setMode("hire")}
            >
              <Users size={15} /> Hire Our Team
            </button>
          </div>
        </motion.header>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="ps-cards"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {activePlans.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Guarantees strip */}
        <motion.div
          className="ps-guarantees"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {guarantees.map((g, i) => (
            <div key={i} className="ps-guarantee">
              <g.icon size={15} />
              <span>{g.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="ps-bottom-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ps-cta-box">
            <div>
              <h3 className="ps-cta-title">Need something custom?</h3>
              <p className="ps-cta-copy">Let's discuss your requirements and build a tailored solution.</p>
            </div>
            <button type="button" className="ps-cta-btn" onClick={openBooking}>
              <MessageCircle size={17} /> Book Free Call <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
