import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EchoArchivesPageSafe } from "@/components/echo/echo-archives-page-safe";

export const metadata = {
  title: "Echos EPLS - Église Protestante Libre de Strasbourg",
  description: "Consultez les derniers numéros et archives de notre bulletin mensuel Echos EPLS"
}

export default function Echo() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Echos EPLS</h1>

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
                  <span className="text-foreground">Echos</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Echos Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Liste des échos avec filtres (Firebase) */}
            <div className="md:col-span-2">
              <EchoArchivesPageSafe />
            </div>

            {/* Sidebar avec informations complémentaires */}
            <div>
              {/* Qu'est-ce que les Echos ? */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>À propos des Echos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Les "Echos EPLS" sont notre bulletin mensuel qui partage la vie de l&apos;Église Protestante Libre
                    de Strasbourg. Ils contiennent des méditations, des nouvelles de la communauté, des annonces
                    d&apos;événements à venir et des réflexions spirituelles.
                  </p>
                  <p className="text-muted-foreground">
                    Ils sont publiés au début de chaque mois et disponibles en version PDF pour faciliter leur lecture
                    et partage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 