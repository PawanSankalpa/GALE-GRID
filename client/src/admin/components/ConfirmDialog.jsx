import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

/**
 * ConfirmDialog — modern 2-step confirm modal.
 *
 * Props:
 *  open          boolean
 *  intent        "danger" | "warning" (default "danger")
 *  title         string
 *  message       string
 *  confirmLabel  string (default "Confirm")
 *  cancelLabel   string (default "Cancel")
 *  onConfirm     () => void
 *  onCancel      () => void
 */
export default function ConfirmDialog({
  open,
  intent = "danger",
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  // Focus the cancel button when dialog opens (safer default)
  const cancelBtnRef = useRef(null);
  useEffect(() => {
    if (open) {
      setTimeout(() => cancelBtnRef.current?.focus(), 40);
    }
  }, [open]);

  // Keyboard: Escape = cancel
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") {
        // Only confirm on Enter if confirm button is focused
        if (document.activeElement === confirmBtnRef.current) onConfirm?.();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const isDanger = intent === "danger";

  const dialog = (
    <div
      className="gg-confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gg-confirm-title"
      aria-describedby="gg-confirm-msg"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}
    >
      <div className="gg-confirm-dialog">
        {/* Icon */}
        <div className={`gg-confirm-icon gg-confirm-icon--${intent}`}>
          {isDanger ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M11 2L2 19h18L11 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
              <path d="M11 9v4M11 15.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M11 7v5M11 14.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {/* Content */}
        <h3 className="gg-confirm-title" id="gg-confirm-title">{title}</h3>
        {message && (
          <p className="gg-confirm-message" id="gg-confirm-msg">{message}</p>
        )}

        {/* Actions */}
        <div className="gg-confirm-actions">
          <button
            ref={cancelBtnRef}
            type="button"
            className="gg-btn gg-btn-ghost"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className={`gg-btn gg-confirm-btn--${intent}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(dialog, document.body);
}
