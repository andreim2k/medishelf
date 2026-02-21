import { cn } from "@/lib/utils";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[hsl(var(--primary))]", className)}
    >
      <title>mediShelf Logo</title>
      <path
        d="M14 2.5C14 2.5 24 4.5 24 10.5V17.5C24 19.9853 22.9853 22 20.5 22H7.5C5.01472 22 4 19.9853 4 17.5V10.5C4 4.5 14 2.5 14 2.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M14 11V17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M11 14H17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
