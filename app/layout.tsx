import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"
import { SkipToContent } from "@/components/skip-to-content"
import Navigation from "@/components/navigation"
import { ServiceInfoProvider } from "@/lib/providers/service-info-provider"
import { FixedServiceInfo } from "@/components/home/fixed-service-info"
import { CookieBanner } from "@/components/ui/cookie-banner"

const inter = Inter({ subsets: ["latin"] })

// Vous pouvez activer ou désactiver l'affichage de l'info de culte fixe ici
const SHOW_FIXED_SERVICE_INFO = false;

export const metadata: Metadata = {
  title: {
    template: "%s | EPLS - Église Protestante Libre de Strasbourg",
    default: "EPLS - Église Protestante Libre de Strasbourg",
  },
  description: "Site officiel de l'Église Protestante Libre de Strasbourg (EPLS)",
  keywords: ["église", "protestante", "libre", "strasbourg", "évangélique", "chrétien", "foi", "EPLS"],
  authors: [{ name: "EPLS" }],
  creator: "EPLS",
  publisher: "EPLS",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.epls.fr",
    title: "EPLS - Église Protestante Libre de Strasbourg",
    description: "Site officiel de l'Église Protestante Libre de Strasbourg (EPLS)",
    siteName: "EPLS - Église Protestante Libre de Strasbourg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ServiceInfoProvider>
              <SkipToContent />
              <Navigation />
              <main id="content" className="min-h-screen pt-16">
                {children}
              </main>
              <Footer />
              <Toaster />
              {SHOW_FIXED_SERVICE_INFO && <FixedServiceInfo />}
              <CookieBanner />
            </ServiceInfoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 