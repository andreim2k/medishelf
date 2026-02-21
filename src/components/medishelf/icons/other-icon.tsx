import type { SVGProps } from "react";

export const OtherIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
    <path
      d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
