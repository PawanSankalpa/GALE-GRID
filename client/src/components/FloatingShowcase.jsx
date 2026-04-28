import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Clock, Award, MessageSquare } from "lucide-react";
import "./styles/FloatingShowcase.css";

/* ── Counter component ─────────────────────────── */
function StatCounter({ target, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <span ref={ref} className="ts-stat-num">
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        {target}
      </motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { icon: Award,        target: "10+",   label: "Projects Delivered",    color: "#FF8C00" },
  { icon: TrendingUp,   target: "+340%", label: "Avg. Lead Increase",    color: "#10B981" },
  { icon: Clock,        target: "1.8s",  label: "Avg. Load Time",        color: "#3B82F6" },
  { icon: MessageSquare,target: "98%",   label: "Client Satisfaction",   color: "#8B5CF6" },
];

const marqueePairs = [
  { name: "Grand Hotel",     metric: "+30% Bookings"   },
  { name: "LifeCare Medical",metric: "+45% Conversion" },
  { name: "Emerald Estates", metric: "+35% Rate"       },
  { name: "Opera Listings",  metric: "Virtual Tours"   },
  { name: "Luxia Editorial", metric: "+52% Leads"      },
  { name: "SunMax Energy",   metric: "Page 1 Google"   },
  { name: "Hotel GrandView", metric: "+28% Revenue"    },
  { name: "TechVenture Inc", metric: "-60% Bounce Rate"},
];

const FloatingShowcase = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="trust-strip" aria-label="Results and client work">

      {/* ── Infinite project marquee ── */}
      <div className="ts-marquee-wrap">
        <div className="ts-marquee-track">
          {[...marqueePairs, ...marqueePairs, ...marqueePairs].map((p, i) => (
            <span className="ts-pair" key={i}>
              <span className="ts-name">{p.name}</span>
              <span className="ts-sep" />
              <span className="ts-metric">{p.metric}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats band ── */}
      <motion.div
        ref={ref}
        className="ts-stats-band"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="ts-stats-inner">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                className="ts-stat-card"
                variants={cardVariants}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                style={{ "--ts-color": s.color }}
              >
                <div className="ts-stat-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <StatCounter target={s.target} />
                <span className="ts-stat-label">{s.label}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </section>
  );
};

export default FloatingShowcase;
