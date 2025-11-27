import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"
import { headers } from "next/headers"

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
  // Vérifier si on est sur une route admin
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdminRoute = pathname.startsWith('/admin')

  // Debug en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[ROOT LAYOUT] pathname:', pathname, 'isAdminRoute:', isAdminRoute)
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        {isAdminRoute ? (
          // Routes admin : pas de ClientLayoutWrapper (le layout admin gère tout)
          children
        ) : (
          // Routes normales : avec Navigation, Footer, etc.
          <ClientLayoutWrapper showFixedServiceInfo={SHOW_FIXED_SERVICE_INFO}>
            {children}
          </ClientLayoutWrapper>
        )}
      </body>
    </html>
  )
} 