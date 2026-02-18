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
      <title>FluxCore Logo</title>
      <defs>
        <linearGradient id="flux-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#06b6d4" }} />
          <stop offset="50%" style={{ stopColor: "#3b82f6" }} />
          <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
        </linearGradient>
        <linearGradient id="flux-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#f59e0b" }} />
          <stop offset="100%" style={{ stopColor: "#ec4899" }} />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer hexagon ring */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="url(#flux-gradient-1)"
        strokeWidth="1.5"
        fill="none"
        filter="url(#glow)"
      />
      
      {/* Inner core - abstract cross/plus shape */}
      <path
        d="M16 8V24"
        stroke="url(#flux-gradient-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <path
        d="M8 16H24"
        stroke="url(#flux-gradient-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      
      {/* Center dot */}
      <circle
        cx="16"
        cy="16"
        r="3"
        fill="url(#flux-gradient-2)"
        filter="url(#glow)"
      />
      
      {/* Orbital rings */}
      <ellipse
        cx="16"
        cy="16"
        rx="10"
        ry="4"
        fill="none"
        stroke="url(#flux-gradient-2)"
        strokeWidth="0.5"
        opacity="0.4"
        transform="rotate(45 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="10"
        ry="4"
        fill="none"
        stroke="url(#flux-gradient-2)"
        strokeWidth="0.5"
        opacity="0.4"
        transform="rotate(-45 16 16)"
      />
    </svg>
  );
}
