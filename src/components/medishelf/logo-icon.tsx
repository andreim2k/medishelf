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
      <title>PillVentory Logo</title>
      <defs>
        <linearGradient id="pill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <linearGradient id="pill-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Main capsule pill body - rotated */}
      <rect
        x="8"
        y="6"
        width="16"
        height="20"
        rx="8"
        fill="url(#pill-grad)"
        transform="rotate(-30 16 16)"
      />

      {/* Pill shine/highlight */}
      <ellipse
        cx="12"
        cy="10"
        rx="2.5"
        ry="5"
        fill="url(#pill-shine)"
        transform="rotate(-30 12 10)"
      />

      {/* Center line of capsule */}
      <line
        x1="16"
        y1="5"
        x2="16"
        y2="27"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        transform="rotate(-30 16 16)"
      />

      {/* Decorative ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
