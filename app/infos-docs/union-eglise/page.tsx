import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Sidebar from "../components/Sidebar"

export const metadata: Metadata = {
  title: "Union des Églises Évangéliques Libres | Église Protestante Libre de Strasbourg",
  description: "Découvrez l'Union des Églises Évangéliques Libres de France, notre famille d'églises, son identité, ses valeurs et son organisation",
  keywords: ["UEEL", "Union des Églises", "Église Libre", "protestantisme", "évangélique", "Strasbourg"]
}

export default function UnionEglisePage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">L&apos;Union des Églises Évangéliques Libres</h1>

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
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos & Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">L&apos;Union des Églises</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="md:w-1/3">
                      <div className="relative w-64 h-64 mx-auto">
                        <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Logo de l'Union des Églises Évangéliques Libres"
                          width={400}
                          height={400}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4">Notre famille d&apos;églises</h2>
                      <p className="text-lg mb-4">
                        L&apos;Église Protestante Libre de Strasbourg fait partie de l&apos;Union des Églises Évangéliques
                        Libres de France (UEEL), une famille d&apos;églises fondée en 1849.
                      </p>
                      <p className="mb-4">
                        Cette union rassemble aujourd&apos;hui une cinquantaine d&apos;églises en France, partageant une même
                        vision de l&apos;Église et de la foi chrétienne.
                      </p>
                    </div>
                  </div>

                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Identité et valeurs</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p>
                        L&apos;Union des Églises Évangéliques Libres de France se caractérise par plusieurs traits distinctifs
                        :
                      </p>

                      <h3 className="mt-6">Une identité protestante évangélique</h3>
                      <p>
                        Nos églises s&apos;inscrivent dans la tradition protestante issue de la Réforme du 16ème siècle. Nous
                        affirmons les grands principes protestants : l&apos;autorité souveraine des Écritures, le salut par la
                        grâce au moyen de la foi, le sacerdoce universel des croyants.
                      </p>
                      <p>
                        Notre sensibilité évangélique se traduit par l&apos;importance que nous accordons à la conversion
                        personnelle, à l&apos;étude de la Bible et au témoignage.
                      </p>

                      <h3 className="mt-6">Une ecclésiologie particulière</h3>
                      <p>Le terme &quot;libre&quot; dans notre nom fait référence à plusieurs aspects de notre identité :</p>
                      <ul>
                        <li>
                          <strong>Liberté vis-à-vis de l&apos;État</strong> : Nos églises ont été pionnières dans la défense
                          du principe de séparation de l&apos;Église et de l&apos;État, bien avant la loi de 1905.
                        </li>
                        <li>
                          <strong>Églises de professants</strong> : L&apos;adhésion à nos églises est basée sur une confession
                          de foi personnelle et volontaire.
                        </li>
                        <li>
                          <strong>Autonomie des églises locales</strong> : Chaque église locale est autonome dans sa
                          gouvernance, tout en étant liée aux autres par des relations fraternelles.
                        </li>
                        <li>
                          <strong>Liberté de conscience</strong> : Nous respectons la liberté de conscience de chaque croyant
                          dans son interprétation des Écritures sur les questions non essentielles.
                        </li>
                      </ul>

                      <div className="my-8 relative h-64 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=400&width=800"
                          alt="Synode de l'Union des Églises Évangéliques Libres"
                          width={800}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <h3 className="mt-6">Organisation et fonctionnement</h3>
                      <p>
                        L&apos;UEEL fonctionne selon un système presbytérien-synodal, qui combine l&apos;autonomie des églises
                        locales et leur interdépendance au sein de l&apos;Union :
                      </p>
                      <ul>
                        <li>
                          <strong>Églises locales</strong> : Chaque église est dirigée par un conseil presbytéral (ou conseil
                          d&apos;église) composé du pasteur et d&apos;anciens élus par l&apos;assemblée des membres.
                        </li>
                        <li>
                          <strong>Régions</strong> : Les églises sont regroupées en régions qui se réunissent régulièrement
                          pour des temps de partage et de concertation.
                        </li>
                        <li>
                          <strong>Synode</strong> : Le Synode, qui se réunit tous les deux ans, est l&apos;instance suprême de
                          décision. Il est composé de délégués (pasteurs et laïcs) de toutes les églises.
                        </li>
                        <li>
                          <strong>Commission Synodale</strong> : Entre les synodes, la Commission Synodale veille à
                          l&apos;application des décisions synodales et à la coordination des activités de l&apos;Union.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Engagements et partenariats</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <h3>Nos engagements</h3>
                      <p>L&apos;UEEL est engagée dans plusieurs domaines :</p>
                      <ul>
                        <li>L&apos;implantation de nouvelles églises en France</li>
                        <li>La formation théologique des pasteurs et des responsables d&apos;église</li>
                        <li>Le soutien aux œuvres sociales et missionnaires</li>
                        <li>La réflexion sur les questions éthiques et sociétales</li>
                        <li>Le dialogue œcuménique avec d&apos;autres églises chrétiennes</li>
                      </ul>

                      <h3 className="mt-6">Nos partenariats</h3>
                      <p>
                        L&apos;UEEL entretient des relations fraternelles avec d&apos;autres unions d&apos;églises et
                        organisations chrétiennes :
                      </p>
                      <ul>
                        <li>
                          Elle est membre du <strong>Conseil National des Évangéliques de France (CNEF)</strong>
                        </li>
                        <li>
                          Elle est en communion avec la <strong>Communion Mondiale d&apos;Églises Réformées (CMER)</strong>
                        </li>
                        <li>
                          Elle entretient des liens particuliers avec les <strong>Églises Libres</strong> de Suisse, de
                          Belgique et d&apos;Italie
                        </li>
                        <li>
                          Elle collabore avec diverses <strong>œuvres missionnaires</strong> en France et à l&apos;étranger
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    <Button asChild size="lg" className="shadow-md">
                      <Link href="/infos-docs/histoire-union">Découvrir l&apos;histoire de l&apos;Union</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-2 border-primary text-primary hover:bg-primary/10"
                    >
                      <a
                        href="https://www.eglises-libres.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        Visiter le site officiel de l&apos;UEEL
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 