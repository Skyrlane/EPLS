import Link from "next/link"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BirthdaysSection } from "@/components/infos-docs/BirthdaysSection"

export const metadata: Metadata = {
  title: "Anniversaires | Église Protestante Libre de Strasbourg",
  description: "Découvrez les anniversaires des membres de notre église",
  keywords: ["anniversaires", "membres", "église", "EPLS", "Strasbourg"]
}

export default function AnniversairesPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Anniversaires</h1>

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
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos/Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-gray-700 dark:text-gray-300">Anniversaires</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Anniversaires des Membres</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Découvrez les dates d'anniversaire des membres de notre église. 
                  Sélectionnez un mois pour voir tous les anniversaires de cette période.
                </p>
              </CardContent>
            </Card>

            {/* Section des anniversaires */}
            <BirthdaysSection />
          </div>
        </div>
      </section>
    </>
  )
}
