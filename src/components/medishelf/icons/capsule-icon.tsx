import type { SVGProps } from "react";

export const CapsuleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15V9Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="6"
      y1="12"
      x2="18"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
