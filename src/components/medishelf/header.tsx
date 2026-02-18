"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, BarChart2, PanelLeft } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";

const navItems = [
  { href: "/", label: "Panou de control", icon: Home },
  { href: "/inventory", label: "Inventar", icon: Package },
  { href: "/reports", label: "Rapoarte", icon: BarChart2 },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Comută Meniu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex items-center gap-3 text-lg font-semibold"
            >
              <LogoIcon className="h-7 w-7" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Pillventory
              </span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                  pathname === item.href && "text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="hidden items-center gap-2 sm:flex">
        <LogoIcon className="h-7 w-7" />
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Pillventory
        </div>
      </div>
      
      <Link href="/" className="flex items-center gap-2 sm:hidden">
        <LogoIcon className="h-6 w-6" />
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          Pillventory
        </div>
      </Link>

      <div className="flex flex-1 items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
