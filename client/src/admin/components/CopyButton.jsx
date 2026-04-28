import React, { useState, useCallback } from "react";

/**
 * CopyButton — click to copy `text` to clipboard.
 * Shows a check icon for 1.5s, then reverts to copy icon.
 * Accepts an optional `label` for screen readers.
 */
export default function CopyButton({ text, label, onCopied }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // fallback for older browsers / http
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1500);
    },
    [text, onCopied]
  );

  return (
    <button
      type="button"
      className={`gg-copy-btn${copied ? " gg-copy-btn--copied" : ""}`}
      onClick={handleCopy}
      aria-label={label || `Copy ${text}`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        /* Checkmark */
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        /* Copy icon */
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <rect x="4.5" y="1" width="7.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <rect x="1" y="4.5" width="7.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="white" />
        </svg>
      )}
    </button>
  );
}
