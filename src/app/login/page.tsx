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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full max-w-[380px] flex-col items-center justify-center space-y-6 rounded-xl border bg-card/60 p-8 shadow-lg backdrop-blur-xl dark:bg-card/20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <LogoIcon className="h-12 w-12" />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Bun venit la medVentory
            </h1>
            <p className="text-sm text-muted-foreground">
              Autentifică-te pentru a-ți gestiona inventarul
            </p>
          </div>
        </div>
        <Button onClick={handleSignIn} className="w-full" disabled={isSigningIn}>
          {isSigningIn ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 266.2 0 129.8 109.8 20 244 20c74.3 0 134.3 29.3 179.8 72.8l-65.2 63.3c-23.3-22.5-55.4-36-94.6-36-71.3 0-129.8 58.7-129.8 130.3s58.5 130.3 129.8 130.3c76.3 0 115.3-51.5 119.5-77.9H244V261.8h244z"
              ></path>
            </svg>
          )}
          Autentificare cu Google
        </Button>
      </div>
    </div>
  );
}
