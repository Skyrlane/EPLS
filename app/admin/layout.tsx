import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { AdminLayoutClient } from "./admin-layout-client"

// FORCER le rendu dynamique pour que le middleware s'exécute
export const dynamic = 'force-dynamic'

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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <AdminLayoutClient>{children}</AdminLayoutClient>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
