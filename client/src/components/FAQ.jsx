import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useBooking } from "../context/BookingContext.jsx";
import {
  Clock, Shield, Smartphone, Pencil, CreditCard,
  Search, Star, TrendingUp, ChevronDown,
  ArrowRight, Phone,
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
    icon: Pencil, color: "#EC4899", cat: "technical", badge: "CMS included",
  },
  {
    num: "05",
    q: "What payment options do you offer?",
    preview: "Split into 3 milestones — 50% upfront, 25% at design approval, 25% at launch.",
    a: "We use a milestone-based payment schedule to keep risk low for both sides: 50% upfront to begin, 25% at design sign-off, 25% at launch. Custom schedules available for larger enterprise projects.",
    icon: CreditCard, color: "#FF6B00", cat: "pricing", badge: "Milestone payments",
  },
  {
    num: "06",
    q: "Do you include SEO?",
    preview: "Technical SEO is baked into every build — meta tags, schema, sitemap, and more.",
    a: "Yes — foundation SEO is standard on every project. This includes: meta titles/descriptions, Open Graph tags, schema markup, XML sitemap, clean URLs, fast load times, and Google Search Console setup. Advanced SEO growth packages are available separately.",
    icon: Search, color: "#F59E0B", cat: "technical", badge: "SEO built-in",
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
    icon: Star, color: "#84CC16", cat: "support", badge: "1–6 months included",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={"faqn-item" + (open ? " faqn-item--open" : "") + (hovered ? " faqn-item--hovered" : "")}
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
        aria-expanded={open}
        aria-label={faq.q}
      >
        <div className="faqn-num-col">
          <span className="faqn-num">{faq.num}</span>
          <span className="faqn-cat-tag">{faq.cat}</span>
        </div>
        <div className="faqn-trigger-row">
          <span className="faqn-q">{faq.q}</span>
          <motion.span
            className="faqn-chevron"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
          >
            <ChevronDown size={16} strokeWidth={2.2} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
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
          initial={{ opacity: 0, y: 32 }}
          animate={bottomInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="faqn-stats">
            {[
              { val: "4.9/5",   lbl: "Google Rating",     color: "#FBBF24" },
              { val: "150+",    lbl: "Projects Delivered", color: "#10B981" },
              { val: "2–8 wks", lbl: "Avg. Delivery",      color: "#3B82F6" },
            ].map((s, i) => (
              <div key={i} className="faqn-stat" style={{ "--sc": s.color }}>
                <span className="faqn-stat-val">{s.val}</span>
                <span className="faqn-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          <div className="faqn-bottom-right">
            <p className="faqn-bottom-title">Still have a question?</p>
            <p className="faqn-bottom-copy">
              We answer everything on a free 20-minute call — no sales pressure, no obligation.
            </p>
            <div className="faqn-bottom-actions">
              <button type="button" className="faqn-cta-btn" onClick={openBooking}>
                Book Free Call
                <ArrowRight size={17} />
              </button>
              <a href="tel:+44000000000" className="faqn-cta-secondary">
                <Phone size={16} />
                Call Us Now
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
