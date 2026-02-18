import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <title>Pillventory Logo</title>
      <defs>
        <linearGradient id="pill-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#10b981" }} />
          <stop offset="100%" style={{ stopColor: "#059669" }} />
        </linearGradient>
        <linearGradient id="pill-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#f59e0b" }} />
          <stop offset="100%" style={{ stopColor: "#d97706" }} />
        </linearGradient>
        <linearGradient id="pill-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
          <stop offset="100%" style={{ stopColor: "#2563eb" }} />
        </linearGradient>
      </defs>
      
      {/* Three pills arranged in a triangular formation */}
      {/* Top pill - capsule */}
      <rect
        x="10"
        y="2"
        width="8"
        height="14"
        rx="4"
        fill="url(#pill-grad-1)"
        transform="rotate(15 14 9)"
      />
      <rect
        x="10"
        y="2"
        width="4"
        height="14"
        rx="4"
        fill="#047857"
        transform="rotate(15 14 9)"
        opacity="0.3"
      />
      
      {/* Bottom left pill - round tablet */}
      <circle
        cx="7"
        cy="19"
        r="5"
        fill="url(#pill-grad-2)"
      />
      <circle
        cx="7"
        cy="19"
        r="2"
        fill="#fff"
        opacity="0.4"
      />
      
      {/* Bottom right pill - capsule horizontal */}
      <rect
        x="16"
        y="15"
        width="14"
        height="7"
        rx="3.5"
        fill="url(#pill-grad-3)"
        transform="rotate(-10 23 18.5)"
      />
      <line
        x1="23"
        y1="15"
        x2="23"
        y2="22"
        stroke="#1d4ed8"
        strokeWidth="1"
        transform="rotate(-10 23 18.5)"
        opacity="0.4"
      />
      
      {/* Connection lines between pills - subtle organization */}
      <path
        d="M12 12L9 17"
        stroke="#6b7280"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.3"
      />
      <path
        d="M16 12L21 17"
        stroke="#6b7280"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.3"
      />
    </svg>
  );
}
