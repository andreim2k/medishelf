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
        <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="secondary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Abstract geometric container - hexagon shell */}
      <path
        d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
        stroke="url(#primary-grad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      {/* Central pill organizer grid - 2x2 arrangement */}
      {/* Top-left compartment */}
      <rect
        x="9"
        y="8"
        width="5"
        height="5"
        rx="1"
        fill="none"
        stroke="url(#secondary-grad)"
        strokeWidth="1.5"
      />
      <circle cx="11.5" cy="10.5" r="1.2" fill="url(#secondary-grad)" />

      {/* Top-right compartment */}
      <rect
        x="18"
        y="8"
        width="5"
        height="5"
        rx="1"
        fill="none"
        stroke="url(#accent-grad)"
        strokeWidth="1.5"
      />
      <rect
        x="19"
        y="9.5"
        width="3"
        height="2"
        rx="1"
        fill="url(#accent-grad)"
      />

      {/* Bottom-left compartment */}
      <rect
        x="9"
        y="17"
        width="5"
        height="5"
        rx="1"
        fill="none"
        stroke="url(#primary-grad)"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 19.5 L13 19.5 M11.75 18.5 L11.75 20.5"
        stroke="url(#primary-grad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Bottom-right compartment - empty with checkmark */}
      <rect
        x="18"
        y="17"
        width="5"
        height="5"
        rx="1"
        fill="none"
        stroke="#10b981"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <path
        d="M19.5 20 L21 21.5 L23.5 19"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center connecting node */}
      <circle cx="16" cy="16" r="1.5" fill="#6366f1" filter="url(#soft-glow)" />

      {/* Orbital accent lines */}
      <path
        d="M16 5 Q22 8 22 16"
        stroke="url(#primary-grad)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="2 1"
      />
      <path
        d="M16 27 Q10 24 10 16"
        stroke="url(#secondary-grad)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="2 1"
      />
    </svg>
  );
}
