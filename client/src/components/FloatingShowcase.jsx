import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./styles/FloatingShowcase.css";

/* ── Stat item with slide-in animation ─────────── */
function StatItem({ value, label, align }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className={`ts-stat-item ts-stat-item--${align}`}
      initial={{ opacity: 0, x: align === "left" ? -24 : 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 22 }}
    >
      <span className="ts-stat-num">{value}</span>
      <span className="ts-stat-label">{label}</span>
    </motion.div>
  );
}

const leftStats = [
  { value: "10+",   label: "Projects\nDelivered"  },
  { value: "+340%", label: "Avg. Lead\nIncrease"  },
];
const rightStats = [
  { value: "1.8s",  label: "Avg. Load\nTime"      },
  { value: "98%",   label: "Client\nSatisfaction" },
];

const marqueePairs = [
  { name: "Grand Hotel",      metric: "+30% Bookings"    },
  { name: "LifeCare Medical", metric: "+45% Conversion"  },
  { name: "Emerald Estates",  metric: "+35% Rate"        },
  { name: "Opera Listings",   metric: "Virtual Tours"    },
  { name: "Luxia Editorial",  metric: "+52% Leads"       },
  { name: "SunMax Energy",    metric: "Page 1 Google"    },
  { name: "Hotel GrandView",  metric: "+28% Revenue"     },
  { name: "TechVenture Inc",  metric: "-60% Bounce Rate" },
];

const FloatingShowcase = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="trust-strip" aria-label="Results and client work">

      {/* ── Marquee strip ── */}
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

      {/* ── Editorial brand band ── */}
      <div className="ts-editorial" ref={ref}>
        <div className="ts-ed-inner">

          {/* Left stats — in the white negative space */}
          <div className="ts-ed-col ts-ed-col--left">
            {leftStats.map((s) => (
              <StatItem key={s.value} value={s.value} label={s.label} align="left" />
            ))}
          </div>

          {/* Centre: brand logo */}
          <div className="ts-ed-center">
            <motion.div
              className="ts-logo-wrap"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/galegrid-logo.png`}
                alt="Gale Grid"
                className="ts-logo-img"
                draggable={false}
              />
            </motion.div>
            <motion.p
              className="ts-ed-tagline"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.55 }}
            >
              Websites built to convert — not just impress
            </motion.p>
          </div>

          {/* Right stats — in the white negative space */}
          <div className="ts-ed-col ts-ed-col--right">
            {rightStats.map((s) => (
              <StatItem key={s.value} value={s.value} label={s.label} align="right" />
            ))}
          </div>

        </div>
      </div>

    </section>
  );
};

export default FloatingShowcase;
