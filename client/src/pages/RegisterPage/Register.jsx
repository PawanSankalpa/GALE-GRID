/**
 * Register.jsx — Premium dark glassmorphism client registration
 * Features: invite-mode (pre-fills email from JWT), password strength meter,
 *           show/hide password, navigates to /onboarding on success.
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { apiClient } from "../../services/apiClient.js";
import "../auth-premium.css";

// ── Password strength scorer ──────────────────────────────────
function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3); // 1=weak 2=good 3=strong
}

const STRENGTH_LABELS = { 0: "", 1: "Weak", 2: "Good", 3: "Strong" };
const STRENGTH_CLS    = { 0: "", 1: "weak", 2: "good", 3: "strong" };
const BAR_CLS         = (i, score) => {
  if (score === 0 || i > score) return "";
  return score === 1 ? "active-weak" : score === 2 ? "active-good" : "active-strong";
};

function IconEye({ off }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

export default function Register() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const { register, loggedIn } = useAuth();

  const [inviteMode,  setInviteMode]  = useState(false);

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);

  const pwStrength = scorePassword(password);

  // Redirect if already logged in
  useEffect(() => {
    if (loggedIn) navigate("/admin", { replace: true });
  }, [loggedIn, navigate]);

  // Detect invite token in URL
  useEffect(() => {
    const token = params.get("invite");
    if (!token) return;
    apiClient.get(`/api/auth/invite/validate?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.data.valid) {
          setInviteMode(true);
          setEmail(res.data.email);
          if (res.data.name) setName(res.data.name);
        }
      })
      .catch(() => {
        // Invalid / expired invite — proceed as normal registration
      });
  }, [params]);

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Full name is required (min 2 chars)";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Valid email is required";
    if (!password || password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-shell">
      <div className="ap-orb3" />

      <div className="ap-card">
        {/* Brand */}
        <div className="ap-brand">
          <div className="ap-brand-mark">GG</div>
          <span className="ap-brand-name">Gale Grid</span>
        </div>

        {/* Invite badge */}
        {inviteMode && (
          <div className="ap-invite-badge">
            <IconMail /> You were invited
          </div>
        )}

        <h1 className="ap-title">Create your account</h1>
        <p className="ap-subtitle">
          {inviteMode
            ? "Your email is pre-filled from your invitation. Choose a password to continue."
            : "Join GaleGrid and track your project in real time."}
        </p>

        <form onSubmit={handleSubmit} className="ap-form" noValidate>
          {/* Full name */}
          <div>
            <label className="ap-field-label" htmlFor="ap-name">Full Name</label>
            <div className="ap-input-wrap">
              <input
                id="ap-name"
                type="text"
                className={`ap-input${errors.name ? " is-error" : ""}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="Jane Smith"
                autoComplete="name"
                autoFocus={!inviteMode}
                disabled={loading}
              />
            </div>
            {errors.name && <span className="ap-error-text">{errors.name}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="ap-field-label" htmlFor="ap-email">Email</label>
            <div className="ap-input-wrap">
              <input
                id="ap-email"
                type="email"
                className={`ap-input${errors.email ? " is-error" : ""}${inviteMode ? " ap-input--locked" : ""}`}
                value={email}
                onChange={(e) => {
                  if (inviteMode) return; // locked in invite mode
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="you@example.com"
                autoComplete="email"
                readOnly={inviteMode}
                disabled={loading}
                style={inviteMode ? { opacity: 0.65, cursor: "not-allowed" } : {}}
              />
            </div>
            {errors.email && <span className="ap-error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="ap-field-label" htmlFor="ap-password">Password</label>
            <div className="ap-input-wrap">
              <input
                id="ap-password"
                type={showPw ? "text" : "password"}
                className={`ap-input has-suffix${errors.password ? " is-error" : ""}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                autoFocus={inviteMode}
                disabled={loading}
              />
              <button
                type="button"
                className="ap-input-suffix"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                <IconEye off={showPw} />
              </button>
            </div>

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="ap-strength">
                <div className="ap-strength-bars">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`ap-strength-bar ${BAR_CLS(i, pwStrength)}`} />
                  ))}
                </div>
                <span className={`ap-strength-label ${STRENGTH_CLS[pwStrength]}`}>
                  {STRENGTH_LABELS[pwStrength]}
                </span>
              </div>
            )}
            {errors.password && <span className="ap-error-text">{errors.password}</span>}
          </div>

          {apiError && <p className="ap-form-error">{apiError}</p>}

          <button type="submit" className="ap-submit" disabled={loading}>
            {loading ? (
              <><span className="ap-spinner" /> Creating account…</>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        <p className="ap-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
