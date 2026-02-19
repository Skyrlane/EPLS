import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
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
        {children}
      </body>
    </html>
  )
} 