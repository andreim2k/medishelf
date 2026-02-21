import type { SVGProps } from "react";

export const InhalerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 10C14.2091 10 16 8.20914 16 6V3H8V6C8 8.20914 9.79086 10 12 10Z"
      stroke="hsl(var(--success))"
      strokeWidth="2"
      fill="hsl(var(--success))"
      fillOpacity="0.2"
    />
    <path
      d="M16 10v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-9"
      stroke="hsl(var(--success))"
      strokeWidth="2"
    />
  </svg>
);
