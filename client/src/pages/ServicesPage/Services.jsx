/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./Services.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import CTA from "../../components/CTA";
import { useBooking } from "../../context/BookingContext.jsx";
import { motion, useInView } from "framer-motion";
import {
  Globe, Workflow, Hotel, CalendarCheck, Users, LayoutDashboard,
  Check, X, CheckCircle2, ArrowUpRight, TrendingUp,
  Clock, Star, Zap,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */

const statsHighlights = [
  { num: "10+",   label: "Projects Delivered"  },
  { num: "+340%", label: "Avg. Lead Increase"  },
  { num: "1.8s",  label: "Avg. Load Time"      },
];

const costStats = [
  { num: "88%", fact: "of users won't return after a bad website experience",         icon: <X size={22} />     },
  { num: "7%",  fact: "conversion drop for every 1-second page load delay",           icon: <Clock size={22} /> },
  { num: "75%", fact: "of people judge business credibility by website design",       icon: <Star size={22} />  },
  { num: "53%", fact: "of visitors abandon a site that takes over 3 seconds to load", icon: <Zap size={22} />   },
];

const coreServices = [
  {
    id: "web-design", navLabel: "Website Design",
    icon: <Globe size={26} />, title: "Custom Website Design",
    outcome: "Turn visitors into paying customers 24/7",
    problem: "A slow, outdated, or confusing website drives customers straight to your competitors — every single day.",
    features: [
      "Custom design & branding tailored to your business",
      "Mobile-first responsive across every device",
      "SEO-optimised from day one — found on Google",
      "Loads under 2 seconds — no excuses",
      "Conversion-focused layout and CTAs",
      "SSL secure, fast hosting & ongoing support",
    ],
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    proofStat: "Websites we build load in under 1.8 seconds on average",
    reverse: false, featured: true,
  },
  {
    id: "automation", navLabel: "Automation",
    icon: <Workflow size={26} />, title: "Business Automation",
    outcome: "Eliminate manual work that's draining your team",
    problem: "Data entry, follow-up emails, and repetitive tasks eat hours your team could spend closing deals or serving customers.",
    features: [
      "Workflow automation — set it, forget it",
      "Automated reporting delivered on schedule",
      "Data sync across every tool you use",
      "Reduced human error in critical processes",
      "Time-triggered actions without manual input",
      "Third-party integrations with your existing stack",
    ],
    color: "#FF6B00",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    proofStat: "Automation clients reclaim an average of 14 hours per week",
    reverse: true, featured: false,
  },
  {
    id: "hotel", navLabel: "Hotel Systems",
    icon: <Hotel size={26} />, title: "Hotel Management Systems",
    outcome: "Run your property without the chaos",
    problem: "Managing rooms, guests, and staff across disconnected spreadsheets creates costly errors and frustrated guests every day.",
    features: [
      "One unified dashboard for your entire property",
      "Room & inventory always accurate in real time",
      "Guest profiles with full history & preferences",
      "Staff scheduling handled automatically",
      "Revenue analytics and performance reports",
      "Housekeeping coordination built in",
    ],
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    proofStat: "Hotel owners using our system reclaim 12+ hours per week",
    reverse: false, featured: false,
  },
  {
    id: "booking", navLabel: "Booking Systems",
    icon: <CalendarCheck size={26} />, title: "Booking & Reservation Systems",
    outcome: "Let customers book while you sleep",
    problem: "Phone-based bookings cause double-bookings, missed reservations, and frustrated customers who simply go elsewhere.",
    features: [
      "Customers book 24/7 without calling you",
      "Real-time availability — zero confusion",
      "Automated confirmation emails & reminders",
      "Payment collection at the point of booking",
      "Calendar sync with your existing tools",
      "Cancellations & rescheduling handled automatically",
    ],
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80",
    proofStat: "40%+ more reservation completions vs. phone-only systems",
    reverse: true, featured: false,
  },
  {
    id: "crm", navLabel: "CRM",
    icon: <Users size={26} />, title: "CRM & Customer Management",
    outcome: "Stop letting leads fall through the cracks",
    problem: "Customer data scattered across inboxes and sticky notes means missed follow-ups, lost leads, and repeat business walking out the door.",
    features: [
      "Centralised customer data — no more searching",
      "Automated follow-up sequences that convert",
      "Pipeline management from lead to close",
      "Performance tracking and reporting",
      "Lead scoring so you focus on the right people",
      "Full activity history for every customer",
    ],
    color: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    proofStat: "CRM clients see 60%+ fewer missed follow-ups within 30 days",
    reverse: false, featured: false,
  },
  {
    id: "dashboards", navLabel: "Dashboards",
    icon: <LayoutDashboard size={26} />, title: "Admin Dashboards & Reporting",
    outcome: "See your entire business at a glance",
    problem: "Without real-time visibility into your operations, every decision is guesswork — and guesswork is expensive.",
    features: [
      "Real-time analytics for every key metric",
      "Role-based access so the right people see the right data",
      "Custom KPI dashboards built around your goals",
      "Beautiful data visualisation — clear, not complicated",
      "Export & sharing in one click",
      "Fully mobile-accessible — check in from anywhere",
    ],
    color: "#FF6B00",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    proofStat: "Decision time cuts in half when teams have real-time dashboards",
    reverse: true, featured: false,
  },
];

const compareItems = [
  { without: "Slow website losing visitors on page load",    withUs: "Fast website that loads in under 2 seconds"           },
  { without: "No online booking — customers go elsewhere",   withUs: "24/7 automated bookings with zero friction"           },
  { without: "Manual tasks eating your team's time",         withUs: "Automated workflows that run without you"             },
  { without: "No visibility into your business performance", withUs: "Real-time dashboards with every metric you need"      },
  { without: "Outdated design hurting brand credibility",    withUs: "Modern, conversion-focused design that builds trust"  },
  { without: "Invisible to Google — missing organic traffic",withUs: "SEO built in — found by people ready to buy"          },
  { without: "No support when something breaks",             withUs: "Dedicated support so you're never left stranded"      },
];

/* ── Framer Motion variants ──────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const slideLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};
const cardFloat = (delay = 0, rot = 0) => ({
  animate: {
    y: [0, -10, 0],
    rotate: [rot, rot + 1.5, rot],
    transition: { duration: 3.5 + delay * 0.6, repeat: Infinity, ease: "easeInOut", delay },
  },
});

/* ── CSS Product Visuals ─────────────────────────────────────────── */
function BrowserMockup() {
  return (
    <div className="srv-mockup srv-mockup-browser">
      <div className="srv-mock-browser-bar">
        <span className="srv-mock-dot" style={{ background: "#ef4444" }} />
        <span className="srv-mock-dot" style={{ background: "#f59e0b" }} />
        <span className="srv-mock-dot" style={{ background: "#22c55e" }} />
        <div className="srv-mock-url-bar">galegrid.com</div>
      </div>
      <div className="srv-mock-browser-body">
        <div className="srv-mock-nav" />
        <div className="srv-mock-hero">
          <div className="srv-mock-hero-text" />
          <div className="srv-mock-hero-text srv-mock-sub" />
          <div className="srv-mock-btn" />
        </div>
        <div className="srv-mock-cards">
          {[0, 1, 2].map((i) => <div key={i} className="srv-mock-card" style={{ animationDelay: `${i * 0.3}s` }} />)}
        </div>
      </div>
    </div>
  );
}

function AutomationMockup() {
  return (
    <div className="srv-mockup srv-mockup-automation">
      {[
        { label: "Trigger", icon: "⚡", color: "#3B82F6", top: "8%",  left: "6%"  },
        { label: "Filter",  icon: "⚙", color: "#FF6B00", top: "42%", left: "36%" },
        { label: "Email",   icon: "✉", color: "#10B981", top: "8%",  left: "66%" },
        { label: "CRM",     icon: "👤", color: "#8B5CF6", top: "74%", left: "66%" },
      ].map((n, i) => (
        <motion.div
          key={i}
          className="srv-auto-node"
          style={{ top: n.top, left: n.left, borderColor: n.color, color: n.color }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
          viewport={{ once: true }}
        >
          <span className="srv-auto-node-icon">{n.icon}</span>
          <span className="srv-auto-node-label">{n.label}</span>
        </motion.div>
      ))}
      <svg className="srv-auto-svg" viewBox="0 0 340 240">
        {[
          "M 60 32 C 120 32 100 110 145 110",
          "M 145 110 C 200 110 215 32 246 32",
          "M 145 110 C 200 130 215 194 246 194",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={["#3B82F6","#FF6B00","#10B981"][i]}
            strokeWidth="2"
            strokeDasharray="5 4"
            fill="none"
            opacity="0.6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: i * 0.3 }}
            viewport={{ once: true }}
          />
        ))}
      </svg>
    </div>
  );
}

function CalendarMockup() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const selected = [12, 13, 14];
  return (
    <div className="srv-mockup srv-mockup-calendar">
      <div className="srv-cal-header">
        <span className="srv-cal-month">April 2026</span>
        <div className="srv-cal-nav"><span>‹</span><span>›</span></div>
      </div>
      <div className="srv-cal-weekdays">
        {["M","T","W","T","F","S","S"].map((d,i) => <span key={i}>{d}</span>)}
      </div>
      <div className="srv-cal-grid">
        {days.map((d) => (
          <motion.div
            key={d}
            className={`srv-cal-day${selected.includes(d) ? " srv-cal-selected" : ""}${d === 12 ? " srv-cal-start" : ""}${d === 14 ? " srv-cal-end" : ""}`}
            whileHover={{ scale: 1.15 }}
          >
            {d}
          </motion.div>
        ))}
      </div>
      <div className="srv-cal-footer">✓ Booking confirmed — 3 nights</div>
    </div>
  );
}

