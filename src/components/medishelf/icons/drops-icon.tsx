import type { SVGProps } from "react";

export const DropsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 22C12 22 4 16 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 16 12 22 12 22Z"
      stroke="hsl(var(--accent))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--accent))"
      fillOpacity="0.2"
    />
  </svg>
);
