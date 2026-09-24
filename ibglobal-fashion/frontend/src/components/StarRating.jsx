import React from "react";

export default function StarRating({ value = 0, size = 16 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={n <= Math.round(value) ? "#B8863B" : "none"}
          stroke="#B8863B"
          strokeWidth="1"
          aria-hidden="true"
        >
          <polygon points="10,1.5 12.6,7 18.5,7.8 14.2,11.9 15.3,17.8 10,14.9 4.7,17.8 5.8,11.9 1.5,7.8 7.4,7" />
        </svg>
      ))}
    </span>
  );
}
