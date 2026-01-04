import Link from "next/link"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "./components/Sidebar"

export const metadata: Metadata = {
  title: "Infos & Documents | Église Protestante Libre de Strasbourg",
  description: "Informations pratiques et documents concernant notre église : offrandes, membres, l'Union des Églises et plus encore",
  keywords: ["informations", "documents", "offrandes", "membres", "UEEL", "Église Libre", "Strasbourg"]
}

export default function InfosDocs() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Infos/Docs</h1>

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
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Infos/Docs</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Bienvenue dans la section Infos/Docs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-lg">
                      Cette section contient des informations importantes concernant notre église, notamment :
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Offrande card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Offrandes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">
                            Comment soutenir notre église et nos œuvres par vos dons et offrandes.
                          </p>
                          <Link href="/infos-docs/offrandes" className="text-primary hover:underline">
                            En savoir plus →
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Membres card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Liste des membres</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">Consultez la liste des membres de notre église.</p>
                          <Link href="/infos-docs/membres" className="text-primary hover:underline">
                            Voir la liste →
                          </Link>
                        </CardContent>
                      </Card>

                      {/* EVE card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Eau Vive Espoir (EVE)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">L&apos;association culturelle adossée à notre église.</p>
                          <Link href="/infos-docs/eve" className="text-primary hover:underline">
                            Découvrir EVE →
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Anniversaires card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Anniversaires</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">Découvrez les anniversaires des membres de notre église.</p>
                          <Link href="/infos-docs/anniversaires" className="text-primary hover:underline">
                            Voir les anniversaires →
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Carnet d'adresses card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Carnet d&apos;adresses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">
                            Coordonnées des membres de notre communauté (accès réservé).
                          </p>
                          <Link href="/infos-docs/carnet-adresses" className="text-primary hover:underline">
                            Consulter le carnet →
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Planning des Cultes card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">📅 Planning des Cultes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">
                            Organisation des services et responsabilités pour les cultes.
                          </p>
                          <Link href="/infos-docs/planning-cultes" className="text-primary hover:underline">
                            Voir le planning →
                          </Link>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-primary/5 mb-8">
                      <CardHeader>
                        <CardTitle>L&apos;Union des Églises évangéliques libres</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">
                          Notre église fait partie de l&apos;Union des Églises évangéliques libres de France (UEEL), née
                          en 1849. Découvrez l&apos;histoire et l&apos;héritage de cette union, ses valeurs et ses
                          relations avec d&apos;autres organisations chrétiennes.
                        </p>
                        <Link href="/infos-docs/union-eglise" className="text-primary hover:underline">
                          En savoir plus sur l&apos;UEEL →
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Politique de confidentialité card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Politique de confidentialité</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">
                            Comment nous collectons, utilisons et protégeons vos données personnelles.
                          </p>
                          <Link href="/infos-docs/politique-confidentialite" className="text-primary hover:underline">
                            Lire notre politique →
                          </Link>
                        </CardContent>
                      </Card>

                      {/* Mentions légales card */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-xl">Mentions légales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">
                            Informations légales et conditions d'utilisation du site.
                          </p>
                          <Link href="/infos-docs/mentions-legales" className="text-primary hover:underline">
                            Consulter →
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 