import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <title>MediShelf Logo</title>
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
        </linearGradient>
        <linearGradient id="pill-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="50%" style={{ stopColor: "hsl(var(--accent))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary))" }} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#logo-gradient)" strokeWidth="1.5" fill="none" opacity="0.3"/>
      <path
        d="M7 8C7 7.44772 7.44772 7 8 7H10C10.5523 7 11 7.44772 11 8V16C11 16.5523 10.5523 17 10 17H8C7.44772 17 7 16.5523 7 16V8Z"
        fill="url(#pill-gradient)"
      />
      <circle cx="9" cy="12" r="1.5" fill="white" opacity="0.9"/>
      <path
        d="M13 10C13 9.44772 13.4477 9 14 9H16C16.5523 9 17 9.44772 17 10V14C17 14.5523 16.5523 15 16 15H14C13.4477 15 13 14.5523 13 14V10Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M14 11V13"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
