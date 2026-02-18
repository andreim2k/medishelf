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
        <linearGradient id="cross-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#logo-gradient)" strokeWidth="1.5" fill="none"/>
      <path
        d="M12 6V18"
        stroke="url(#cross-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 12H18"
        stroke="url(#cross-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
