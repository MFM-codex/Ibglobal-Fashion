import React from "react";

// A monogram-and-wordmark logo built from an interlocking "IB" inside a
// tailor's-tape ring, paired with a serif wordmark. `variant="light"` is for
// use on the dark navy header; `variant="dark"` is for use on parchment.
export default function Logo({ variant = "dark", showWordmark = true, className = "" }) {
  const ink = variant === "light" ? "#F4EEDF" : "#101B2D";
  const brass = "#B8863B";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="22" cy="22" r="20.5" stroke={brass} strokeWidth="1.2" />
        <circle cx="22" cy="22" r="17" stroke={brass} strokeWidth="0.6" strokeDasharray="1 2.6" />
        <text
          x="22"
          y="29"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="19"
          fontWeight="500"
          fill={ink}
        >
          IB
        </text>
      </svg>
      {showWordmark && (
        <div className="leading-tight">
          <div
            className="font-display text-lg tracking-wide2"
            style={{ color: ink }}
          >
            IBGLOBAL
          </div>
          <div className="font-sans text-[11px] tracking-wide2 uppercase" style={{ color: brass }}>
            Fashion
          </div>
        </div>
      )}
    </div>
  );
}
