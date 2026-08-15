/**
 * ClientOnboarding.jsx — Post-registration welcome checklist
 * Soft auth-guard: redirects to /login if not authenticated.
 * Uses inline styles so it needs no extra CSS file.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const STEPS = [
  {
    icon: "✓",
    title: "Account created",
    desc: "Your GaleGrid account is active and ready.",
    done: true,
    delay: 0,
  },
  {
    icon: "✉",
    title: "Welcome email sent",
    desc: "Check your inbox for a confirmation email from us.",
    done: true,
    delay: 300,
  },
  {
    icon: "⏳",
    title: "Admin reviewing",
    desc: "Our team will review your profile within 24 hours.",
    done: false,
    delay: 600,
  },
  {
    icon: "📅",
    title: "Book your intro call",
    desc: "Schedule a 30-min kickoff to get your project started.",
    done: false,
    delay: 900,
  },
];

const S = {
  shell: {
    minHeight: "100vh",
    background: "#07080f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  orb: (top, left, color) => ({
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    top,
    left,
    opacity: 0.12,
    pointerEvents: "none",
  }),
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 500,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "48px 40px",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.05em",
  },
  brandName: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 8,
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 36,
    lineHeight: 1.6,
  },
  stepList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 36px 0",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  step: (visible) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.45s ease, transform 0.45s ease",
    paddingBottom: 24,
  }),
  iconWrap: (done) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    background: done
      ? "linear-gradient(135deg, #6366f1, #0ea5e9)"
      : "rgba(255,255,255,0.06)",
    border: done
      ? "none"
      : "1px solid rgba(255,255,255,0.1)",
    color: done ? "#fff" : "rgba(255,255,255,0.35)",
    marginTop: 2,
  }),
  connector: {
    position: "absolute",
    left: 17,
    top: 38,
    width: 2,
    height: "calc(100% - 14px)",
    background: "rgba(255,255,255,0.07)",
  },
  stepText: {
    flex: 1,
  },
  stepTitle: (done) => ({
    fontSize: 14,
    fontWeight: 600,
    color: done ? "#fff" : "rgba(255,255,255,0.45)",
    marginBottom: 2,
  }),
  stepDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.5,
  },
  cta: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s, transform 0.2s",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
  },
};

export default function ClientOnboarding() {
  const navigate          = useNavigate();
  const { loggedIn, user } = useAuth();
  const [visible,  setVisible]  = useState({});

  // Soft auth guard
  useEffect(() => {
    if (loggedIn === false) navigate("/login", { replace: true });
  }, [loggedIn, navigate]);

  // Staggered reveal
  useEffect(() => {
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisible((prev) => ({ ...prev, [i]: true }));
      }, step.delay + 100);
    });
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div style={S.shell}>
      <div style={S.orb("-100px", "60%", "#6366f1")} />
      <div style={S.orb("auto", "-200px", "#0ea5e9")} />

      <div style={S.card}>
        {/* Brand */}
        <div style={S.brand}>
          <div style={S.brandMark}>GG</div>
          <span style={S.brandName}>Gale Grid</span>
        </div>

        <h1 style={S.heading}>Welcome, {firstName}! 🎉</h1>
        <p style={S.subtitle}>
          Your account is set up. Here's what happens next.
        </p>

        {/* Step checklist */}
        <ul style={S.stepList}>
          {STEPS.map((step, i) => (
            <li
              key={i}
              style={{ ...S.step(!!visible[i]), position: "relative" }}
            >
              {i < STEPS.length - 1 && <div style={S.connector} />}
              <div style={S.iconWrap(step.done)}>{step.icon}</div>
              <div style={S.stepText}>
                <div style={S.stepTitle(step.done)}>{step.title}</div>
                <div style={S.stepDesc}>{step.desc}</div>
              </div>
            </li>
          ))}
        </ul>

        <button
          style={S.cta}
          onClick={() => navigate("/admin")}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.01)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "scale(1)"; }}
        >
          Go to your portal →
        </button>

        <p style={S.footer}>
          Questions? Email us at{" "}
          <a href="mailto:hello.galegrid@gmail.com" style={{ color: "rgba(255,255,255,0.5)" }}>
            hello.galegrid@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
