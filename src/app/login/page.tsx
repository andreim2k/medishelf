"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/medishelf/logo-icon";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        variant: "destructive",
        title: "Eroare la autentificare",
        description: "Nu s-a putut autentifica cu Google. Verificați conexiunea.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl animate-pulse-glow"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,214,245,0.15))",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient orbs */}
      <div
        className="bg-orb animate-float"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "600px",
          maxHeight: "600px",
          top: "-20%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
        }}
      />
      <div
        className="bg-orb animate-float-delayed"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "500px",
          maxHeight: "500px",
          bottom: "-10%",
          right: "-5%",
          background: "radial-gradient(circle, rgba(6,214,245,0.18) 0%, transparent 70%)",
          animationDuration: "11s",
        }}
      />

      {/* Login card */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center space-y-8 rounded-3xl p-8 animate-scale-in"
        style={{
          background: "rgba(var(--glass-r, 255), var(--glass-g, 255), var(--glass-b, 255), var(--glass-opacity, 0.06))",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(6,214,245,0.6), transparent)",
          }}
        />

        {/* Logo */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,214,245,0.2))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 0 32px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <LogoIcon className="h-8 w-8" />
          </div>
          <div>
            <h1
              className="gradient-text text-3xl font-bold tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              mediShelf
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Organizează-ți medicamentele inteligent.<br />Autentifică-te pentru a continua.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* Sign in button */}
        <Button
          onClick={handleSignIn}
          className="w-full h-12 text-base font-semibold rounded-2xl"
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg
              className="mr-2 h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 266.2 0 129.8 109.8 20 244 20c74.3 0 134.3 29.3 179.8 72.8l-65.2 63.3c-23.3-22.5-55.4-36-94.6-36-71.3 0-129.8 58.7-129.8 130.3s58.5 130.3 129.8 130.3c76.3 0 115.3-51.5 119.5-77.9H244V261.8h244z"
              />
            </svg>
          )}
          {isSigningIn ? "Se conectează..." : "Autentificare cu Google"}
        </Button>
      </div>
      <footer className="absolute bottom-4 w-full text-center text-xs text-muted-foreground">
        <p>&copy; 2026 by Techware. All rights reserved.</p>
      </footer>
    </div>
  );
}
