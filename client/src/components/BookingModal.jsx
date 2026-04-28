import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, CheckCircle2, Calendar } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";
import "./styles/BookingModal.css";

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $7,000",
  "$7,000 – $15,000",
  "$15,000+",
];

const SERVICE_OPTIONS = [
  "New Website",
  "Redesign / Revamp",
  "E-commerce Store",
  "Landing Page",
  "Web Application",
  "SEO & Performance",
  "Ongoing Maintenance",
  "Other",
];

const HEAR_ABOUT_OPTIONS = [
  "Google Search",
  "Social Media",
  "Referral",
  "Portfolio / Dribbble",
  "Other",
];

const STEP_LABELS = ["Your Details", "Choose a Time", "Confirmed"];

// ─── Step 1: Lead qualification form ───────────────────────────────
function StepOne({ onNext }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    website: "", budget: "", service: "", hearAbout: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/bookings/prequalify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
      onNext({ form, bookingId: data.bookingId });
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <form className="bm-form" onSubmit={handleSubmit} noValidate>
      <div className="bm-field-row">
        <label className="bm-field">
          <span className="bm-label">Full Name <em>*</em></span>
          <input className="bm-input" value={form.name} onChange={set("name")} placeholder="Jane Smith" required />
        </label>
        <label className="bm-field">
          <span className="bm-label">Email <em>*</em></span>
          <input className="bm-input" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" required />
        </label>
      </div>
      <div className="bm-field-row">
        <label className="bm-field">
          <span className="bm-label">Phone</span>
          <input className="bm-input" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
        </label>
        <label className="bm-field">
          <span className="bm-label">Company</span>
          <input className="bm-input" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
        </label>
      </div>
      <label className="bm-field">
        <span className="bm-label">Current Website</span>
        <input className="bm-input" value={form.website} onChange={set("website")} placeholder="https://yoursite.com" />
      </label>
      <div className="bm-field-row">
        <label className="bm-field">
          <span className="bm-label">Budget Range</span>
          <select className="bm-input bm-select" value={form.budget} onChange={set("budget")}>
            <option value="">Select…</option>
            {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="bm-field">
          <span className="bm-label">Service Needed</span>
          <select className="bm-input bm-select" value={form.service} onChange={set("service")}>
            <option value="">Select…</option>
            {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
      </div>
      <label className="bm-field">
        <span className="bm-label">How did you hear about us?</span>
        <select className="bm-input bm-select" value={form.hearAbout} onChange={set("hearAbout")}>
          <option value="">Select…</option>
          {HEAR_ABOUT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      {error && <p className="bm-error">{error}</p>}
      <button className="bm-next-btn" type="submit" disabled={loading}>
        {loading ? "Saving…" : <>Choose a Time <ChevronRight size={16} /></>}
      </button>
    </form>
  );
}

// ─── Step 2: Cal.com inline embed ──────────────────────────────────
function StepTwo({ leadData, onBooked }) {
  useEffect(() => {
    getCalApi({}).then((cal) => {
      cal("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view" });
      cal("on", { action: "bookingSuccessful", callback: () => onBooked() });
    });
  }, [onBooked]);

  const calLink = process.env.REACT_APP_CAL_LINK || "galegrid/15min";
  const prefill = {
    name: leadData?.form?.name || "",
    email: leadData?.form?.email || "",
  };

  return (
    <div className="bm-cal-wrap">
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view", ...prefill }}
      />
    </div>
  );
}

// ─── Step 3: Confirmation ───────────────────────────────────────────
function StepThree({ leadData, onClose }) {
  const name = leadData?.form?.name || "there";
  const calLink = process.env.REACT_APP_CAL_LINK || "galegrid/15min";
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Discovery+Call+with+GaleGrid&details=15-minute+discovery+call&location=https://cal.com/${calLink}`;

  return (
    <div className="bm-confirm">
      <div className="bm-confirm-icon">
        <CheckCircle2 size={52} strokeWidth={1.5} />
      </div>
      <h3 className="bm-confirm-title">You're all set, {name}!</h3>
      <p className="bm-confirm-sub">
        A confirmation email is on its way. Check your inbox (and spam folder just in case).
      </p>
      <div className="bm-checklist">
        <p className="bm-checklist-head">To get the most from your call, prepare:</p>
        <ol className="bm-checklist-list">
          <li>Your current website URL (if you have one)</li>
          <li>3 competitors or sites you admire</li>
          <li>Your primary goal (leads, bookings, brand, e-commerce)</li>
          <li>Any deadlines or launch dates to keep in mind</li>
        </ol>
      </div>
      <div className="bm-confirm-actions">
        <a className="bm-gcal-btn" href={gcalUrl} target="_blank" rel="noopener noreferrer">
          <Calendar size={16} /> Add to Google Calendar
        </a>
        <button className="bm-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [leadData, setLeadData] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 600
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const panelMotion = isMobile
    ? {
        initial:    { opacity: 0, y: 80 },
        animate:    { opacity: 1, y: 0 },
        exit:       { opacity: 0, y: 80 },
        transition: { type: "spring", stiffness: 320, damping: 30 },
      }
    : {
        transformTemplate: (_v, generated) => `translate(-50%, -50%) ${generated}`,
        initial:    { opacity: 0, scale: 0.95 },
        animate:    { opacity: 1, scale: 1 },
        exit:       { opacity: 0, scale: 0.95 },
        transition: { type: "spring", stiffness: 300, damping: 26 },
      };

  function handleClose() {
    onClose();
    // Reset after animation finishes
    setTimeout(() => { setStep(0); setLeadData(null); }, 400);
  }

  function handleNext(data) {
    setLeadData(data);
    setStep(1);
  }

  function handleBooked() {
    setStep(2);
  }

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="bm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className={`bm-panel${step === 1 ? " bm-panel--cal" : ""}${isMobile ? " bm-panel--mobile" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Book a discovery call"
            {...panelMotion}
          >
            {/* Header */}
            <div className="bm-header">
              <div className="bm-header-left">
                <span className="bm-header-eyebrow">Free 15-min Discovery Call</span>
                <h2 className="bm-header-title">
                  {step === 0 && "Tell us about your project"}
                  {step === 1 && "Pick a time that works for you"}
                  {step === 2 && "Call confirmed"}
                </h2>
              </div>
              <button className="bm-close" onClick={handleClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="bm-progress" aria-hidden="true">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className={`bm-progress-step${i <= step ? " bm-progress-step--done" : ""}${i === step ? " bm-progress-step--active" : ""}`}>
                  <span className="bm-progress-dot" />
                  <span className="bm-progress-label">{label}</span>
                </div>
              ))}
              <div className="bm-progress-bar">
                <div className="bm-progress-fill" style={{ width: `${(step / 2) * 100}%` }} />
              </div>
            </div>

            {/* Body */}
            <div className="bm-body">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                    <StepOne onNext={handleNext} />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                    <StepTwo leadData={leadData} onBooked={handleBooked} />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                    <StepThree leadData={leadData} onClose={handleClose} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modal, document.body);
}
