import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[hsl(var(--primary))]", className)}
    >
      <title>medVentory Logo</title>
      
      {/* Pill organizer box */}
      <rect
        x="3"
        y="3"
        width="22"
        height="22"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      
      {/* Cross in center */}
      <path
        d="M14 8V20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 14H20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Center dot */}
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}
