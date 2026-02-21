"use client";
import React from "react";
import "./globals.css";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/medishelf/sidebar";
import { Header } from "@/components/medishelf/header";
import { FirebaseClientProvider } from "@/firebase";
import { AuthGuard } from "@/components/auth/auth-guard";

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
        <title>mediShelf</title>
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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <FirebaseClientProvider>
            {isLoginPage ? (
              <React.Fragment key="login-content">{children}</React.Fragment>
            ) : (
              <AuthGuard key="auth-guard">
                <>
                  {/* ── Fixed ambient gradient background (before orbs, z-index:-1) ── */}
                  <div className="bg-gradient-ambient" aria-hidden="true" />

                  {/* ── Floating ambient orbs ── */}
                  {/* Multi-stop gradients simulate the soft glow without filter:blur,
                      which was blocking backdrop-filter on the header */}
                  <div
                    className="bg-orb animate-float"
                    style={{
                      width: "60vw",
                      height: "60vw",
                      maxWidth: "900px",
                      maxHeight: "900px",
                      top: "-20%",
                      left: "-15%",
                      background:
                        "radial-gradient(circle, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), calc(var(--orb-opacity, 0.18) * 0.7)) 0%, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), calc(var(--orb-opacity, 0.18) * 0.3)) 40%, transparent 70%)",
                      animationDuration: "9s",
                    }}
                  />
                  <div
                    className="bg-orb animate-float-delayed"
                    style={{
                      width: "55vw",
                      height: "55vw",
                      maxWidth: "800px",
                      maxHeight: "800px",
                      top: "5%",
                      right: "-12%",
                      background:
                        "radial-gradient(circle, rgba(var(--glow-accent-r, 6), var(--glow-accent-g, 214), var(--glow-accent-b, 245), calc(var(--orb-opacity, 0.18) * 0.6)) 0%, rgba(var(--glow-accent-r, 6), var(--glow-accent-g, 214), var(--glow-accent-b, 245), calc(var(--orb-opacity, 0.18) * 0.2)) 45%, transparent 72%)",
                      animationDuration: "12s",
                    }}
                  />
                  <div
                    className="bg-orb animate-float-slow"
                    style={{
                      width: "50vw",
                      height: "50vw",
                      maxWidth: "700px",
                      maxHeight: "700px",
                      bottom: "0%",
                      left: "25%",
                      background:
                        "radial-gradient(circle, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), calc(var(--orb-opacity, 0.18) * 0.45)) 0%, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), calc(var(--orb-opacity, 0.18) * 0.15)) 50%, transparent 75%)",
                      animationDuration: "15s",
                    }}
                  />
                  <div
                    className="bg-orb animate-float"
                    style={{
                      width: "45vw",
                      height: "45vw",
                      maxWidth: "600px",
                      maxHeight: "600px",
                      bottom: "10%",
                      right: "5%",
                      background:
                        "radial-gradient(circle, rgba(var(--glow-accent-r, 6), var(--glow-accent-g, 214), var(--glow-accent-b, 245), calc(var(--orb-opacity, 0.18) * 0.4)) 0%, rgba(var(--glow-accent-r, 6), var(--glow-accent-g, 214), var(--glow-accent-b, 245), calc(var(--orb-opacity, 0.18) * 0.1)) 50%, transparent 75%)",
                      animationDuration: "11s",
                      animationDelay: "3s",
                    }}
                  />

                  {/* ── App shell ── */}
                  <div className="relative w-full">
                    <Sidebar />
                    <div className="sm:pl-16 pt-16 min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
                        {children}
                      </main>
                      <footer className="p-4 text-center text-xs text-muted-foreground">
                        <p>&copy; 2026 by Techware. All rights reserved.</p>
                      </footer>
                    </div>
                  </div>
                </>
              </AuthGuard>
            )}
            <Toaster key="toaster" />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
