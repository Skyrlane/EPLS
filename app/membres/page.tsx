"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileIcon, CalendarIcon, UserIcon, LogOutIcon } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlanningTable } from "@/components/planning/PlanningTable"

// Données simulées pour les membres
const churchMembers = [
  { id: 1, name: "Jean Dupont", role: "Ancien", email: "jean.dupont@example.com", phone: "06 XX XX XX XX" },
  { id: 2, name: "Marie Martin", role: "Diacre", email: "marie.martin@example.com", phone: "06 XX XX XX XX" },
  { id: 3, name: "Pierre Durand", role: "Trésorier", email: "pierre.durand@example.com", phone: "06 XX XX XX XX" },
  {
    id: 4,
    name: "Sophie Lefebvre",
    role: "Responsable Jeunesse",
    email: "sophie.lefebvre@example.com",
    phone: "06 XX XX XX XX",
  },
  {
    id: 5,
    name: "Michel Bernard",
    role: "Responsable Louange",
    email: "michel.bernard@example.com",
    phone: "06 XX XX XX XX",
  },
  {
    id: 6,
    name: "Isabelle Petit",
    role: "Responsable École du Dimanche",
    email: "isabelle.petit@example.com",
    phone: "06 XX XX XX XX",
  },
  {
    id: 7,
    name: "François Moreau",
    role: "Responsable Communication",
    email: "francois.moreau@example.com",
    phone: "06 XX XX XX XX",
  },
  {
    id: 8,
    name: "Catherine Dubois",
    role: "Responsable Accueil",
    email: "catherine.dubois@example.com",
    phone: "06 XX XX XX XX",
  },
]

// Données simulées pour les documents
const documents = [
  { id: 1, title: "Compte-rendu AG 2023", category: "administratif", date: "15/03/2023", size: "1.2 MB" },
  { id: 2, title: "Budget prévisionnel 2024", category: "administratif", date: "10/12/2023", size: "850 KB" },
  { id: 3, title: "Planning des services", category: "organisation", date: "05/01/2024", size: "450 KB" },
  { id: 4, title: "Livret de chants", category: "culte", date: "20/02/2024", size: "3.5 MB" },
  { id: 5, title: "Statuts de l'association", category: "administratif", date: "10/05/2020", size: "1.8 MB" },
  { id: 6, title: "Règlement intérieur", category: "administratif", date: "10/05/2020", size: "1.1 MB" },
]

// Données simulées pour les événements
const events = [
  { id: 1, title: "Réunion du conseil", date: "15/04/2024", time: "19h00", location: "Salle du conseil" },
  { id: 2, title: "Formation des moniteurs", date: "22/04/2024", time: "14h30", location: "Salle communautaire" },
  { id: 3, title: "Répétition chorale", date: "18/04/2024", time: "20h00", location: "Temple" },
  { id: 4, title: "Journée de travaux", date: "29/04/2024", time: "09h00", location: "Église" },
  { id: 5, title: "Réunion commission mission", date: "25/04/2024", time: "18h30", location: "Salle du conseil" },
]

export default function MembresPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [searchMembers, setSearchMembers] = useState("")
  const [searchDocuments, setSearchDocuments] = useState("")
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

  // Filtrer les membres en fonction de la recherche
  const filteredMembers = churchMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.role.toLowerCase().includes(searchMembers.toLowerCase()),
  )

  // Filtrer les documents en fonction de la recherche
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchDocuments.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchDocuments.toLowerCase()),
  )

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



          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenue dans l&apos;espace membres</CardTitle>
                <CardDescription>
                  Cet espace est réservé aux membres de l&apos;Église Protestante Libre de Strasbourg.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Vous êtes connecté en tant que <strong>{user?.displayName || user?.email}</strong>. Vous avez accès à l&apos;annuaire des
                  membres, aux documents internes et au calendrier des activités réservées aux membres.
                </p>

                {/* Lien admin si disponible */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Accès Administration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gestion des annonces et du contenu du site
                  </p>
                  <div className="space-y-2">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="annuaire" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="annuaire" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Annuaire
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="calendrier" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Planning des Cultes
              </TabsTrigger>
            </TabsList>

            {/* Annuaire des membres */}
            <TabsContent value="annuaire">
              <Card>
                <CardHeader>
                  <CardTitle>Annuaire des membres</CardTitle>
                  <CardDescription>Coordonnées des membres et responsables de l&apos;église</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label htmlFor="searchMembers">Rechercher un membre</Label>
                    <Input
                      id="searchMembers"
                      placeholder="Nom ou fonction..."
                      value={searchMembers}
                      onChange={(e) => setSearchMembers(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="px-4 py-2 text-left">Nom</th>
                          <th className="px-4 py-2 text-left">Fonction</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Téléphone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="border-b border-gray-200">
                            <td className="px-4 py-3">{member.name}</td>
                            <td className="px-4 py-3">{member.role}</td>
                            <td className="px-4 py-3">{member.email}</td>
                            <td className="px-4 py-3">{member.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredMembers.length === 0 && (
                    <p className="text-center py-4 text-gray-500">Aucun membre ne correspond à votre recherche.</p>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Ces informations sont confidentielles et réservées à un usage interne.
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents internes</CardTitle>
                  <CardDescription>Accédez aux documents réservés aux membres</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label htmlFor="searchDocuments">Rechercher un document</Label>
                    <Input
                      id="searchDocuments"
                      placeholder="Titre ou catégorie..."
                      value={searchDocuments}
                      onChange={(e) => setSearchDocuments(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 flex items-start gap-3 hover:bg-slate-50">
                        <div className="bg-primary/10 p-2 rounded">
                          <FileIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-gray-500">
                            Catégorie: {doc.category} | Date: {doc.date} | Taille: {doc.size}
                          </p>
                          <Button variant="link" className="p-0 h-auto text-primary">
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredDocuments.length === 0 && (
                    <p className="text-center py-4 text-gray-500">Aucun document ne correspond à votre recherche.</p>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Ces documents sont confidentiels et réservés à un usage interne.
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Planning des Cultes */}
            <TabsContent value="calendrier">
              <Card>
                <CardHeader>
                  <CardTitle>📅 Planning des Cultes</CardTitle>
                  <CardDescription>Organisation des services pour le mois en cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <PlanningTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}
