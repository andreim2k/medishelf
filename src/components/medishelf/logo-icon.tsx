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
        <linearGradient id="pill-grad-v2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Decorative ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="#6366f1"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />

      {/* Main capsule pill body - using path instead of rotated rect for better mobile support */}
      <path
        d="M22 6 C26 10 26 22 22 26 C18 30 10 30 6 26 C2 22 2 10 6 6 C10 2 18 2 22 6 Z"
        fill="url(#pill-grad-v2)"
      />

      {/* Center line of capsule */}
      <line
        x1="9"
        y1="9"
        x2="19"
        y2="23"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Highlight */}
      <ellipse
        cx="11"
        cy="9"
        rx="3"
        ry="5"
        transform="rotate(45 11 9)"
        fill="rgba(255,255,255,0.2)"
      />
    </svg>
  );
}
