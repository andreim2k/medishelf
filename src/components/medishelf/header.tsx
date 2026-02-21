
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, BarChart2, PanelLeft, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Panou de control", icon: Home },
  { href: "/inventory", label: "Inventar", icon: Package },
  { href: "/reports", label: "Rapoarte", icon: BarChart2 },
];

export function Header() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    if (auth) {
      signOut(auth).catch((error) => {
        console.error("Sign out failed:", error);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-a putut efectua deconectarea.",
        });
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 px-6 glass-header">
      {/* Mobile menu trigger */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Comută Meniu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-xs glass-sidebar"
        >
          <SheetTitle className="sr-only">Meniu navigare</SheetTitle>
          <nav className="grid gap-6 text-lg font-medium pt-4">
            <Link
              href="/"
              className="group flex items-center gap-3 text-lg font-semibold"
              onClick={() => setIsSheetOpen(false)}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,214,245,0.15))",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 0 16px rgba(168,85,247,0.2)",
                }}
              >
                <LogoIcon className="h-5 w-5" />
              </div>
              <span
                className="gradient-text font-bold tracking-tight text-xl"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                mediShelf
              </span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-3 py-2 rounded-xl transition-all duration-300",
                  pathname === item.href
                    ? "nav-glow-active text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/8"
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop logo */}
      <div className="hidden items-center gap-3 sm:flex">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,214,245,0.15))",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 0 16px rgba(168,85,247,0.2)",
          }}
        >
          <LogoIcon className="h-4 w-4" />
        </div>
        <div
          className="gradient-text text-xl font-bold tracking-tight"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          mediShelf
        </div>
      </div>

      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 sm:hidden">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,214,245,0.15))",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <LogoIcon className="h-4 w-4" />
        </div>
        <div
          className="gradient-text text-lg font-bold tracking-tight"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          mediShelf
        </div>
      </Link>

      {/* Right side actions */}
      <div className="flex flex-1 items-center justify-end gap-2">
        {user && (
          <Avatar
            className="h-8 w-8 avatar-glow cursor-pointer transition-transform hover:scale-105"
          >
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback
              className="text-xs font-semibold"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,214,245,0.2))",
                color: "hsl(var(--primary))",
              }}
            >
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Deconectare"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </div>
    </header>
  );
}
