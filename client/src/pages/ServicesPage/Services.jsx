import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Services.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import CTA from "../../components/CTA";
import {
  Code2, Database, Shield, ArrowUpRight, ArrowRight, Check,
  BarChart3, RefreshCw, MessageCircle, Mail, Phone,
  Sparkles, Globe, Palette, Hotel, CalendarCheck,
  Users, BellRing, LayoutDashboard, Cpu, Workflow,
  TrendingUp, Search, Rocket, Headphones, CheckCircle2,
  Building2, Briefcase, ClipboardList
} from "lucide-react";

/* ─── SERVICE DATA ─── */
const coreServices = [
  {
    id: "web-dev",
    icon: <Globe size={28} />,
    title: "Website & Web Application Development",
    problem: "Your business needs a strong online presence that works around the clock — not a brochure that sits idle.",
    solution: "We build fast, responsive websites and web applications tailored to your operations, designed to convert visitors into customers.",
    features: ["Custom design & development", "Mobile-first responsive layouts", "SEO-optimized from day one", "Fast loading under 2 seconds"],
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "automation",
    icon: <Workflow size={28} />,
    title: "Business Automation Systems",
    problem: "Manual tasks are eating your team's time — data entry, follow-ups, reporting, and repetitive workflows slow everything down.",
    solution: "We automate your core business processes so your team can focus on what matters: serving customers and growing revenue.",
    features: ["Workflow automation", "Data sync across systems", "Automated reporting", "Reduced human error"],
    color: "#FF6B00",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "hotel",
    icon: <Hotel size={28} />,
    title: "Hotel Management Systems",
    problem: "Managing rooms, guests, staff, and operations across spreadsheets and disconnected tools creates chaos.",
    solution: "We build unified hotel management platforms — from front desk to housekeeping — that keep everything running smoothly.",
    features: ["Room & inventory management", "Guest profiles & history", "Staff scheduling", "Revenue analytics"],
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "booking",
    icon: <CalendarCheck size={28} />,
    title: "Booking & Reservation Systems",
    problem: "Phone-based bookings lead to double bookings, missed reservations, and frustrated customers.",
    solution: "We build online booking systems that let customers reserve 24/7, with real-time availability and instant confirmation.",
    features: ["Real-time availability", "Automated confirmations", "Payment integration", "Calendar sync"],
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "crm",
    icon: <Users size={28} />,
    title: "Customer Relationship Management",
    problem: "Customer data scattered across inboxes, spreadsheets, and sticky notes means you're losing leads and repeat business.",
    solution: "We build CRM systems that centralize every customer interaction, automate follow-ups, and help you close more deals.",
    features: ["Centralized customer data", "Automated follow-ups", "Pipeline management", "Performance tracking"],
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "notifications",
    icon: <BellRing size={28} />,
    title: "Automated Emails & Notifications",
    problem: "Manual emails and phone calls for confirmations, reminders, and cancellations waste hours every day.",
    solution: "We set up intelligent notification systems that handle communications automatically — emails, SMS, and in-app alerts.",
    features: ["Booking confirmations", "Reminder sequences", "Cancellation handling", "Custom templates"],
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "dashboards",
    icon: <LayoutDashboard size={28} />,
    title: "Custom Admin Dashboards",
    problem: "Without clear visibility into your operations, decisions are based on guesswork instead of data.",
    solution: "We build intuitive admin dashboards and internal tools that give you real-time insights into every part of your business.",
    features: ["Real-time analytics", "Role-based access", "Custom reporting", "Data visualization"],
    color: "#FF6B00",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  }
];

/* ─── SYSTEMS THINKING DATA ─── */
const systemsThinking = [
  { icon: <Search size={22} />, title: "End-to-End Analysis", desc: "Every business workflow is mapped and understood before we write a single line of code." },
  { icon: <Workflow size={22} />, title: "Automation First", desc: "Manual work is identified and replaced with reliable automated processes." },
  { icon: <TrendingUp size={22} />, title: "Built to Scale", desc: "Systems are designed to grow with your business — from 10 customers to 10,000." },
  { icon: <Shield size={22} />, title: "Reliable & Secure", desc: "Enterprise-level security and 99.9% uptime so your operations never stop." }
];

