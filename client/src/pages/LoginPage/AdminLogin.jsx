/**
 * AdminLogin.jsx — Premium dark glassmorphism login page
 * Keeps all existing auth logic; full visual rebuild.
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "../auth-premium.css";

// ── Lucide-compatible inline SVG icons ───────────────────────
function IconOwner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}
function IconTeam() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconClient() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  );
}
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

const ROLES = [
  { key: "admin",  label: "Owner",       desc: "Full system access",      Icon: IconOwner },
  { key: "team",   label: "Team Member", desc: "Tasks, projects & work",  Icon: IconTeam },
  { key: "client", label: "Client",      desc: "Your project portal",     Icon: IconClient },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loggedIn, loading: authLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [error, setError]               = useState("");
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    if (!authLoading && loggedIn) navigate("/admin", { replace: true });
  }, [authLoading, loggedIn, navigate]);

  const handleRoleSelect = (key) => {
    setSelectedRole(key);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  const roleLabel = ROLES.find((r) => r.key === selectedRole)?.label;

  return (
    <div className="ap-shell">
      <div className="ap-orb3" />

      <div className="ap-card">
        {/* Brand */}
        <div className="ap-brand">
          <div className="ap-brand-mark">GG</div>
          <span className="ap-brand-name">Gale Grid</span>
        </div>

        <h1 className="ap-title">Welcome back</h1>
        <p className="ap-subtitle">Select your account type to continue.</p>

        {/* Role selector */}
        <div className="ap-role-grid">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`ap-role-card${selectedRole === r.key ? " is-selected" : ""}`}
              onClick={() => handleRoleSelect(r.key)}
            >
              <span className="ap-role-icon"><r.Icon /></span>
              <span className="ap-role-label">{r.label}</span>
              <span className="ap-role-desc">{r.desc}</span>
            </button>
          ))}
        </div>

        {/* Credentials form — reveals once role is chosen */}
        {selectedRole && (
          <form onSubmit={handleSubmit} className="ap-form">
            {/* Email */}
            <div>
              <label className="ap-field-label" htmlFor="ap-email">Email</label>
              <div className="ap-input-wrap">
                <input
                  id="ap-email"
                  type="email"
                  className="ap-input"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@company.com"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="ap-field-label" htmlFor="ap-password">Password</label>
              <div className="ap-input-wrap">
                <input
                  id="ap-password"
                  type={showPw ? "text" : "password"}
                  className="ap-input has-suffix"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  required
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
            </div>

            {error && <p className="ap-form-error">{error}</p>}

            <button type="submit" className="ap-submit" disabled={submitting}>
              {submitting ? (
                <><span className="ap-spinner" /> Signing in…</>
              ) : (
                `Sign in as ${roleLabel}`
              )}
            </button>
          </form>
        )}

        <div className="ap-hint">
          <strong>Secure login</strong><br />
          Use your assigned workspace credentials.
        </div>

        {/* Footer: register link */}
        <p className="ap-footer">
          New client?{" "}
          <Link to="/register">Create your account →</Link>
        </p>
      </div>
    </div>
  );
}

