import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <title>Pillventory Logo</title>
      <defs>
        <linearGradient id="pill-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="pill-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="pill-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main capsule pill body - rotated */}
      <rect
        x="8"
        y="6"
        width="16"
        height="20"
        rx="8"
        fill="url(#pill-body)"
        transform="rotate(-30 16 16)"
        filter="url(#pill-glow)"
      />

      {/* Pill shine/highlight */}
      <ellipse
        cx="12"
        cy="10"
        rx="3"
        ry="6"
        fill="url(#pill-shine)"
        transform="rotate(-30 12 10)"
      />

      {/* Decorative ring around pill */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="#10b981"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* Small sparkle accent */}
      <path
        d="M24 8 L25 6 L26 8 L28 9 L26 10 L25 12 L24 10 L22 9 Z"
        fill="#fbbf24"
        opacity="0.8"
      />
    </svg>
  );
}
