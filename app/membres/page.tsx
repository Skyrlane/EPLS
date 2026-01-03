"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LogOutIcon } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MembresPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    // Attendre un peu avant de rediriger pour laisser le temps à l'auth de se synchroniser
    // Cela évite la redirection immédiate après connexion
    const timer = setTimeout(() => {
      if (!loading && !user) {
        router.push("/connexion")
      }
    }, 1000); // Délai de 1 seconde

    return () => clearTimeout(timer);
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Déconnexion réussie",
        variant: "default",
      })
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setError("Une erreur est survenue lors de la déconnexion.")
    }
  }

  // Si l'authentification est en cours de chargement, afficher un message de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement de l&apos;espace membre...</p>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection sera gérée par useEffect)
  if (!user) {
    return null
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Espace Membres</h1>
              {/* Breadcrumbs */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link href="/" className="text-primary hover:text-primary/80">
                      Accueil
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-400 dark:text-gray-400">/</span>
                      <span className="text-gray-700 dark:text-gray-200">Espace Membres</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-100">
              <LogOutIcon className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenue dans l&apos;espace membres</CardTitle>
                <CardDescription>
                  Cet espace est réservé aux membres de l&apos;Église Protestante Libre de Strasbourg.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Vous êtes connecté en tant que <strong>{user?.displayName || user?.email}</strong>.
                </p>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Accès Administration</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Gestion des annonces et du contenu du site
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link
                      href="/admin/annonces"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les annonces
                    </Link>
                    <Link
                      href="/admin/echos"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les échos
                    </Link>
                    <Link
                      href="/admin/messages"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les messages
                    </Link>
                    <Link
                      href="/admin/planning-cultes"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer le planning des cultes
                    </Link>
                    <Link
                      href="/admin/blog"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les articles de blog
                    </Link>
                    <Link
                      href="/admin/photos"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer la galerie photos
                    </Link>
                    <Link
                      href="/admin/hero-image"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer l'image d'accueil
                    </Link>
                    <Link
                      href="/admin/images-site"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les images du site
                    </Link>
                    <Link
                      href="/admin/missionnaires"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les missionnaires
                    </Link>
                    <Link
                      href="/admin/sites-amis"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les sites amis
                    </Link>
                    <Link
                      href="/admin/anniversaires"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer les anniversaires
                    </Link>
                    <Link
                      href="/admin/carnet-adresses"
                      className="block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      → Gérer le carnet d'adresses
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
