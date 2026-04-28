import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, Zap, Search } from "lucide-react";
import statsPic1 from "../assets/statsPics/sumup-xzoH6RjQS3E-unsplash.jpg";
import statsPic2 from "../assets/statsPics/zac-wolff-q5tQtPZ7j2k-unsplash.jpg";
import statsPic3 from "../assets/statsPics/daniel-korpai-pKRNxEguRgM-unsplash.jpg";
import "./styles/WhyUs.css";

const steps = [
  {
    number: "01",
    title: "Beat Your Competitors",
    metric: "+2x",
    metricLabel: "avg. inquiry increase",
    desc: "We build websites engineered to convert. On average, businesses we've built for see more than double the inquiries within 3 months of going live.",
    img: statsPic1,
    color: "#FF8C00",
    icon: TrendingUp,
    cta: "See our results",
    ctaTo: "/ourWork",
    bullets: [
      "2× more leads within 90 days",
      "Conversion audit before every build",
      "A/B tested CTAs per industry",
    ],
  },
  {
    number: "02",
    title: "Fast, Smooth & Easy",
    metric: "99/100",
    metricLabel: "PageSpeed score",
    desc: "We obsess over performance. Our sites load in under 2 seconds, score 99+ on PageSpeed, and work flawlessly on every device.",
    img: statsPic2,
    color: "#3B82F6",
    icon: Zap,
    cta: "Explore our process",
    ctaTo: "/services",
    bullets: [
      "Sub 2s load time guaranteed",
      "99/100 PageSpeed score, verified",
      "Tested on 12+ real devices",
    ],
  },
  {
    number: "03",
    title: "Rank Higher on Google",
    metric: "Page 1",
    metricLabel: "Google ranking",
    desc: "Every website we build is SEO-optimised from the ground up — structured data, fast loading, semantic HTML — so Google finds and ranks you.",
    img: statsPic3,
    color: "#10B981",
    icon: Search,
    cta: "Get a free SEO review",
    ctaTo: "/contact",
    bullets: [
      "Technical SEO baked in from day 1",
      "Semantic HTML + structured data",
      "Search Console setup included",
    ],
  },
];

const bulletVariants = {
  hide: { opacity: 0, x: -14 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 130, damping: 18, delay: i * 0.07 },
  }),
};

export default function WhyUs() {
  const [activeTab, setActiveTab] = useState(0);
  const step = steps[activeTab];
  const Icon = step.icon;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section className="why-section" aria-labelledby="why-headline">

      {/* Section header */}
      <motion.div
        className="why-header"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <span className="why-eyebrow">Why Choose Us</span>
        <h2 className="why-headline" id="why-headline">
          We build websites that <em>actually work</em>
        </h2>
        <p className="why-sub">
          Not just pretty — engineered to convert, rank, and load fast from day one.
        </p>
      </motion.div>

      {/* Tab navigation */}
      <div className="why-tabs" role="tablist" aria-label="Why choose us features">
        {steps.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeTab === i}
            aria-controls="why-pane"
            className={`why-tab${activeTab === i ? " is-active" : ""}`}
            onClick={() => setActiveTab(i)}
            style={{ "--tab-color": s.color }}
          >
            <span className="wt-num">{s.number}</span>
            <span className="wt-label">{s.title}</span>
            {activeTab === i && (
              <motion.span
                className="wt-underline"
                layoutId="why-tab-bar"
                style={{ background: s.color }}
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content pane */}
      <div className="why-body" id="why-pane" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="why-pane"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.18 } }}
          >

            {/* LEFT col */}
            <div className="wp-left">
              <div className="wp-stat-card" style={{ "--ac": step.color }}>
                <div className="wp-stat-icon" style={{ color: step.color }}>
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className="wp-stat-num" style={{ color: step.color }}>
                  {step.metric}
                </div>
                <div className="wp-stat-meta">
                  <span className="wp-stat-label">{step.metricLabel}</span>
                  <span className="wp-stat-context">vs. industry average</span>
                </div>
              </div>

              <h3 className="wp-title">{step.title}</h3>
              <p className="wp-desc">{step.desc}</p>

              <ul className="wp-bullets">
                {step.bullets.map((b, i) => (
                  <motion.li
                    key={`${activeTab}-${i}`}
                    custom={i}
                    variants={bulletVariants}
                    initial="hide"
                    animate="show"
                    style={{ "--ac": step.color }}
                  >
                    {b}
                  </motion.li>
                ))}
              </ul>

              <Link to={step.ctaTo} className="wp-cta" style={{ "--ac": step.color }}>
                <span>{step.cta}</span>
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            {/* RIGHT col — tilt photo */}
            <motion.div
              className="wp-photo-tilt"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
              <div className="wp-photo-wrap">
                <img src={step.img} alt={step.title} loading="lazy" decoding="async" />
                <div className="wp-step-bg-num">{step.number}</div>
                <div className="wp-float-badge" style={{ "--ac": step.color }}>
                  <span className="wfb-num" style={{ color: step.color }}>{step.metric}</span>
                  <span className="wfb-label">{step.metricLabel}</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
