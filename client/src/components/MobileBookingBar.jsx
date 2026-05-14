import React, { useEffect, useState, useCallback } from "react";
import { useBooking } from "../context/BookingContext.jsx";
import "./styles/MobileBookingBar.css";

const STORAGE_KEY = "mbbar_dismissed_ts";
const SHOW_DELAY_MS = 4000;
const SCROLL_THRESHOLD = 0.28; // show after scrolling 28% of page height

export default function MobileBookingBar() {
  const { openBooking } = useBooking();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isDismissedByUser = useCallback(() => {
    try {
      const ts = localStorage.getItem(STORAGE_KEY);
      if (!ts) return false;
      // Re-show after 24 hours
      return Date.now() - Number(ts) < 86400000;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (isDismissedByUser()) {
      setDismissed(true);
      return;
    }

    let timeoutId;

    const show = () => {
      clearTimeout(timeoutId);
      setVisible(true);
      window.removeEventListener("scroll", handleScroll);
    };

    const handleScroll = () => {
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight > 0 && window.scrollY / pageHeight >= SCROLL_THRESHOLD) {
        show();
      }
    };

    // Show on time OR after enough scroll — whichever is first
    timeoutId = setTimeout(show, SHOW_DELAY_MS);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDismissedByUser]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore storage errors silently
    }
  }, []);

  const handleCTA = useCallback(() => {
    openBooking();
    handleDismiss();
  }, [openBooking, handleDismiss]);

  if (dismissed) return null;

  return (
    <div
      className={`mbbar${visible ? " mbbar--visible" : ""}`}
      role="complementary"
      aria-label="Book a free strategy call"
    >
      <div className="mbbar-inner">
        <div className="mbbar-text">
          <span className="mbbar-label">Free Strategy Call</span>
          <span className="mbbar-sub">No commitment. Real results.</span>
        </div>
        <button
          className="mbbar-cta"
          onClick={handleCTA}
          aria-label="Book your free strategy call"
        >
          Book Now →
        </button>
        <button
          className="mbbar-close"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
