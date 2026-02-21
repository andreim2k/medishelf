import type { SVGProps } from "react";

export const LiquidBottleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 21V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v15"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--accent))"
      fillOpacity="0.2"
    />
    <path
      d="M5 21h14"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
     <path
      d="M9 3h6"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
