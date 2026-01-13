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
          Quality work that saves money over time
        </p>
        <p className={`intro-lead fade-delay ${inView ? "in-view" : ""}`}>
          You only pay for what your business actually needs.
        </p>
      </div>
    </section>
  );
}

export default IntroText;
