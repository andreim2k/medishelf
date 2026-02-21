"use client";
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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
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
                {/* ── Floating ambient orbs ── */}
                <div
                  className="bg-orb animate-float"
                  style={{
                    width: "45vw",
                    height: "45vw",
                    maxWidth: "700px",
                    maxHeight: "700px",
                    top: "-15%",
                    left: "-10%",
                    background: "radial-gradient(circle, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), var(--orb-opacity, 0.18)) 0%, transparent 70%)",
                    animationDuration: "9s",
                  }}
                />
                <div
                  className="bg-orb animate-float-delayed"
                  style={{
                    width: "40vw",
                    height: "40vw",
                    maxWidth: "600px",
                    maxHeight: "600px",
                    top: "10%",
                    right: "-8%",
                    background: "radial-gradient(circle, rgba(var(--glow-accent-r, 6), var(--glow-accent-g, 214), var(--glow-accent-b, 245), calc(var(--orb-opacity, 0.18) * 0.8)) 0%, transparent 70%)",
                    animationDuration: "12s",
                  }}
                />
                <div
                  className="bg-orb animate-float-slow"
                  style={{
                    width: "35vw",
                    height: "35vw",
                    maxWidth: "500px",
                    maxHeight: "500px",
                    bottom: "5%",
                    left: "30%",
                    background: "radial-gradient(circle, rgba(var(--glow-primary-r, 168), var(--glow-primary-g, 85), var(--glow-primary-b, 247), calc(var(--orb-opacity, 0.18) * 0.6)) 0%, transparent 70%)",
                    animationDuration: "15s",
                  }}
                />
                <div
                  className="bg-orb animate-float"
                  style={{
                    width: "30vw",
                    height: "30vw",
                    maxWidth: "400px",
                    maxHeight: "400px",
                    bottom: "15%",
                    right: "10%",
                    background: "radial-gradient(circle, rgba(var(--glow-accent-r, 6), var(--glow-accent-g, 214), var(--glow-accent-b, 245), calc(var(--orb-opacity, 0.18) * 0.5)) 0%, transparent 70%)",
                    animationDuration: "11s",
                    animationDelay: "3s",
                  }}
                />

                {/* ── App shell ── */}
                <div className="relative flex min-h-screen w-full flex-col">
                  <Sidebar />
                  <div className="flex flex-col sm:gap-4 sm:pb-4 sm:pl-16">
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
