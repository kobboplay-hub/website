"use client";

import { useEffect, useRef } from "react";

interface Waypoint {
  x: number;
  y: number;
}

// ══════════════════════════════════════════════════════════════
// FLIGHT PATH WAYPOINTS (Normalized 0..1 of container)
// ══════════════════════════════════════════════════════════════

// Desktop Butterfly 1 (Primary - Golden Kobbo Butterfly)
// Weaves from left text -> CTA -> across center -> girl's toys -> badge -> lower loop back
const DESKTOP_WAYPOINTS_1: Waypoint[] = [
  { x: 0.12, y: 0.28 }, // 1. Top-left near headline
  { x: 0.26, y: 0.20 }, // 2. Arcing gracefully over headline
  { x: 0.35, y: 0.46 }, // 3. Dipping down to highlight CTA button
  { x: 0.48, y: 0.32 }, // 4. Sweeping up through center transition
  { x: 0.66, y: 0.42 }, // 5. Gliding across the girl playing with toys
  { x: 0.82, y: 0.22 }, // 6. Ascending toward the Stage-Based Learning badge
  { x: 0.88, y: 0.35 }, // 7. Soft loop around upper-right
  { x: 0.65, y: 0.62 }, // 8. Lower return arc across image bottom
  { x: 0.38, y: 0.68 }, // 9. Gliding below trust badges
  { x: 0.16, y: 0.52 }, // 10. Swooping back up on the left
];

// Desktop Butterfly 2 (Companion - Soft Amber Butterfly)
// Playfully circles between the right image, center transition, and lower area
const DESKTOP_WAYPOINTS_2: Waypoint[] = [
  { x: 0.74, y: 0.52 }, // Starts near child's kit
  { x: 0.58, y: 0.38 }, // Drifts left toward center
  { x: 0.42, y: 0.26 }, // Flutters playfully near description
  { x: 0.28, y: 0.44 }, // Glides past CTA
  { x: 0.34, y: 0.64 }, // Curves down towards trust badges
  { x: 0.56, y: 0.68 }, // Glides across lower middle
  { x: 0.84, y: 0.50 }, // Loops along right edge
  { x: 0.78, y: 0.28 }, // Swoops toward upper right badge area
];

// Mobile Butterfly (Single - Soft curved S-flight across visible areas)
const MOBILE_WAYPOINTS: Waypoint[] = [
  { x: 0.16, y: 0.14 }, // Top-left near review pill
  { x: 0.54, y: 0.18 }, // Arcing across headline
  { x: 0.80, y: 0.26 }, // Near badge top-right
  { x: 0.70, y: 0.44 }, // Dipping past CTA button
  { x: 0.46, y: 0.58 }, // Swooping into lower photo area
  { x: 0.68, y: 0.72 }, // Arcing near toys
  { x: 0.26, y: 0.64 }, // Gliding back up the left
  { x: 0.20, y: 0.38 }, // Rising past trust points
];

// ══════════════════════════════════════════════════════════════
// CATMULL-ROM SPLINE ENGINE (Smooth continuous closed loop)
// ══════════════════════════════════════════════════════════════

function getCatmullRomPoint(
  p0: Waypoint,
  p1: Waypoint,
  p2: Waypoint,
  p3: Waypoint,
  t: number
) {
  const t2 = t * t;
  const t3 = t2 * t;

  const x =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

  const y =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

  const dx =
    0.5 *
    (-p0.x +
      p2.x +
      2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
      3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2);

  const dy =
    0.5 *
    (-p0.y +
      p2.y +
      2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
      3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2);

  return { x, y, dx, dy };
}

function evaluateSplineLoop(
  points: Waypoint[],
  progress: number,
  width: number,
  height: number
) {
  const n = points.length;
  const scaled = (((progress % 1) + 1) % 1) * n;
  const i = Math.floor(scaled);
  const u = scaled - i;

  const p0 = points[(i - 1 + n) % n];
  const p1 = points[i % n];
  const p2 = points[(i + 1) % n];
  const p3 = points[(i + 2) % n];

  const res = getCatmullRomPoint(p0, p1, p2, p3, u);
  const px = res.x * width;
  const py = res.y * height;
  const angle =
    (Math.atan2(res.dy * height, res.dx * width) * 180) / Math.PI;

  return { x: px, y: py, angle };
}

// ══════════════════════════════════════════════════════════════
// PARTICLE TRAIL TYPES & DRAWING
// ══════════════════════════════════════════════════════════════

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  color: string;
  type: "star" | "sparkle" | "dust";
  rotation: number;
  rotSpeed: number;
}

const SPARKLE_PALETTE = [
  "#FFC700", // Kobbo signature yellow
  "#FFAE00", // Warm amber
  "#FFE58F", // Light soft gold
  "#FFFFFF", // Pure star glare
  "#F59E0B", // Honey amber
];

function drawSparkleStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  alpha: number,
  color: string,
  rot: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.beginPath();
  const innerR = r * 0.22;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const nextAngle = angle + Math.PI / 4;
    if (i === 0) {
      ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    } else {
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.lineTo(Math.cos(nextAngle) * innerR, Math.sin(nextAngle) * innerR);
  }
  ctx.closePath();
  ctx.fill();

  // Brilliant center core
  ctx.fillStyle = "#FFFFFF";
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.95));
  ctx.beginPath();
  ctx.arc(0, 0, innerR * 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFairyDust(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  alpha: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ══════════════════════════════════════════════════════════════
// 3D BUTTERFLY VECTOR SVG (Realistic Flapping Wings)
// ══════════════════════════════════════════════════════════════

function ButterflySvg({
  primaryColor = "#FFC700",
  secondaryColor = "#FFAE00",
  accentColor = "#FFE58F",
  bodyColor = "#422006",
  scale = 1,
}: {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bodyColor?: string;
  scale?: number;
}) {
  return (
    <div
      style={{
        width: 42 * scale,
        height: 38 * scale,
        transformOrigin: "center center",
      }}
      className="relative drop-shadow-[0_6px_10px_rgba(217,119,6,0.22)] select-none pointer-events-none"
    >
      <svg
        viewBox="0 0 42 38"
        fill="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient
            id={`wing-grad-${primaryColor.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.95" />
            <stop offset="65%" stopColor={secondaryColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* ── Left Wing Group (Flaps via 3D rotateY) ── */}
        <g className="animate-wing-left origin-[21px_19px]">
          {/* Forewing */}
          <path
            d="M21 17 C16 9, 8 2, 3 6 C-1 9, 1 17, 7 21 C12 24, 18 20, 21 17 Z"
            fill={`url(#wing-grad-${primaryColor.replace("#", "")})`}
          />
          {/* Forewing inner pattern */}
          <path
            d="M17 15 C13 10, 8 5, 5 8 C3 10, 4 15, 8 18 C11 20, 15 17, 17 15 Z"
            fill="#FFFFFF"
            fillOpacity="0.35"
          />
          {/* Hindwing */}
          <path
            d="M21 20 C16 22, 6 26, 6 32 C6 36, 12 37, 16 33 C19 30, 20 24, 21 20 Z"
            fill={secondaryColor}
            fillOpacity="0.88"
          />
          <circle cx="11" cy="32" r="1.2" fill="#FFFFFF" fillOpacity="0.6" />
        </g>

        {/* ── Right Wing Group (Flaps via 3D rotateY) ── */}
        <g className="animate-wing-right origin-[21px_19px]">
          {/* Forewing */}
          <path
            d="M21 17 C26 9, 34 2, 39 6 C43 9, 41 17, 35 21 C30 24, 24 20, 21 17 Z"
            fill={`url(#wing-grad-${primaryColor.replace("#", "")})`}
          />
          {/* Forewing inner pattern */}
          <path
            d="M25 15 C29 10, 34 5, 37 8 C39 10, 38 15, 34 18 C31 20, 27 17, 25 15 Z"
            fill="#FFFFFF"
            fillOpacity="0.35"
          />
          {/* Hindwing */}
          <path
            d="M21 20 C26 22, 36 26, 36 32 C36 36, 30 37, 26 33 C23 30, 22 24, 21 20 Z"
            fill={secondaryColor}
            fillOpacity="0.88"
          />
          <circle cx="31" cy="32" r="1.2" fill="#FFFFFF" fillOpacity="0.6" />
        </g>

        {/* ── Center Body & Antennae ── */}
        <g>
          {/* Left antenna */}
          <path
            d="M20 10 C18 6, 15 4, 13 5"
            stroke={bodyColor}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <circle cx="12.5" cy="5.2" r="0.9" fill={bodyColor} />

          {/* Right antenna */}
          <path
            d="M22 10 C24 6, 27 4, 29 5"
            stroke={bodyColor}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <circle cx="29.5" cy="5.2" r="0.9" fill={bodyColor} />

          {/* Thorax and abdomen */}
          <ellipse cx="21" cy="19" rx="1.8" ry="7.5" fill={bodyColor} />
          {/* Head */}
          <circle cx="21" cy="11.5" r="2.2" fill={bodyColor} />
          {/* Eye glint */}
          <circle cx="20.3" cy="11" r="0.6" fill="#FFC700" />
          <circle cx="21.7" cy="11" r="0.6" fill="#FFC700" />
        </g>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function HeroButterflyFlight({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const b1Ref = useRef<HTMLDivElement>(null);
  const b2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number | null = null;
    let isVisible = true;
    let frameCount = 0;

    // Dimensions
    let width = container.clientWidth || 1000;
    let height = container.clientHeight || 700;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;

      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Intersection observer to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Particle pool
    const particles: TrailParticle[] = [];
    const maxParticles = variant === "desktop" ? 65 : 32;

    const spawnParticle = (
      x: number,
      y: number,
      angleDeg: number,
      tint: string
    ) => {
      if (particles.length >= maxParticles) {
        particles.shift(); // Remove oldest to maintain cap
      }

      const rad = (angleDeg * Math.PI) / 180;
      // Position particle near the tail of the butterfly (behind flight direction)
      const tailDistance = 16;
      const px =
        x - Math.cos(rad) * tailDistance + (Math.random() - 0.5) * 8;
      const py =
        y - Math.sin(rad) * tailDistance + (Math.random() - 0.5) * 8;

      const isStar = Math.random() > 0.45;
      const color =
        Math.random() > 0.3
          ? tint
          : SPARKLE_PALETTE[
              Math.floor(Math.random() * SPARKLE_PALETTE.length)
            ];

      particles.push({
        x: px,
        y: py,
        vx: -Math.cos(rad) * (0.3 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.5,
        vy: 0.18 + Math.random() * 0.35, // gentle fairy dust fall
        size: isStar ? 3 + Math.random() * 2.8 : 1.4 + Math.random() * 1.8,
        maxLife: 55 + Math.random() * 30, // frames (~1 to 1.5 seconds)
        life: 0,
        color,
        type: isStar ? (Math.random() > 0.5 ? "star" : "sparkle") : "dust",
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
      });
    };

    // Flight durations (seconds for full loop)
    // Primary butterfly: ~15.5s loop; Companion: ~19s loop
    const duration1 = variant === "desktop" ? 15.5 : 14.0;
    const duration2 = 19.0;

    const startTime = performance.now();

    const loop = (currentTime: number) => {
      rafId = requestAnimationFrame(loop);

      if (!isVisible || width === 0 || height === 0) return;

      const elapsed = (currentTime - startTime) / 1000;
      frameCount++;

      // 1. Evaluate Primary Butterfly Position
      const progress1 = (elapsed / duration1) % 1;
      const waypoints1 =
        variant === "desktop" ? DESKTOP_WAYPOINTS_1 : MOBILE_WAYPOINTS;
      const pos1 = evaluateSplineLoop(waypoints1, progress1, width, height);

      // SVG is drawn facing UP (head at top). Tangent angle + 90 aligns head with trajectory.
      const displayAngle1 = pos1.angle + 90;

      if (b1Ref.current) {
        b1Ref.current.style.transform = `translate3d(${pos1.x - 21}px, ${
          pos1.y - 19
        }px, 0) rotate(${displayAngle1}deg)`;
      }

      // Spawn trail particle for Butterfly 1 every 2 frames
      if (frameCount % 2 === 0) {
        spawnParticle(pos1.x, pos1.y, pos1.angle, "#FFC700");
      }

      // 2. Evaluate Companion Butterfly (Desktop only)
      if (variant === "desktop" && b2Ref.current) {
        const progress2 = (elapsed / duration2 + 0.38) % 1; // offset phase
        const pos2 = evaluateSplineLoop(
          DESKTOP_WAYPOINTS_2,
          progress2,
          width,
          height
        );
        const displayAngle2 = pos2.angle + 90;

        b2Ref.current.style.transform = `translate3d(${pos2.x - 17}px, ${
          pos2.y - 15
        }px, 0) rotate(${displayAngle2}deg)`;

        // Spawn softer particle every 3 frames
        if (frameCount % 3 === 0) {
          spawnParticle(pos2.x, pos2.y, pos2.angle, "#F59E0B");
        }
      }

      // 3. Clear and Render Trail Particles
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        // Non-linear fade: bright at start, soft glow, dissolves smoothly
        const alpha = Math.pow(1 - progress, 1.35);

        if (p.type === "dust") {
          drawFairyDust(ctx, p.x, p.y, p.size, alpha, p.color);
        } else {
          drawSparkleStar(
            ctx,
            p.x,
            p.y,
            p.size,
            alpha,
            p.color,
            p.rotation
          );
        }
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-15 overflow-hidden"
    >
      {/* Canvas for sparkling stardust trail */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Butterfly 1: Golden Kobbo Butterfly */}
      <div
        ref={b1Ref}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
      >
        <ButterflySvg
          primaryColor="#FFC700"
          secondaryColor="#FFAE00"
          accentColor="#FFE58F"
          bodyColor="#422006"
          scale={variant === "desktop" ? 1.05 : 0.88}
        />
      </div>

      {/* Butterfly 2: Warm Amber Companion Butterfly (Desktop only) */}
      {variant === "desktop" && (
        <div
          ref={b2Ref}
          className="pointer-events-none absolute left-0 top-0 will-change-transform"
        >
          <ButterflySvg
            primaryColor="#FBBF24"
            secondaryColor="#F59E0B"
            accentColor="#FEF3C7"
            bodyColor="#78350F"
            scale={0.82}
          />
        </div>
      )}
    </div>
  );
}
