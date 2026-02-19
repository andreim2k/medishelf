"use client";
import "./globals.css";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/medishelf/sidebar";
import { Header } from "@/components/medishelf/header";
import { FirebaseClientProvider } from "@/firebase";
import { AuthGuard } from "@/components/auth/auth-guard";

// Since we are using usePathname, we can't export metadata from here.
// We can add a Head component to each page or a wrapper.
// For now, we will remove it.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="ro" suppressHydrationWarning className="dark">
      <head>
        <title>medVentory</title>
        <meta
          name="description"
          content="Organizează-ți medicamentele inteligent."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <FirebaseClientProvider>
            {isLoginPage ? (
              children
            ) : (
              <AuthGuard>
                <div className="flex min-h-screen w-full flex-col bg-muted/40">
                  <Sidebar />
                  <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <Header />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                      {children}
                    </main>
                  </div>
                </div>
              </AuthGuard>
            )}
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
