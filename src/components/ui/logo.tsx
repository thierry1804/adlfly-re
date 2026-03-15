import React from 'react';

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <path
          d="M10 20L30 10L50 20L30 30L10 20Z"
          fill="currentColor"
          className="text-adl-orange"
        />
        <path
          d="M20 20L70 5L90 20L70 35L20 20Z"
          fill="currentColor"
          fillOpacity="0.8"
          className="text-adl-sky"
        />
      </svg>
      <span className="text-2xl font-extrabold tracking-tighter text-white">
        ADL<span className="text-adl-orange">FLY</span>
      </span>
    </div>
  );
}
