import type { SVGProps } from "react";

export const CreamTubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 21h16L14 3H10L4 21z"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--accent))"
      fillOpacity="0.2"
    />
    <path
      d="M10 3h4"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
