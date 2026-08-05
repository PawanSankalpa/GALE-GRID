import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useBooking } from "../context/BookingContext.jsx";
import { lockBodyScroll } from "../utils/scrollLock";
import { createPortal } from "react-dom";
import roboHand from "../assets/statsPics/robo_hand-removebg-preview.png";
import "./styles/WhyUs.css";

const STEP_COLORS = ["#FF8C00", "#FF8C00", "#FF8C00"];
const RESULT_COLOR = "#FF8C00";
const SUCCESS_GREEN = "#22C55E";

const QUESTIONS = [
  {
    id: "q1", type: "multi",
    question: "What do you want your website to do?",
    hint: "Select all that apply",
    options: [
      "Rank higher than my competitors on Google",
      "Look more professional and premium",
      "Turn visitors into paying leads automatically",
      "Sell products or services online, 24/7",
    ],
  },
  {
    id: "q2", type: "single",
    question: "What is holding your business back right now?",
    hint: "Choose the primary reason",
    options: [
      "My website looks outdated and unprofessional",
      "I am invisible on Google — nobody finds me",
      "Competitors look more credible than me",
      "I do not have a proper website yet",
    ],
  },
  {
    id: "q3", type: "single",
    question: "When are you ready to launch?",
    hint: "Choose the timeframe",
    options: [
      "Right now — within 30 days",
      "Within 90 days — planning next step",
      "Just exploring what is possible",
    ],
  },
];

const RESULTS = {
  "My website looks outdated and unprofessional": {
    headline: "You need a brand that commands respect.",
    sub: "We build websites so sharp your competitors will wonder who is behind them.",
  },
  "I am invisible on Google — nobody finds me": {
    headline: "You need to own your market online.",
    sub: "Positioning, trust-signals, SEO, speed — we combine them to make you the obvious choice.",
  },
  "Competitors look more credible than me": {
    headline: "You need design that stops the scroll.",
    sub: "First impressions are everything. We build the kind of authority design that commands trust.",
  },
  "I do not have a proper website yet": {
    headline: "You need a 24/7 lead generation machine.",
    sub: "We will build a high-performance site from scratch that converts traffic into customers.",
  },
};
const DEFAULT_RESULT = {
  headline: "Every single thing you want? We have built it.",
  sub: "Performance, design, SEO, leads — all of it. Let us talk.",
};

const DELIVERABLE_MAP = {
  "Rank higher than my competitors on Google":          "SEO-optimised architecture & content strategy",
  "Look more professional and premium":                 "Premium brand-led design system",
  "Turn visitors into paying leads automatically":      "Conversion-optimised pages with intelligent CTAs",
  "Sell products or services online, 24/7":             "E-commerce flow with automated order processing",
  "My website looks outdated and unprofessional":       "Full visual redesign — modern, premium, polished",
  "I am invisible on Google — nobody finds me":         "Technical SEO + local and national search domination",
  "Competitors look more credible than me":             "Authority design & trust-signal architecture",
  "I do not have a proper website yet":                 "End-to-end build from scratch — done properly",
};
const DEFAULT_DELIVERABLES = [
  "Custom strategy built around your market position",
  "Results-focused, premium build process",
  "Ongoing performance tracking and optimisation",
];

function buildDeliverables(q1Arr, q2Arr) {
  const combined = [...(q1Arr || []), ...(q2Arr || [])];
  const mapped = combined.map((opt) => DELIVERABLE_MAP[opt]).filter(Boolean);
  const unique = [...new Set(mapped)];
  return [...unique, ...DEFAULT_DELIVERABLES].slice(0, 3);
}

const URGENCY_MAP = {
  "Right now — within 30 days": {
    label: "Priority intake",
    bg: "rgba(255, 107, 0, 0.08)",
    color: "#C2410C",
  },
  "Within 90 days — planning next step": {
    label: "90-day roadmap",
    bg: "rgba(37, 99, 235, 0.08)",
    color: "#1D4ED8",
  },
  "Just exploring what is possible": {
    label: "Discovery call",
    bg: "rgba(107, 114, 128, 0.08)",
    color: "#6B7280",
  },
};
const DEFAULT_URGENCY = { label: "Ready when you are", bg: "rgba(107,114,128,0.08)", color: "#6B7280" };

