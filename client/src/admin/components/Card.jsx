import React from "react";

export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`gg-card ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="gg-card-header">
          {title && <h3 className="gg-card-title">{title}</h3>}
          {subtitle && <p className="gg-card-subtitle">{subtitle}</p>}
        </header>
      )}
      <div className="gg-card-body">{children}</div>
    </section>
  );
}
