"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ro">
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">
            A apărut o eroare critică
          </h2>
          <p className="mt-2 text-muted-foreground">
            A avut loc o eroare neașteptată. Vă rugăm să reîncărcați pagina.
          </p>
          {error.message && (
            <p className="mt-2 text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
          <Button onClick={reset} className="mt-4">
            Reîncarcă pagina
          </Button>
        </div>
      </body>
    </html>
  );
}
