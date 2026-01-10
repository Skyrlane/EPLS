import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { echosByYear } from "@/lib/echo-data"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"
import Link from "next/link"

export function generateMetadata({ params }: { params: { year: string } }) {
  // Vérifier si l'année existe
  if (!echosByYear[params.year]) {
    return {
      title: "Archives non trouvées - Église Protestante Libre de Strasbourg"
    }
  }

  return {
    title: `Echos EPLS ${params.year} - Archives - Église Protestante Libre de Strasbourg`,
    description: `Consultez les archives des bulletins Echos EPLS de l'année ${params.year}.`
  }
}

export default function EchoArchive({ params }: { params: { year: string } }) {
  // Vérifier si l'année existe
  if (!echosByYear[params.year]) {
    notFound()
  }

  // Obtenir les échos de l'année
  const echoes = echosByYear[params.year]

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Echos", href: "/echo" },
    { label: params.year, href: `/echo/${params.year}`, isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title={`Echos EPLS ${params.year}`}
        breadcrumbs={breadcrumbItems}
      />

      {/* Archives Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Archives {params.year}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-8">
                  Retrouvez ci-dessous tous les numéros des Echos EPLS de l&apos;année {params.year}.
                  Cliquez sur un numéro pour le consulter en PDF.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {echoes.map((echo) => (
                    <div
                      key={echo.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <h3 className="text-lg font-semibold mb-2">{echo.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">Publié le {echo.date}</p>
                      <a
                        href={echo.pdfUrl}
                        className="text-primary hover:underline inline-flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Consulter le PDF
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/echo"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Retour à la page principale des Echos
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
} 