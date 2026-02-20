"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive">
          A apărut o eroare
        </h2>
        <p className="mt-2 text-muted-foreground">
          Ceva nu a funcționat corect.
        </p>
        {error.message && (
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </p>
        )}
        <Button onClick={reset} className="mt-4">
          Încearcă din nou
        </Button>
      </div>
    </div>
  );
}
