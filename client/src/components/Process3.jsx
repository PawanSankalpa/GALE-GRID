import React from "react";
import { motion, useInView } from "framer-motion";
import { useBooking } from "../context/BookingContext.jsx";
import { ArrowUpRight, Sparkles, Palette, Code, Rocket } from "lucide-react";
import "./styles/Process3.css";

const steps = [
  {
    step: "01",
    label: "Discover",
    title: "Understand Your Business & Audience",
    description:
      "We deep-dive into your market, competitors, and customers to uncover exactly what your website needs to win — before writing a single line of code.",
    icon: Sparkles,
    color: "#3B82F6",
  },
  {
    step: "02",
    label: "Design",
    title: "Pixel-perfect design built to convert",
    description:
      "A custom UI designed to guide every visitor toward taking action — strategically structured, visually striking, and optimised for your brand.",
    icon: Palette,
    color: "#10B981",
  },
  {
    step: "03",
    label: "Build & Test",
    title: "Fast, secure, and tested across devices",
    description:
      "Clean code, 99/100 PageSpeed score, cross-browser tested. Your site will be the fastest thing your visitors have ever clicked.",
    icon: Code,
    color: "#FF6B00",
  },
  {
    step: "04",
    label: "Launch & Grow",
    title: "Go live and start getting customers",
    description:
      "Launch day isn't the end — it's the start. We monitor, optimise, and support your site so it keeps performing and ranking higher over time.",
    icon: Rocket,
    color: "#8B5CF6",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 56 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StepCard({ step, index }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;
  const { openBooking } = useBooking();

  return (
    <motion.div
      ref={ref}
      className="pc3-card"
      style={{ "--step-color": step.color }}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
    >
      {/* Ghost number watermark */}
      <span className="pc3-ghost-num" aria-hidden="true">{step.step}</span>

      {/* Icon ring */}
      <div className="pc3-icon-ring">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      {/* Step badge */}
      <div className="pc3-step-badge">
        <span className="pc3-step-num">{step.step}</span>
        <span className="pc3-step-label">{step.label}</span>
      </div>

      <h3 className="pc3-title">{step.title}</h3>
      <p className="pc3-desc">{step.description}</p>

      <button type="button" className="pc3-cta" onClick={openBooking}>
        Start this step <ArrowUpRight size={15} />
      </button>
    </motion.div>
  );
}

export default function Process3() {
  const headerRef = React.useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const { openBooking } = useBooking();

  return (
    <section className="pc3-section">
      {/* Header */}
      <motion.div
        ref={headerRef}
        className="pc3-header"
        initial={{ opacity: 0, y: 32 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="pc3-eyebrow">Our Process</span>
        <h2 className="pc3-headline">
          How we build websites that <em>actually work</em>
        </h2>
        <p className="pc3-sub">
          A proven four-step process that's delivered results for every single client — on time, on budget.
        </p>
      </motion.div>

      {/* SVG connector line — desktop only */}
      <div className="pc3-track-wrap" aria-hidden="true">
        <svg className="pc3-track-svg" viewBox="0 0 900 12" preserveAspectRatio="none">
          <motion.path
            d="M 40 6 Q 225 6 225 6 T 450 6 T 675 6 T 860 6"
            stroke="url(#trackGrad)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 6"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="33%" stopColor="#10B981" />
              <stop offset="66%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cards grid */}
      <div className="pc3-grid">
        {steps.map((step, i) => (
          <StepCard key={step.step} step={step} index={i} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="pc3-bottom"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="pc3-bottom-copy">
          Typically delivered in <strong>2–8 weeks</strong>. No hidden fees. No surprises.
        </p>
        <button type="button" className="pc3-bottom-btn" onClick={openBooking}>
          Start Your Project <ArrowUpRight size={18} />
        </button>
      </motion.div>
    </section>
  );
}
