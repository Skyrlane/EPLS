import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LogOut } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin | EPLS",
  description: "Interface d'administration EPLS",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {/* Header admin simple */}
            <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-50">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/" className="text-xl font-bold">
                    EPLS Admin
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/membres">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Link>
                  </Button>
                </div>
              </div>
            </header>

            {/* Contenu principal */}
            <main className="min-h-[calc(100vh-120px)]">
              {children}
            </main>

            {/* Footer simple */}
            <footer className="border-t bg-gray-50 dark:bg-slate-900 mt-12">
              <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} EPLS - Interface d'administration
              </div>
            </footer>

            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
