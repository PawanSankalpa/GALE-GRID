import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useBooking } from "../context/BookingContext.jsx";
import {
  Clock, Shield, Smartphone, Pencil, CreditCard,
  Search, Star, TrendingUp, ChevronDown,
  ArrowRight, Phone, MessageCircle, Mail,
} from "lucide-react";
import "./styles/FAQ.css";

const CATS = [
  { id: "all",       label: "All" },
  { id: "timeline",  label: "Timeline" },
  { id: "ownership", label: "Ownership" },
  { id: "technical", label: "Technical" },
  { id: "pricing",   label: "Pricing" },
  { id: "results",   label: "Results" },
  { id: "support",   label: "Support" },
];

const faqs = [
  {
    num: "01",
    q: "How long does website development take?",
    preview: "Most businesses are live in 2–8 weeks — with a locked-in delivery date from day one.",
    a: "Typically 2–8 weeks. Simple brochure sites take 2–3 weeks; complex projects with custom functionality take 5–8 weeks. Before we start, you get an exact delivery date in writing — no vague timelines, no surprises.",
    icon: Clock, color: "#3B82F6", cat: "timeline", badge: "Fast turnaround",
  },
  {
    num: "02",
    q: "Who owns the completed website?",
    preview: "You own 100% — the domain, design, code, and every line of content. Zero vendor lock-in.",
    a: "You own 100% of everything — domain, design, and source code. We transfer full rights upon completion with zero hidden clauses or ongoing lock-in. Your website, forever.",
    icon: Shield, color: "#10B981", cat: "ownership", badge: "Zero lock-in",
  },
  {
    num: "03",
    q: "Is mobile optimisation included?",
    preview: "Yes — built mobile-first, tested on 12+ real devices. 60% of your visitors are on mobile.",
    a: "Always. Every website is architected mobile-first, then scaled up to desktop. We test across 12+ real devices before launch. Mobile is not an afterthought — it's where your customers actually are.",
    icon: Smartphone, color: "#8B5CF6", cat: "technical", badge: "Mobile-first",
  },
  {
    num: "04",
    q: "Can I edit the website myself after launch?",
    preview: "Yes — we set up a friendly CMS and train you. No coding knowledge required.",
    a: "Yes. We configure a user-friendly CMS so you can update text, swap images, and add new pages without touching code. A full training session is included so you're never dependent on us for routine updates.",
    icon: Pencil, color: "#F97316", cat: "technical", badge: "CMS included",
  },
  {
    num: "05",
    q: "What payment options do you offer?",
    preview: "Split into 3 milestones — 50% upfront, 25% at design approval, 25% at launch.",
    a: "We use a milestone-based payment schedule to keep risk low for both sides: 50% upfront to begin, 25% at design sign-off, 25% at launch. Custom schedules available for larger enterprise projects.",
    icon: CreditCard, color: "#F59E0B", cat: "pricing", badge: "Milestone payments",
  },
  {
    num: "06",
    q: "Do you include SEO?",
    preview: "Technical SEO is baked into every build — meta tags, schema, sitemap, and more.",
    a: "Yes — foundation SEO is standard on every project. This includes: meta titles/descriptions, Open Graph tags, schema markup, XML sitemap, clean URLs, fast load times, and Google Search Console setup. Advanced SEO growth packages are available separately.",
    icon: Search, color: "#6366F1", cat: "technical", badge: "SEO built-in",
  },
  {
    num: "07",
    q: "What results can I realistically expect?",
    preview: "Clients average 2\u00d7 more enquiries within 90 days, backed by a satisfaction guarantee.",
    a: "Across our portfolio, clients see a 2\u00d7 increase in enquiries within the first 90 days on average. Results depend on your industry and current traffic — but every project comes with a 30-day satisfaction guarantee. If you're not happy, we make it right.",
    icon: TrendingUp, color: "#06B6D4", cat: "results", badge: "Guaranteed",
  },
  {
    num: "08",
    q: "Do you offer ongoing support after launch?",
    preview: "1–6 months of post-launch support is included depending on your plan.",
    a: "All plans include at minimum 1 month of post-launch support for bug fixes and small updates. Professional plans get 3 months, Enterprise plans get 6 months. Monthly retainer packages are also available for ongoing improvements.",
    icon: Star, color: "#14B8A6", cat: "support", badge: "1–6 months included",
  },
];