function HotelMockup() {
  return (
    <div className="srv-mockup srv-mockup-hotel">
      <div className="srv-hotel-header">
        <span className="srv-hotel-name">The Grand View</span>
        <span className="srv-hotel-rating">★ 4.9</span>
      </div>
      {[
        { room: "Deluxe Suite", status: "occupied", guest: "J. Smith",    pct: 85 },
        { room: "Ocean View",   status: "available",guest: "—",           pct: 0  },
        { room: "Penthouse",    status: "occupied", guest: "M. Johnson",  pct: 95 },
        { room: "Garden Room",  status: "cleaning", guest: "—",           pct: 40 },
      ].map((r, i) => (
        <motion.div
          key={i}
          className="srv-hotel-row"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="srv-hotel-row-left">
            <span className="srv-hotel-room">{r.room}</span>
            <span className={`srv-hotel-status srv-hotel-${r.status}`}>{r.status}</span>
          </div>
          <div className="srv-hotel-bar-wrap">
            <motion.div
              className="srv-hotel-bar"
              initial={{ width: 0 }}
              whileInView={{ width: `${r.pct}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      ))}
      <div className="srv-hotel-metrics">
        <div><span className="srv-hotel-met-num">87%</span><span className="srv-hotel-met-lbl">Occupancy</span></div>
        <div><span className="srv-hotel-met-num">$312</span><span className="srv-hotel-met-lbl">Avg/Night</span></div>
        <div><span className="srv-hotel-met-num">24</span><span className="srv-hotel-met-lbl">Check-ins Today</span></div>
      </div>
    </div>
  );
}

function CRMMockup() {
  const leads = [
    { name: "Ava Torres",   stage: "Proposal",   val: "$4,200", color: "#FF6B00" },
    { name: "Ben Walsh",    stage: "Qualified",  val: "$1,800", color: "#3B82F6" },
    { name: "Cara Singh",   stage: "Closed ✓",   val: "$6,500", color: "#10B981" },
    { name: "David Kim",    stage: "New Lead",   val: "$950",   color: "#8B5CF6" },
  ];
  return (
    <div className="srv-mockup srv-mockup-crm">
      <div className="srv-crm-header">
        <span>Pipeline</span>
        <span className="srv-crm-total">Total: $13,450</span>
      </div>
      {leads.map((l, i) => (
        <motion.div
          key={i}
          className="srv-crm-row"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="srv-crm-avatar" style={{ background: l.color }}>{l.name[0]}</div>
          <div className="srv-crm-info">
            <span className="srv-crm-name">{l.name}</span>
            <span className="srv-crm-stage" style={{ color: l.color }}>{l.stage}</span>
          </div>
          <span className="srv-crm-val">{l.val}</span>
        </motion.div>
      ))}
    </div>
  );
}

function DashboardMockup() {
  const bars = [62, 88, 45, 97, 71, 55, 84];
  const days = ["M","T","W","T","F","S","S"];
  return (
    <div className="srv-mockup srv-mockup-dashboard">
      <div className="srv-dash-header">
        <span>Weekly Revenue</span>
        <span className="srv-dash-badge">+23%</span>
      </div>
      <div className="srv-dash-chart">
        {bars.map((h, i) => (
          <div key={i} className="srv-dash-bar-col">
            <motion.div
              className="srv-dash-bar"
              style={{ "--bar-color": h === 97 ? "#FF6B00" : "#3B82F6" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              viewport={{ once: true }}
              custom={h}
            >
              <div className="srv-dash-bar-inner" style={{ height: `${h}%` }} />
            </motion.div>
            <span className="srv-dash-day">{days[i]}</span>
          </div>
        ))}
      </div>
      <div className="srv-dash-metrics">
        {[
          { label: "Revenue", val: "$48.2k", up: true  },
          { label: "Orders",  val: "1,284",  up: true  },
          { label: "Refunds", val: "3.1%",   up: false },
        ].map((m, i) => (
          <div key={i} className="srv-dash-metric">
            <span className="srv-dash-met-val">{m.val}</span>
            <span className={`srv-dash-met-lbl${m.up ? "" : " srv-dash-down"}`}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const serviceVisuals = {
  "web-design":  <BrowserMockup />,
  "automation":  <AutomationMockup />,
  "hotel":       <HotelMockup />,
  "booking":     <CalendarMockup />,
  "crm":         <CRMMockup />,
  "dashboards":  <DashboardMockup />,
};

/* ── Service Chapter ─────────────────────────────────────────────── */
function ServiceChapter({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isReverse = index % 2 !== 0;
  const { openBooking } = useBooking();

  return (
    <section id={service.id} ref={ref} className={`srv-chapter${isReverse ? " srv-chapter-reverse" : ""}`}>
      <div className="srv-chapter-inner">
        {/* Text side */}
        <div className="srv-chapter-text">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.p
              className="srv-chapter-num"
              variants={fadeUp}
              custom={0}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.p>
            <motion.p
              className="srv-chapter-tag"
              style={{ color: service.color }}
              variants={fadeUp}
              custom={1}
            >
              {service.navLabel}
            </motion.p>
            <motion.h2 className="srv-chapter-title" variants={fadeUp} custom={2}>
              {service.title}
            </motion.h2>
            <motion.p className="srv-chapter-outcome" variants={fadeUp} custom={3}>
              {service.outcome}
            </motion.p>
            <motion.p className="srv-chapter-problem" variants={fadeUp} custom={4}>
              {service.problem}
            </motion.p>

            <ul className="srv-chapter-features">
              {service.features.map((f, i) => (
                <motion.li
                  key={i}
                  variants={slideLeft}
                  custom={i}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <span className="srv-chapter-check" style={{ background: `${service.color}18`, color: service.color }}>
                    <Check size={13} />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>

            <motion.div className="srv-chapter-footer" variants={fadeUp} custom={6}>
              <p className="srv-chapter-proof">
                <TrendingUp size={13} /> {service.proofStat}
              </p>
              <button type="button" className="srv-chapter-cta" style={{ "--cta-color": service.color }} onClick={openBooking}>
                Start this project <ArrowUpRight size={15} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Visual side */}
        <motion.div
          className="srv-chapter-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="srv-chapter-visual-glow" style={{ background: service.color }} />
          {serviceVisuals[service.id]}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Sticky Sidebar Nav ──────────────────────────────────────────── */
function StickyNav({ active }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };
  return (
    <nav className="srv-sidebar-nav">
      {coreServices.map((s) => (
        <button
          key={s.id}
          className={`srv-sidebar-btn${active === s.id ? " srv-sidebar-active" : ""}`}
          style={{ "--svc-color": s.color }}
          onClick={() => scrollTo(s.id)}
          title={s.navLabel}
        >
          <span className="srv-sidebar-icon">{s.icon}</span>
          <span className="srv-sidebar-label">{s.navLabel}</span>
        </button>
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
function Services() {
  const [activeService, setActiveService] = useState("web-design");
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const { openBooking } = useBooking();

  /* ── active service observer ──────────────────────────────────── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveService(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    coreServices.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="srv-page">
      <NavBar />

      {/* ── 1. EDITORIAL OPENER ──────────────────────────────────── */}
      <section className="srv-editorial">
        <div className="srv-editorial-inner">

          {/* Left: headline + pills + CTA */}
          <div className="srv-editorial-left">
            <motion.p
              className="srv-editorial-eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Web Agency Services
            </motion.p>
            <motion.h1
              className="srv-editorial-headline"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Six ways we grow your business.
            </motion.h1>
            <motion.p
              className="srv-editorial-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Custom websites, booking systems, hotel tools, CRMs, automation, and dashboards — built from scratch for your business.
            </motion.p>

            <motion.div
              className="srv-editorial-pills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {coreServices.map((s) => (
                <button
                  key={s.id}
                  className="srv-editorial-pill"
                  style={{ "--svc-color": s.color }}
                  onClick={() => scrollTo(s.id)}
                >
                  <span style={{ color: s.color }}>{s.icon}</span>
                  {s.navLabel}
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
            >
              <button type="button" className="srv-editorial-cta" onClick={openBooking}>
                Book a Free Consultation <ArrowUpRight size={16} />
              </button>
            </motion.div>
          </div>

          {/* Right: floating service cards */}
          <div className="srv-editorial-cards" aria-hidden="true">
            {coreServices.map((s, i) => {
              const rotations = [-4, 3, -2, 5, -3, 2];
              const fm = cardFloat(i * 0.4, rotations[i]);
              return (
                <motion.div
                  key={s.id}
                  className="srv-editorial-card"
                  style={{ "--svc-color": s.color }}
                  initial={{ opacity: 0, scale: 0.88, rotate: rotations[i] }}
                  animate={{ opacity: 1, scale: 1, rotate: rotations[i], ...fm.animate }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.07 }}
                >
                  <span className="srv-editorial-card-icon" style={{ color: s.color, background: `${s.color}15` }}>
                    {s.icon}
                  </span>
                  <div>
                    <p className="srv-editorial-card-title">{s.navLabel}</p>
                    <p className="srv-editorial-card-out">{s.outcome}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM CONTEXT STRIP ─────────────────────────────── */}
      <section className="srv-problem-strip">
        <div className="srv-section-inner">
          <motion.p
            className="srv-problem-lead"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            Why it matters
          </motion.p>
          <div className="srv-problem-grid">
            {costStats.map((c, i) => (
              <motion.div
                key={i}
                className="srv-problem-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
              >
                <div className="srv-problem-icon">{c.icon}</div>
                <div className="srv-problem-num">{c.num}</div>
                <div className="srv-problem-fact">{c.fact}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY SIDEBAR + SERVICE CHAPTERS ─────────────────────── */}
      <div className="srv-chapters-wrap">
        <StickyNav active={activeService} />
        <div className="srv-chapters-main">
          {coreServices.map((s, i) => (
            <ServiceChapter key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>

      {/* ── 3. STATS DARK BAND ───────────────────────────────────── */}
      <section className="srv-stats-band" ref={statsRef}>
        <div className="srv-section-inner">
          <motion.p
            className="srv-stats-label"
            initial={{ opacity: 0 }}
            animate={statsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            The results speak for themselves
          </motion.p>
          <div className="srv-stats-row">
            {statsHighlights.map((s, i) => (
              <motion.div
                key={i}
                className="srv-stat-block"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <span className="srv-stat-num">{s.num}</span>
                <span className="srv-stat-lbl">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. COMPARISON ────────────────────────────────────────── */}
      <section className="srv-compare-section">
        <div className="srv-section-inner">
          <motion.div
            className="srv-compare-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="srv-section-eyebrow">With GaleGrid vs. Without</p>
            <h2 className="srv-section-title">The difference is not subtle</h2>
          </motion.div>

          <div className="srv-compare-columns">
            <motion.div
              className="srv-compare-col srv-compare-without"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div className="srv-compare-col-header">
                <X size={18} /> Without a proper system
              </div>
              {compareItems.map((c, i) => (
                <div className="srv-compare-item" key={i}>
                  <span className="srv-compare-icon"><X size={14} /></span>
                  {c.without}
                </div>
              ))}
            </motion.div>

            <motion.div
              className="srv-compare-col srv-compare-with"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="srv-compare-col-header">
                <CheckCircle2 size={18} /> With GaleGrid
              </div>
              {compareItems.map((c, i) => (
                <div className="srv-compare-item" key={i}>
                  <span className="srv-compare-icon"><Check size={14} /></span>
                  {c.withUs}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="srv-compare-footer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button type="button" className="srv-btn-primary" onClick={openBooking}>
              Book Your Free Consultation <ArrowUpRight size={15} />
            </button>
            <p className="srv-compare-hint">Website design from <strong>$749</strong> — fixed price, no surprises.</p>
          </motion.div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}

export default Services;