/* ─── INDUSTRY USE CASES ─── */
const useCases = [
  {
    industry: "Hotels & Hospitality",
    icon: <Hotel size={24} />,
    description: "Online bookings, automated confirmations, guest communication, cancellation handling, and real-time room management — all in one system.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    color: "#10B981"
  },
  {
    industry: "Service Businesses",
    icon: <Briefcase size={24} />,
    description: "Appointment scheduling, automated follow-ups, invoicing, and customer profiles that help you deliver better service and retain clients.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    color: "#3B82F6"
  },
  {
    industry: "Internal Operations",
    icon: <Building2 size={24} />,
    description: "Custom dashboards, reporting tools, team coordination, and workflow automation that eliminate bottlenecks and give leadership full visibility.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    color: "#FF6B00"
  }
];

/* ─── PROCESS STEPS ─── */
const processSteps = [
  { step: "01", label: "Business Analysis", description: "We study your business, customers, and workflows to understand exactly what needs to be built.", icon: <ClipboardList size={24} />, color: "#3B82F6" },
  { step: "02", label: "System Design", description: "We architect the complete system — databases, workflows, integrations — before development begins.", icon: <Palette size={24} />, color: "#10B981" },
  { step: "03", label: "Development & Integration", description: "We build your system in phases, testing each module and integrating with your existing tools.", icon: <Code2 size={24} />, color: "#FF6B00" },
  { step: "04", label: "Testing & Deployment", description: "Rigorous testing across all scenarios. We launch only when everything runs perfectly.", icon: <Rocket size={24} />, color: "#8B5CF6" },
  { step: "05", label: "Ongoing Support", description: "Continuous monitoring, optimization, and support to keep your systems running and improving.", icon: <Headphones size={24} />, color: "#3B82F6" }
];

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll("[data-srv-animate]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="srv-page">
      {/* ════════ HERO ════════ */}
      <div className="srv-hero-wrapper">
        <NavBar />
        <section className="srv-hero">
          <div className="srv-hero-parallax" aria-hidden="true" />
          <div className="srv-hero-noise" aria-hidden="true" />
          <div className="srv-hero-copy">
            <p className="srv-eyebrow">WHAT WE BUILD</p>
            <h1 className="srv-hero-title">We Build Complete Business Systems</h1>
            <p className="srv-hero-subtext">
              Not just websites — we design and develop the automated systems, dashboards, and tools that help businesses operate efficiently and scale with confidence.
            </p>
            <div className="srv-hero-actions">
              <a className="srv-cta primary" href="#srv-services">Explore Our Services</a>
              <Link className="srv-cta ghost" to="/plan">Start Your Project</Link>
            </div>
          </div>
        </section>
      </div>

      {/* ════════ MAIN CONTENT (light bg, matching HomePage) ════════ */}
      <div className="srv-main-content-bg">

        {/* ════════ CORE SERVICES ════════ */}
        <section className="srv-services-section" id="srv-services" data-srv-animate>
          <div className="srv-section-header">
            <span className="srv-section-eyebrow">- OUR SERVICES -</span>
            <h2 className="srv-section-title">What We Build For Your Business</h2>
            <p className="srv-section-subtitle">
              Every service is focused on solving a real business problem — reducing manual work, increasing efficiency, and helping you grow.
            </p>
          </div>

          {/* Service Navigation Tabs */}
          <div className="srv-tabs-wrapper">
            <div className="srv-tabs">
              {coreServices.map((service, index) => (
                <button
                  key={service.id}
                  className={`srv-tab ${activeService === index ? "active" : ""}`}
                  onClick={() => setActiveService(index)}
                  style={{ "--tab-color": service.color }}
                >
                  <span className="srv-tab-icon">{service.icon}</span>
                  <span className="srv-tab-label">{service.title.split(" ").slice(0, 2).join(" ")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Service Display */}
          <div className="srv-service-display">
            {coreServices.map((service, index) => (
              <div
                key={service.id}
                className={`srv-service-panel ${activeService === index ? "active" : ""}`}
              >
                <div className="srv-panel-content">
                  <div className="srv-panel-badge" style={{ "--badge-color": service.color }}>
                    {service.icon}
                    <span>{service.title}</span>
                  </div>

                  <div className="srv-panel-problem">
                    <span className="srv-label">The Problem</span>
                    <p>{service.problem}</p>
                  </div>

                  <div className="srv-panel-solution">
                    <span className="srv-label">Our Solution</span>
                    <p>{service.solution}</p>
                  </div>

                  <ul className="srv-panel-features">
                    {service.features.map((feature, i) => (
                      <li key={i}>
                        <Check size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/plan" className="srv-panel-cta">
                    <span>Discuss This Service</span>
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                <div className="srv-panel-visual">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                  />
                  <div className="srv-panel-img-overlay" style={{ "--overlay-color": service.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════ SYSTEMS THINKING ════════ */}
        <section className="srv-systems-section" id="srv-systems" data-srv-animate>
          <div className="srv-systems-shell">
            <div className="srv-systems-img-col">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Systems automation dashboard"
                className="srv-systems-img"
                loading="lazy"
              />
            </div>
            <div className="srv-systems-content">
              <span className="srv-section-eyebrow">- SYSTEMS THINKING -</span>
              <h2 className="srv-section-title left">Every Project Is a Complete System</h2>
              <p className="srv-systems-lead">
                We don't just build pages — we analyze your entire business workflow and design connected systems that reduce manual work and scale with you.
              </p>
              <div className="srv-systems-grid">
                {systemsThinking.map((item, i) => (
                  <div key={i} className="srv-system-card">
                    <div className="srv-system-icon">{item.icon}</div>
                    <div className="srv-system-text">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════ INDUSTRY USE CASES ════════ */}
        <section className="srv-usecases-section" id="srv-usecases" data-srv-animate>
          <div className="srv-section-header">
            <span className="srv-section-eyebrow">- INDUSTRY USE CASES -</span>
            <h2 className="srv-section-title">Built for Real Businesses</h2>
            <p className="srv-section-subtitle">
              We work with hotel owners, service businesses, and companies looking to automate operations and grow efficiently.
            </p>
          </div>

          <div className="srv-usecases-grid">
            {useCases.map((uc, i) => (
              <div key={i} className="srv-usecase-card" style={{ "--uc-color": uc.color }}>
                <div className="srv-usecase-img-wrapper">
                  <img src={uc.image} alt={uc.industry} loading="lazy" />
                  <div className="srv-usecase-img-overlay" />
                </div>
                <div className="srv-usecase-content">
                  <div className="srv-usecase-icon">{uc.icon}</div>
                  <h3>{uc.industry}</h3>
                  <p>{uc.description}</p>
                  <Link to="/plan" className="srv-usecase-link">
                    <span>Learn More</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════ PROCESS ════════ */}
        <section className="srv-process-section" id="srv-process" data-srv-animate>
          <div className="srv-section-header">
            <span className="srv-section-eyebrow">- OUR PROCESS -</span>
            <h2 className="srv-section-title">How We Work</h2>
            <p className="srv-section-subtitle">
              A clear, professional process so you always know what's happening, what's next, and how it benefits your business.
            </p>
          </div>

          <div className="srv-process-timeline">
            {processSteps.map((step, i) => (
              <div key={i} className="srv-process-step" style={{ "--step-color": step.color }}>
                <div className="srv-step-indicator">
                  <div className="srv-step-number">{step.step}</div>
                  {i < processSteps.length - 1 && <div className="srv-step-line" />}
                </div>
                <div className="srv-step-card">
                  <div className="srv-step-icon">{step.icon}</div>
                  <h4>{step.label}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════ CTA (reuse HomePage CTA component) ════════ */}
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default Services;