/* ─── Animated payment-done tick (used in both overlay and inline) ─── */
function AnimatedTick({ size = 72, reduced }) {
  const small = size < 56;
  return (
    <div
      className="wu2-tick-wrap"
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      {!reduced && (
        <>
          <motion.span
            className="wu2-ripple"
            initial={{ scale: 0.75, opacity: 0.5 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.28 }}
          />
          <motion.span
            className="wu2-ripple"
            initial={{ scale: 0.75, opacity: 0.3 }}
            animate={{ scale: 3.6, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.46 }}
          />
        </>
      )}
      <motion.div
        className="wu2-tick-circle"
        style={{ width: size, height: size }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.04 }}
      >
        {small ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <motion.path
              d="M4.5 11l4.5 5L17.5 6"
              stroke="#fff" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduced ? 0 : 0.38, ease: "easeOut", delay: 0.28 }}
            />
          </svg>
        ) : (
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <motion.path
              d="M9 20l7.5 8L29 10"
              stroke="#fff" strokeWidth="3.4"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut", delay: 0.28 }}
            />
          </svg>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Inline result — shown on the page after quiz completion ─── */
function InlineResult({ savedAnswers, onRetake, onBook, reduced }) {
  const q1Sels = savedAnswers.q1 || [];
  const q2Answer = (savedAnswers.q2 || [])[0] || "";
  const q3Answer = (savedAnswers.q3 || [])[0] || "";

  const result = RESULTS[q2Answer] || DEFAULT_RESULT;
  const deliverables = buildDeliverables(q1Sels, [q2Answer]);
  const urgency = URGENCY_MAP[q3Answer] || DEFAULT_URGENCY;

  return (
    <motion.div
      className="wu2-inline-result"
      key="inline-result"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.18 } }}
    >
      {/* Tick + badge row */}
      <div className="wu2-ir-top">
        <AnimatedTick size={44} reduced={reduced} />
        <motion.span
          className="wu2-ir-badge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          Your result is ready
        </motion.span>
      </div>

      <motion.h3
        className="wu2-ir-headline"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.28, type: "spring", stiffness: 80, damping: 18 } }}
      >
        {result.headline}
      </motion.h3>

      <motion.p
        className="wu2-ir-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.38 } }}
      >
        {result.sub}
      </motion.p>

      {/* Personalised plan box — reuses overlay plan styles */}
      <motion.div
        className="wu2-result-plan wu2-ir-plan"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.46, type: "spring", stiffness: 80, damping: 20 } }}
      >
        <div className="wu2-plan-hdr">
          <span className="wu2-plan-label">Your personalised plan</span>
          <span className="wu2-urgency-badge" style={{ background: urgency.bg, color: urgency.color }}>
            {urgency.label}
          </span>
        </div>
        {deliverables.map((d, i) => (
          <motion.div
            key={d}
            className="wu2-plan-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{
              opacity: 1, x: 0,
              transition: { delay: 0.58 + i * 0.1, type: "spring", stiffness: 110, damping: 18 },
            }}
          >
            <span className="wu2-plan-row-icon">
              <Check size={9} strokeWidth={4} color={SUCCESS_GREEN} />
            </span>
            <span className="wu2-plan-row-text">{d}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        type="button"
        className="wu2-open-btn"
        onClick={onBook}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.9, type: "spring", stiffness: 80, damping: 18 } }}
        whileHover={{ y: -2 }}
      >
        Claim your strategy session <ArrowRight size={16} strokeWidth={2.4} />
      </motion.button>

      <motion.button
        type="button"
        className="wu2-retake-btn"
        onClick={onRetake}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.06 } }}
      >
        Retake the quiz
      </motion.button>
    </motion.div>
  );
}

