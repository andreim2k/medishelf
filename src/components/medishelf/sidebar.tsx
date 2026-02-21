"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, BarChart2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const navItems = [
  { href: "/", label: "Panou de control", icon: Home },
  { href: "/inventory", label: "Inventar", icon: Package },
  { href: "/reports", label: "Rapoarte", icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col glass-sidebar sm:flex">
      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-2 px-2 py-4">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                      isActive
                        ? "nav-glow-active"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/8 hover:shadow-[0_0_12px_rgba(168,85,247,0.1)]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[1.1rem] w-[1.1rem] transition-all duration-300",
                        isActive ? "scale-110" : ""
                      )}
                    />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="glass border-white/15 text-foreground backdrop-blur-xl"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Bottom gradient line */}
      <div
        className="mx-auto mt-auto mb-4 h-16 w-0.5 rounded-full"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), 0.4), transparent)",
        }}
      />
    </aside>
  );
}
