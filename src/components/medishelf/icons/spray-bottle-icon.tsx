import type { SVGProps } from "react";

export const SprayBottleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="7"
      y="9"
      width="10"
      height="13"
      rx="2"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      fill="hsl(var(--accent))"
      fillOpacity="0.2"
    />
    <path d="M12 9V5" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 3h4" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M16 5H20"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 3v4"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
