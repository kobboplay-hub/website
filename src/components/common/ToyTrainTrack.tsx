"use client";

import { useState, useEffect, useRef } from "react";

export default function ToyTrainTrack() {
  const [positionPercent, setPositionPercent] = useState(38);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Smooth continuous automatic movement along the track
  useEffect(() => {
    const speed = 4; // percent per second

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        setPositionPercent((prev) => {
          let next = direction === "forward" ? prev + speed * delta : prev - speed * delta;
          if (next >= 92) {
            setDirection("backward");
            next = 92;
          } else if (next <= 8) {
            setDirection("forward");
            next = 8;
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [direction]);

  return (
    <section aria-label="Decorative toy train" className="relative z-10 -mt-3 bg-kobbo-cream sm:-mt-3.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Track container */}
        <div className="relative h-10 w-full sm:h-12">
          {/* Animated Toy Train on the track */}
          <div
            className="absolute bottom-2.5 z-20 -translate-x-1/2 transition-transform duration-100 ease-out will-change-transform sm:bottom-3"
            style={{ left: `${positionPercent}%` }}
          >
            <div
              className={`relative animate-train-bob ${direction === "backward" ? "-scale-x-100" : ""
                }`}
            >
              {/* Smoke bubbles rising from the chimney */}
              <div className="pointer-events-none absolute -top-5 left-[34px] hidden sm:block">
                <div className="animate-smoke-1 absolute h-2.5 w-2.5 rounded-full bg-kobbo-yellow/70 shadow-xs" />
                <div className="animate-smoke-2 absolute h-2 w-2 rounded-full bg-kobbo-yellow/50 shadow-xs" />
              </div>

              {/* Exact Toy Train SVG in Kobbo brand harmony */}
              <svg
                width="64"
                height="44"
                viewBox="0 0 64 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm sm:h-[48px] sm:w-[70px]"
              >
                {/* Smokestack / Chimney */}
                <rect x="36" y="4" width="7" height="14" rx="2" fill="#16a34a" />
                <rect x="34" y="2" width="11" height="4" rx="1.5" fill="#ffc700" />
                <circle cx="39.5" cy="10" r="1.5" fill="#ffc700" />

                {/* Locomotive Green Engine Front */}
                <path
                  d="M26 16H48C51.3137 16 54 18.6863 54 22V32H26V16Z"
                  fill="#16a34a"
                />
                <circle cx="48" cy="24" r="2.5" fill="#fff8e8" />

                {/* Locomotive Purple Cabin */}
                <rect x="6" y="10" width="22" height="22" rx="3" fill="#843D9E" />

                {/* Kobbo Yellow Roof */}
                <path
                  d="M4 10C4 8.89543 4.89543 8 6 8H28C29.1046 8 30 8.89543 30 10V11H4V10Z"
                  fill="#ffc700"
                />

                {/* Cabin Window */}
                <rect
                  x="11"
                  y="14"
                  width="12"
                  height="10"
                  rx="2"
                  fill="#fff8e8"
                  stroke="#ffc700"
                  strokeWidth="1.5"
                />

                {/* Train Floor Base Plate */}
                <rect x="3" y="31" width="54" height="3.5" rx="1.5" fill="#1f1f1f" />

                {/* Front Buffer / Hitch */}
                <rect x="54" y="28" width="4" height="4" rx="1" fill="#ffc700" />

                {/* Wheel 1 (Rear) */}
                <g className="animate-train-wheel" style={{ transformOrigin: "14px 34px" }}>
                  <circle cx="14" cy="34" r="6.5" fill="#e07a2f" stroke="#1f1f1f" strokeWidth="1" />
                  <circle cx="14" cy="34" r="2.5" fill="#ffc700" />
                  <line x1="14" y1="28" x2="14" y2="40" stroke="#fff8e8" strokeWidth="0.8" />
                  <line x1="8" y1="34" x2="20" y2="34" stroke="#fff8e8" strokeWidth="0.8" />
                </g>

                {/* Wheel 2 (Middle) */}
                <g className="animate-train-wheel" style={{ transformOrigin: "31px 34px" }}>
                  <circle cx="31" cy="34" r="6.5" fill="#e07a2f" stroke="#1f1f1f" strokeWidth="1" />
                  <circle cx="31" cy="34" r="2.5" fill="#ffc700" />
                  <line x1="31" y1="28" x2="31" y2="40" stroke="#fff8e8" strokeWidth="0.8" />
                  <line x1="25" y1="34" x2="37" y2="34" stroke="#fff8e8" strokeWidth="0.8" />
                </g>

                {/* Wheel 3 (Front) */}
                <g className="animate-train-wheel" style={{ transformOrigin: "47px 34px" }}>
                  <circle cx="47" cy="34" r="6.5" fill="#e07a2f" stroke="#1f1f1f" strokeWidth="1" />
                  <circle cx="47" cy="34" r="2.5" fill="#ffc700" />
                  <line x1="47" y1="28" x2="47" y2="40" stroke="#fff8e8" strokeWidth="0.8" />
                  <line x1="41" y1="34" x2="53" y2="34" stroke="#fff8e8" strokeWidth="0.8" />
                </g>
              </svg>
            </div>
          </div>

          {/* Railway track, kept without the section's bottom border. */}
          <div className="absolute bottom-2.5 inset-x-0 sm:bottom-3">
            <div
              className="h-2 w-full opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #c7ba9f 0, #c7ba9f 3px, transparent 3px, transparent 16px)",
              }}
            />
            <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-stone-400 via-kobbo-black/70 to-stone-400 shadow-xs" />
          </div>
        </div>
      </div>
    </section>
  );
}
