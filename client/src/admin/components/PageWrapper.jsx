import React from "react";

export default function PageWrapper({ title, description, actions, children }) {
  return (
    <div className="gg-page-wrapper">
      <header className="gg-page-header">
        <div>
          <h1 className="gg-page-title">{title}</h1>
          {description && <p className="gg-page-description">{description}</p>}
        </div>
        {actions && <div className="gg-page-actions">{actions}</div>}
      </header>
      <div className="gg-page-content">{children}</div>
    </div>
  );
}
