import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.25,
};

export default function StatCard({ icon: Icon, label, value, change, changeDir, color = "orange" }) {
  return (
    <motion.div
      className="dash-stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="dash-stat-header">
        <div className={`dash-stat-icon ${color}`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`dash-stat-change ${changeDir || "up"}`}>{change}</span>
        )}
      </div>
      <div className="dash-stat-value">{value}</div>
      <div className="dash-stat-label">{label}</div>
    </motion.div>
  );
}

export function DashboardPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div className="dash-stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dash-skeleton dash-skeleton-stat" />
      ))}
    </div>
  );
}

export function SkeletonPanel() {
  return <div className="dash-skeleton dash-skeleton-panel" />;
}

export function SkeletonRows({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dash-skeleton dash-skeleton-row" />
      ))}
    </>
  );
}
