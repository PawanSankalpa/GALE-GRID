import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`gg-btn gg-btn-${variant} ${className}`.trim()}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
