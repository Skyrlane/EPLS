import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { echosByYear, getLatestEcho, getAvailableYears } from "@/lib/echo-data"

export const metadata = {
  title: "Echos EPLS - Église Protestante Libre de Strasbourg",
  description: "Consultez les derniers numéros et archives de notre bulletin mensuel Echos EPLS"
}

export default function Echo() {
  // Obtenir le dernier écho et les années disponibles
  const latestEcho = getLatestEcho();
  const availableYears = getAvailableYears();
  const currentYear = availableYears[0];
  const previousYears = availableYears.slice(1);

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
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
                  <span className="mx-2 text-gray-400 dark:text-gray-300">/</span>
                  <span className="text-gray-700 dark:text-gray-200">Echos</span>
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
            {/* Echos de l'année en cours */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Echos EPLS {currentYear}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 dark:text-gray-200">
                    Nous sommes ravis de partager avec vous les dernières nouvelles et les échos de notre communauté. En
                    cliquant sur le lien ci-dessous, vous pourrez accéder au PDF contenant toutes les informations
                    importantes sur nos événements passés, à venir, nos projets et nos méditations.
                  </p>

                  <p className="mb-8 dark:text-gray-200">Bonne lecture !</p>

                  <div className="space-y-4">
                    {echosByYear[currentYear].map((echo) => (
                      <div key={echo.id} className="border-l-4 border-primary pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <a 
                          href={echo.pdfUrl} 
                          className="text-primary hover:underline font-medium block"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Echos EPLS {echo.month} {echo.year}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Archives des années précédentes */}
              {previousYears.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Archives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Première année d'archives affichées en détail */}
                      {previousYears.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-3 dark:text-white">{previousYears[0]}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {echosByYear[previousYears[0]].map((echo) => (
                              <div key={echo.id} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <a 
                                  href={echo.pdfUrl} 
                                  className="text-gray-700 dark:text-gray-200 hover:text-primary hover:underline block"
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  Echos EPLS {echo.month} {echo.year}
                                </a>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-right">
                            <Link href={`/echo/${previousYears[0]}`} className="text-primary hover:underline text-sm">
                              Voir tous les numéros de {previousYears[0]} →
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Années antérieures */}
                      {previousYears.length > 1 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-3 dark:text-white">Années antérieures</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {previousYears.slice(1).map((year) => (
                              <div key={year} className="border border-gray-300 dark:border-gray-600 rounded p-2 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <Link href={`/echo/${year}`} className="text-gray-700 dark:text-gray-200 hover:text-primary hover:underline block">
                                  {year}
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar avec informations complémentaires */}
            <div>
              {/* Qu'est-ce que les Echos ? */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>À propos des Echos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Les "Echos EPLS" sont notre bulletin mensuel qui partage la vie de l&apos;Église Protestante Libre
                    de Strasbourg. Ils contiennent des méditations, des nouvelles de la communauté, des annonces
                    d&apos;événements à venir et des réflexions spirituelles.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ils sont publiés au début de chaque mois et disponibles en version PDF pour faciliter leur lecture
                    et partage.
                  </p>
                </CardContent>
              </Card>

              {/* Dernier numéro mis en avant */}
              <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-primary">Dernier numéro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">
                    Ne manquez pas le numéro de <strong>{latestEcho.month} {latestEcho.year}</strong> avec :
                  </p>
                  {latestEcho.highlights ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-200 mb-6">
                      {latestEcho.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-200 mb-6">Retrouvez toutes les dernières nouvelles de notre église.</p>
                  )}
                  <Button 
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={latestEcho.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Télécharger le PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 