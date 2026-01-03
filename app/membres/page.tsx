"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/use-user-data"
import { Loader2 } from "lucide-react"

/**
 * Page /membres - Redirige selon le rôle de l'utilisateur
 * - Admin -> /admin
 * - Membre simple -> / (accueil)
 * - Non connecté -> /connexion
 */
export default function MembresPage() {
  const { user, isAdmin, loading } = useUserData()
  const router = useRouter()

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (loading) return

    // Non connecté -> rediriger vers connexion
    if (!user) {
      router.replace("/connexion")
      return
    }

    // Admin -> rediriger vers admin
    if (isAdmin) {
      router.replace("/admin")
      return
    }

    // Membre simple -> rediriger vers accueil
    router.replace("/")
  }, [user, isAdmin, loading, router])

  // Afficher un loader pendant la redirection
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  )
}
