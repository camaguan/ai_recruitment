import React from "react";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  variant?: "light" | "dark";
}

export default function Logo({
  className = "",
  iconSize = 28,
  textSize = "text-xl",
  variant = "dark",
}: LogoProps) {
  const fg  = variant === "light" ? "#000000" : "#FFFFFF";
  const red = "#FF3000";

  return (
    <div
      className={`flex items-center gap-3 select-none ${className}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* Geometric mark: bordered square + two filled squares + diagonal */}
      <div style={{ width: iconSize, height: iconSize, flexShrink: 0 }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer border */}
          <rect x="1" y="1" width="30" height="30" stroke={fg} strokeWidth="2" />
          {/* Top-left red fill */}
          <rect x="5" y="5" width="10" height="10" fill={red} />
          {/* Bottom-right fill */}
          <rect x="17" y="17" width="10" height="10" fill={fg} />
          {/* Diagonal accent */}
          <line x1="6" y1="26" x2="26" y2="6" stroke={red} strokeWidth="1.5" />
        </svg>
      </div>

      {/* Wordmark */}
      <span
        className={`font-black uppercase tracking-tighter leading-none ${textSize}`}
        style={{ color: fg }}
      >
        e-<span style={{ color: red }}>Selector</span>
      </span>
    </div>
  );
}
