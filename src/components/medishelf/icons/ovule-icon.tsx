import type { SVGProps } from "react";

export const OvuleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse
      cx="12"
      cy="12"
      rx="6"
      ry="8"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
