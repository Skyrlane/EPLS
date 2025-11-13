"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AccessDeniedPage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="flex items-center justify-center h-24 w-24 rounded-full bg-red-50 text-red-600 mb-6">
        <Shield className="h-12 w-12" />
      </div>

      <h1 className="text-3xl font-bold mb-2">Accès refusé</h1>

      <p className="text-muted-foreground mb-8 max-w-md">
        Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page.
      </p>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Button asChild variant="default" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Accueil
          </Link>
        </Button>

        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      {user && (
        <div className="mt-8 border-t pt-8 w-full max-w-md">
          <p className="text-sm text-muted-foreground mb-4">
            Vous êtes connecté en tant que <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter l&apos;administrateur.
          </p>
        </div>
      )}
    </div>
  )
}