/* ═══════════════════════════════════════════════════════════
   ANIMATED STAT ICON COMPONENTS — modern / data-viz style
═══════════════════════════════════════════════════════════ */

/** Circular progress ring — 4.9/5 rating → 98% arc */
function StatStars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const size = 44;
  const stroke = 3.2;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = 0.98; // 4.9/5
  return (
    <div ref={ref} className="faqn-stat-anim" aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        {/* Animated fill arc */}
        <motion.circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="#F59E0B" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - pct) } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Glow duplicate */}
        <motion.circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="#F59E0B" strokeWidth={stroke + 3}
          strokeLinecap="round" opacity={0.18}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - pct) } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

/** Stacked bar chart — 5 bars that grow up sequentially, purple palette */
function StatRocket() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const bars = [55, 72, 88, 68, 100];
  const maxH = 32;
  return (
    <div ref={ref} className="faqn-stat-anim" aria-hidden="true">
      <svg width="44" height="40" viewBox="0 0 44 40" style={{ overflow: "visible" }}>
        {bars.map((pct, i) => {
          const h = (pct / 100) * maxH;
          const x = 2 + i * 9;
          const w = 6;
          return (
            <g key={i}>
              {/* Track */}
              <rect x={x} y={40 - maxH} width={w} height={maxH}
                rx={3} fill="rgba(255,255,255,0.05)" />
              {/* Animated bar */}
              <motion.rect
                x={x} y={40 - h} width={w} rx={3}
                fill={i === 4 ? "#7C3AED" : `rgba(124,58,237,${0.4 + i * 0.12})`}
                initial={{ height: 0, y: 40 }}
                animate={inView ? { height: h, y: 40 - h } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Sparkline — a smooth path that draws itself left-to-right, sky blue */
function StatZap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // Points for an upward trend line (x, y) in a 48x32 viewport
  const pts = [[0,28],[8,24],[16,20],[22,22],[30,12],[38,8],[46,4]];
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  // Area fill path
  const area = `${d} L46,32 L0,32 Z`;
  return (
    <div ref={ref} className="faqn-stat-anim" aria-hidden="true">
      <svg width="48" height="34" viewBox="0 0 48 34" fill="none" className="faqn-stat-zap" style={{ overflow: "visible" }}>
        {/* Area fill */}
        <motion.path d={area} fill="#38BDF8" fillOpacity={0}
          animate={inView ? { fillOpacity: 0.1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        {/* Line */}
        <motion.path
          d={d} stroke="#38BDF8" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Dot on last point */}
        <motion.circle cx={46} cy={4} r={3} fill="#38BDF8"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.95, type: "spring", stiffness: 320, damping: 14 }}
        />
        {/* Ping on dot */}
        <motion.circle cx={46} cy={4} r={3} fill="none" stroke="#38BDF8"
          animate={inView ? { r: [3, 8], opacity: [0.6, 0] } : {}}
          transition={{ delay: 1.1, duration: 0.7, repeat: Infinity, repeatDelay: 2.2 }}
        />
      </svg>
    </div>
  );
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const Icon = faq.icon;
  const expanded = open || hovered;

  return (
    <motion.div
      className={`faqn-item${expanded ? " faqn-item--open" : ""}`}
      style={{ "--fc": faq.color }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ delay: index * 0.045, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className="faqn-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={expanded}
        aria-label={faq.q}
      >
        <span className="faqn-icon-wrap" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>

        <div className="faqn-content">
          <div className="faqn-top-row">
            <span className="faqn-badge">{faq.badge}</span>
            <motion.span
              className="faqn-chevron"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.24, ease: "easeInOut" }}
            >
              <ChevronDown size={15} strokeWidth={2.2} />
            </motion.span>
          </div>
          <span className="faqn-q">{faq.q}</span>
          <AnimatePresence initial={false}>
            {!expanded && (
              <motion.p
                className="faqn-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {faq.preview}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="faqn-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="faqn-answer-body">
              <p>{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [activeCat, setActiveCat] = useState("all");
  const { openBooking } = useBooking();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const bottomRef = useRef(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  const visible = activeCat === "all"
    ? faqs
    : faqs.filter((f) => f.cat === activeCat);

  return (
    <section className="faqn-section" aria-labelledby="faq-headline">
      <div className="faqn-container">

        <motion.div
          ref={headerRef}
          className="faqn-header"
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="faqn-eyebrow">FAQ</span>
          <h2 className="faqn-headline" id="faq-headline">
            Everything you want <em>to know</em>
          </h2>
          <p className="faqn-sub">
            Straight answers — no fluff. Click any question to expand the full answer.
          </p>
        </motion.div>

        <div className="faqn-cats" role="tablist" aria-label="Filter FAQ by topic">
          {CATS.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCat === cat.id}
              className={`faqn-cat-btn${activeCat === cat.id ? " faqn-cat-btn--active" : ""}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {activeCat === cat.id && (
                <motion.span
                  layoutId="faqn-pill"
                  className="faqn-cat-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="faqn-cat-label">{cat.label}</span>
            </button>
          ))}
        </div>

        <motion.div className="faqn-list" layout>
          <AnimatePresence mode="popLayout">
            {visible.map((faq, i) => (
              <FAQItem key={faq.num} faq={faq} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          ref={bottomRef}
          className="faqn-bottom"
          initial={{ opacity: 0, y: 40 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative orbs */}
          <span className="faqn-orb faqn-orb--a" aria-hidden="true" />
          <span className="faqn-orb faqn-orb--b" aria-hidden="true" />

          {/* Social proof row */}
          <motion.div
            className="faqn-proof"
            initial={{ opacity: 0, y: 10 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="faqn-avatars" aria-hidden="true">
              {["#F97316","#3B82F6","#10B981","#7C3AED","#F59E0B"].map((c, i) => (
                <span key={i} className="faqn-avatar" style={{ background: c, zIndex: 5 - i }} />
              ))}
            </div>
            <span className="faqn-proof-text">
              <strong>150+ businesses</strong> already growing with us
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h3
            className="faqn-bottom-headline"
            initial={{ opacity: 0, y: 14 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Still have a question?
          </motion.h3>

          <motion.p
            className="faqn-bottom-copy"
            initial={{ opacity: 0 }}
            animate={bottomInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.36, duration: 0.5 }}
          >
            We answer everything on a free&nbsp;20-minute call —
            no sales pressure, no obligation.
          </motion.p>

          {/* Contact channel cards */}
          <motion.div
            className="faqn-bottom-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.44, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              {
                href: "https://wa.me/94776868537",
                Icon: MessageCircle,
                label: "WhatsApp",
                sub: "Reply within the hour",
                color: "#F97316",
              },
              {
                href: "tel:+94776868537",
                Icon: Phone,
                label: "Call Us",
                sub: "+94 77 686 8537",
                color: "#7C3AED",
              },
              {
                href: "mailto:hello@galegrid.com",
                Icon: Mail,
                label: "Email",
                sub: "hello@galegrid.com",
                color: "#38BDF8",
              },
            ].map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                className="faqn-contact-card"
                style={{ "--cc": c.color }}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                animate={bottomInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.48 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                <span className="faqn-cc-icon">
                  <c.Icon size={18} strokeWidth={2} />
                </span>
                <span className="faqn-cc-text">
                  <span className="faqn-cc-label">{c.label}</span>
                  <span className="faqn-cc-sub">{c.sub}</span>
                </span>
                <ArrowRight size={13} strokeWidth={2.5} className="faqn-cc-arrow" />
              </motion.a>
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="faqn-stats"
            initial={{ opacity: 0 }}
            animate={bottomInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.54, duration: 0.5 }}
          >
          {[                
              { val: "4.9 / 5", lbl: "Google Rating",     StatComp: StatStars  },
              { val: "150+",    lbl: "Projects Delivered", StatComp: StatRocket },
              { val: "2\u20138 wks", lbl: "Avg. Delivery Time", StatComp: StatZap    },
            ].map((s, i) => (
              <div key={i} className="faqn-stat">
                <s.StatComp />
                <span className="faqn-stat-val">{s.val}</span>
                <span className="faqn-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