/* ─── Result card — shown inside the overlay ─── */
function ResultCard({ answers, onReset, onBook, reduced }) {
  const q1Sels = answers.q1 || [];
  const q2Answer = (answers.q2 || [])[0] || "";
  const q3Answer = (answers.q3 || [])[0] || "";

  const result = RESULTS[q2Answer] || DEFAULT_RESULT;
  const deliverables = buildDeliverables(q1Sels, [q2Answer]);
  const urgency = URGENCY_MAP[q3Answer] || DEFAULT_URGENCY;

  return (
    <motion.div
      className="wu2-result"
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }}
    >
      <AnimatedTick size={72} reduced={reduced} />

      <motion.span
        className="wu2-result-badge"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.22, type: "spring", stiffness: 200, damping: 18 } }}
      >
        <Check size={10} strokeWidth={3.5} />
        Analysis complete
      </motion.span>

      <motion.h3
        className="wu2-result-headline"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.34, type: "spring", stiffness: 80, damping: 18 } }}
      >
        {result.headline}
      </motion.h3>

      <motion.p
        className="wu2-result-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.44 } }}
      >
        {result.sub}
      </motion.p>

      <motion.div
        className="wu2-result-plan"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.54, type: "spring", stiffness: 80, damping: 20 } }}
      >
        <div className="wu2-plan-hdr">
          <span className="wu2-plan-label">Your personalised plan</span>
          <span className="wu2-urgency-badge" style={{ background: urgency.bg, color: urgency.color }}>
            {urgency.label}
          </span>
        </div>
        {deliverables.map((d, i) => (
          <motion.div
            key={d}
            className="wu2-plan-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{
              opacity: 1, x: 0,
              transition: { delay: 0.64 + i * 0.1, type: "spring", stiffness: 110, damping: 18 },
            }}
          >
            <span className="wu2-plan-row-icon">
              <Check size={9} strokeWidth={4} color={SUCCESS_GREEN} />
            </span>
            <span className="wu2-plan-row-text">{d}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        type="button"
        className="wu2-result-cta"
        onClick={onBook}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.98, type: "spring", stiffness: 80, damping: 18 } }}
        whileHover={{ y: -2 }}
      >
        Claim your strategy session
        <ArrowRight size={15} strokeWidth={2.4} />
      </motion.button>

      <motion.button
        type="button"
        className="wu2-result-restart"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.14 } }}
      >
        Start over
      </motion.button>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function WhyUs() {
  const { openBooking } = useBooking();
  const reduced = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [phase, setPhase] = useState("quiz");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({});
  /* Persists after overlay closes — drives the inline result on the page */
  const [savedAnswers, setSavedAnswers] = useState(null);
  const autoRef = useRef(null);
  const unlockScrollRef = useRef(null);

  /* Pop on visit:
     - sessionStorage("wu2_dismissed") set this session → do nothing
     - localStorage("wu2_visited") set (returning visitor)  → welcome-back toast
     - neither set (brand new visitor)                      → full quiz popup     */
  useEffect(() => {
    try {
      if (sessionStorage.getItem("wu2_dismissed")) return;
      // Don't auto-pop on mobile — inline quiz section is the CTA there
      if (window.innerWidth <= 768) return;
      const t = setTimeout(() => {
        if (localStorage.getItem("wu2_visited")) {
          setWelcomeBack(true);
        } else {
          localStorage.setItem("wu2_visited", "1");
          setIsOpen(true);
        }
      }, 800);
      return () => clearTimeout(t);
    } catch (_) {}
  }, []);

  /* Save answers when quiz reaches result phase */
  useEffect(() => {
    if (phase === "result") {
      setSavedAnswers({ ...answers });
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      unlockScrollRef.current?.();
      unlockScrollRef.current = lockBodyScroll();
    } else {
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
    }
    return () => {
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
    };
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  function handleOpen() {
    setPhase("quiz"); setStep(0); setDirection(1); setAnswers({});
    setIsOpen(true);
    try { sessionStorage.removeItem("wu2_dismissed"); } catch (_) {}
  }
  function handleClose() {
    setIsOpen(false);
    try { sessionStorage.setItem("wu2_dismissed", "1"); } catch (_) {}
    if (autoRef.current) clearTimeout(autoRef.current);
  }
  function handleWelcomeBackClose() {
    setWelcomeBack(false);
    try { sessionStorage.setItem("wu2_dismissed", "1"); } catch (_) {}
  }
  function handleWelcomeBackTakeQuiz() {
    setWelcomeBack(false);
    setPhase("quiz"); setStep(0); setDirection(1); setAnswers({});
    setIsOpen(true);
    try { sessionStorage.removeItem("wu2_dismissed"); } catch (_) {}
  }
  function handleRetake() {
    setSavedAnswers(null);
    setPhase("quiz"); setStep(0); setDirection(1); setAnswers({});
    setIsOpen(true);
    try { sessionStorage.removeItem("wu2_dismissed"); } catch (_) {}
  }
  function toggleAnswer(qid, opt, type) {
    setAnswers((prev) => {
      const cur = prev[qid] || [];
      if (type === "single") return { ...prev, [qid]: [opt] };
      if (cur.includes(opt)) return { ...prev, [qid]: cur.filter((x) => x !== opt) };
      return { ...prev, [qid]: [...cur, opt] };
    });
  }
  function handleChipClick(qid, opt, type) {
    toggleAnswer(qid, opt, type);
    if (type === "single") {
      if (autoRef.current) clearTimeout(autoRef.current);
      autoRef.current = setTimeout(() => {
        setDirection(1);
        setStep((s) => {
          if (s < QUESTIONS.length - 1) return s + 1;
          setPhase("result");
          return s;
        });
      }, 280);
    }
  }
  function handleNext() {
    setDirection(1);
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
    else setPhase("result");
  }
  function handleBack() {
    if (step > 0) { setDirection(-1); setStep((s) => s - 1); }
  }

  const q = QUESTIONS[step];
  const selected = answers[q?.id] || [];
  const canNext = selected.length > 0;
  const isResult = phase === "result";
  const currentColor = isResult ? RESULT_COLOR : (STEP_COLORS[step] || RESULT_COLOR);
  const progressColor = isResult ? SUCCESS_GREEN : currentColor;
  const progressPct = isResult ? 100 : ((step + 1) / QUESTIONS.length) * 100;

  return (
    <section className="wu2-section" aria-labelledby="wu2-headline">

      {/* ── Page section — teaser OR inline result ── */}
      <AnimatePresence mode="wait">
        {!savedAnswers ? (
          /* Default teaser */
          <motion.div
            key="teaser"
            className="wu2-teaser"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.18 } }}
          >
            <div className="wu2-teaser-inner">
              <div className="wu2-teaser-media">
                <img src={roboHand} alt="Robotic Hand Illustration" className="wu2-robo-hand-img" />
              </div>
              <div className="wu2-teaser-content">
                <span className="wu2-eyebrow">Why Choose Us</span>
                <h2 className="wu2-headline" id="wu2-headline">
                  What does your business<br /><span>actually need</span> online?
                </h2>
                <p className="wu2-sub">3 questions. 45 seconds. Your answer, built around your goals.</p>
                <button type="button" className="wu2-open-btn" onClick={handleOpen}>
                  Find out now <ArrowRight size={16} strokeWidth={2.4} />
                </button>
                <p className="wu2-no-commitment">No commitment &nbsp;·&nbsp; Exit anytime</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Inline result — replaces teaser after quiz completion */
          <InlineResult
            key="inline-result"
            savedAnswers={savedAnswers}
            onRetake={handleRetake}
            onBook={() => { handleClose(); openBooking(); }}
            reduced={reduced}
          />
        )}
      </AnimatePresence>

      {/* ── Welcome-back toast (returning visitors) ── */}
      {createPortal(
        <AnimatePresence>
          {welcomeBack && (
            <>
              <motion.div
                className="wu2-backdrop wu2-wb-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                onClick={handleWelcomeBackClose}
                aria-hidden="true"
              />
              <motion.div
                className="wu2-overlay-wrap"
                role="dialog" aria-modal="true" aria-label="Welcome back"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20, delay: 0.05 } }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 8, transition: { duration: 0.2 } }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="wu2-card wu2-wb-card">
                  <button
                    type="button"
                    className="wu2-close-btn wu2-wb-close"
                    onClick={handleWelcomeBackClose}
                    aria-label="Close"
                  >
                    <X size={15} strokeWidth={2.4} />
                  </button>

                  <div className="wu2-wb-body">
                    <span className="wu2-wb-wave" aria-hidden="true">&#128075;</span>
                    <h3 className="wu2-wb-headline">Welcome back.</h3>
                    <p className="wu2-wb-sub">
                      Good to see you again. Ready to find out exactly what your
                      business needs online?
                    </p>
                    <button
                      type="button"
                      className="wu2-result-cta"
                      onClick={handleWelcomeBackTakeQuiz}
                    >
                      Take the quiz <ArrowRight size={15} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="wu2-result-restart"
                      onClick={handleWelcomeBackClose}
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Full-screen overlay ── */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="wu2-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                onClick={handleClose}
                aria-hidden="true"
              />

              {/* Side illustrations removed for clean focus */}

              <motion.div
                className="wu2-overlay-wrap"
                role="dialog" aria-modal="true" aria-label="Website needs assessment"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.88, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 20, delay: 0.05 } }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 12, transition: { duration: 0.22 } }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="wu2-card">

                  <div className="wu2-prog-track" aria-hidden="true">
                    <motion.div
                      className="wu2-prog-fill"
                      animate={{ width: `${progressPct}%`, background: progressColor }}
                      transition={{ type: "spring", stiffness: 70, damping: 20 }}
                    />
                  </div>

                  <div className="wu2-card-hdr">
                    <div className="wu2-dots" aria-hidden="true">
                      {QUESTIONS.map((_, i) => {
                        const done = isResult || i < step;
                        const active = !isResult && i === step;
                        return (
                          <motion.span
                            key={i} className="wu2-dot" layout
                            animate={{
                              background: (done || active) ? progressColor : "#E5E7EB",
                              width: active ? 20 : 8,
                            }}
                            transition={{ type: "spring", stiffness: 140, damping: 18 }}
                          />
                        );
                      })}
                    </div>
                    <span className="wu2-card-meta">
                      {isResult ? "Your result" : `${step + 1} of ${QUESTIONS.length}`}
                      <span className="wu2-meta-sep">·</span>
                      <span className="wu2-time-badge">~45 sec</span>
                    </span>
                    <button type="button" className="wu2-close-btn" onClick={handleClose} aria-label="Exit quiz">
                      <X size={15} strokeWidth={2.4} />
                    </button>
                  </div>

                  <div className="wu2-card-body">
                    <AnimatePresence mode="wait">

                      {phase === "quiz" && (
                        <motion.div
                          key={step} className="wu2-step"
                          initial={{ opacity: 0, x: reduced ? 0 : direction * 52 }}
                          animate={{ opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }}
                          exit={{ opacity: 0, x: reduced ? 0 : direction * -52, transition: { duration: 0.15 } }}
                        >
                          <h3 className="wu2-step-q">{q.question}</h3>
                          <p className="wu2-step-hint">{q.hint}</p>

                          <div className="wu2-chips">
                            {q.options.map((opt, idx) => {
                              const sel = selected.includes(opt);
                              const letter = String.fromCharCode(65 + idx);
                              return (
                                <button
                                  key={opt} type="button"
                                  className={`wu2-chip${sel ? " is-sel" : ""}`}
                                  onClick={() => handleChipClick(q.id, opt, q.type)}
                                  aria-pressed={sel}
                                >
                                  <span className={`wu2-chip-letter${sel ? " is-sel" : ""}`}>
                                    {letter}
                                  </span>
                                  <span className="wu2-chip-text">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="wu2-step-actions">
                            <div className="wu2-step-actions-left">
                              {step > 0 && (
                                <button type="button" className="wu2-back-btn" onClick={handleBack}>
                                  ← Back
                                </button>
                              )}
                              <button type="button" className="wu2-cancel-btn" onClick={handleClose}>
                                Cancel
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`wu2-next-btn${canNext ? "" : " is-off"}`}
                              onClick={canNext ? handleNext : undefined}
                              disabled={!canNext}
                            >
                              {step === QUESTIONS.length - 1 ? "See my result" : "Next"}
                              <ArrowRight size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {phase === "result" && (
                        <ResultCard
                          key="result"
                          answers={answers}
                          onReset={() => { setSavedAnswers(null); setPhase("quiz"); setStep(0); setDirection(1); setAnswers({}); }}
                          onBook={() => { handleClose(); openBooking(); }}
                          reduced={reduced}
                        />
                      )}

                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
