import type { SVGProps } from "react";

export const SuppositoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="9"
      y="9"
      width="6"
      height="13"
      rx="3"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      fill="hsl(var(--primary))"
      fillOpacity="0.2"
    />
    <path
      d="M12 2L15 9H9L12 2Z"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      fill="hsl(var(--primary))"
      fillOpacity="0.2"
    />
  </svg>
);
