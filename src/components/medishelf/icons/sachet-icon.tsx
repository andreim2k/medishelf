import type { SVGProps } from "react";

export const SachetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 3L19 4V20L5 19V3Z"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--primary))"
      fillOpacity="0.2"
    />
    <path
      d="M10 8L14 12"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8L10 12"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
