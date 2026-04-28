import React from "react";
import { motion, useInView } from "framer-motion";
import { useBooking } from "../context/BookingContext.jsx";
import {
  MessageCircle, Mail, Phone, ArrowRight,
  CheckCircle2, AlertCircle, Calendar,
} from "lucide-react";
import "./styles/CTA.css";

const contacts = [
  {
    href: "https://wa.me/94776868537",
    icon: MessageCircle,
    title: "Chat on WhatsApp",
    sub: "Quick response · Usually within an hour",
    color: "#25D366",
  },
  {
    href: "mailto:hello@galegrid.com",
    icon: Mail,
    title: "Send an Email",
    sub: "hello@galegrid.com",
    color: "#3B82F6",
  },
  {
    href: "tel:+94776868537",
    icon: Phone,
    title: "Call Us",
    sub: "+94 77 686 8537",
    color: "#8B5CF6",
  },
];

const trust = [
  "Free consultation included",
  "No contracts · Cancel anytime",
  "Results guaranteed",
];

export default function CTA() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { openBooking } = useBooking();

  return (
    <section className="cta2-section">
      {/* BG orbs */}
      <div className="cta2-bg" aria-hidden="true">
        <div className="cta2-orb cta2-orb-1" />
        <div className="cta2-orb cta2-orb-2" />
      </div>

      <div className="cta2-container" ref={ref}>
        {/* Urgency pill */}
        <motion.div
          className="cta2-urgency"
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <AlertCircle size={14} />
          Currently accepting <strong>3 new clients</strong> this month
        </motion.div>

        {/* Main headline */}
        <motion.h2
          className="cta2-headline"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Ready to get a website that<br />
          <em>actually grows your business?</em>
        </motion.h2>

        <motion.p
          className="cta2-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          Book a free 20-minute call. We'll review your current site, show you exactly what's holding you back, and give you a no-obligation quote.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="cta2-primary" onClick={openBooking}>
            <Calendar size={18} />
            Book Free Discovery Call
            <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          className="cta2-trust"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          {trust.map((t, i) => (
            <React.Fragment key={i}>
              <span className="cta2-trust-item">
                <CheckCircle2 size={14} /> {t}
              </span>
              {i < trust.length - 1 && <span className="cta2-trust-div" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Contact cards */}
        <div className="cta2-contacts">
          {contacts.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={i}
                href={c.href}
                className="cta2-card"
                style={{ "--cc": c.color }}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 280, damping: 22 } }}
              >
                <div className="cta2-card-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <strong>{c.title}</strong>
                  <span>{c.sub}</span>
                </div>
                <ArrowRight size={16} className="cta2-card-arrow" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
