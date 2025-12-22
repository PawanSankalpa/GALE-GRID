import React, { useEffect, useRef, useState } from "react";
import "./styles/IntroText.css";

function IntroText() {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // run once
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="intro-section" ref={containerRef}>
      <div className="intro-container">
        <p className={`intro-headline center-split ${inView ? "in-view" : ""}`}>
          We create custom websites for small businesses that combine beautiful design with smart strategy.
        </p>
        <p className={`intro-lead fade-delay ${inView ? "in-view" : ""}`}>
          Our goal is simple: build websites that look great, load fast, and turn visitors into customers.
        </p>
      </div>
    </section>
  );
}

export default IntroText;
