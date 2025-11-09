import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sidebar from "../components/Sidebar"

export const metadata: Metadata = {
  title: "Histoire de l'Union des Églises Évangéliques Libres | Église Protestante Libre de Strasbourg",
  description: "Découvrez l'histoire et les origines de l'Union des Églises Évangéliques Libres de France depuis sa fondation en 1849."
}

export default function HistoireUnionPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Histoire de l&apos;Union des Églises Évangéliques Libres</h1>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm md:text-base">
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
                  <span className="text-gray-700 dark:text-gray-300">Histoire de l&apos;Union</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8">
                  <div className="w-full md:w-1/3">
                    <div className="relative w-full h-56 md:h-64">
                      <Image
                        src="/images/histoire/eglise-histoire.jpg"
                        alt="L'Union des Églises Évangéliques Libres"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 mt-4 md:mt-0">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Une histoire de foi et de liberté</h2>
                    <p className="text-lg mb-4">
                      L&apos;Union des Églises Évangéliques Libres de France a été fondée en 1849, issue du Réveil protestant et du désir d&apos;indépendance vis-à-vis de l&apos;État.
                    </p>
                    <p className="mb-4">
                      Notre église fait partie de cette famille d&apos;églises qui partage une vision commune de la foi chrétienne et des principes d&apos;autonomie et de liberté.
                    </p>
                  </div>
                </div>

                {/* Tabs navigation */}
                <Tabs defaultValue="origines" className="max-w-full mx-auto">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                    <TabsTrigger value="origines">Origines</TabsTrigger>
                    <TabsTrigger value="principes">Principes fondateurs</TabsTrigger>
                    <TabsTrigger value="evolution">Évolution</TabsTrigger>
                    <TabsTrigger value="aujourdhui">Aujourd&apos;hui</TabsTrigger>
                  </TabsList>

                  <TabsContent value="origines">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">Les origines (1849-1872)</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            L&apos;Union des Églises Évangéliques Libres de France est née dans le contexte du Réveil
                            protestant du XIXe siècle, un mouvement de renouveau spirituel qui a traversé l&apos;Europe
                            protestante.
                          </p>
                          <p>
                            En France, ce mouvement a conduit certains protestants à remettre en question le lien entre
                            l&apos;Église et l&apos;État, tel qu&apos;il existait dans les églises réformées concordataires.
                            Ils aspiraient à une église libre de toute tutelle étatique, fondée uniquement sur l&apos;adhésion
                            volontaire de ses membres.
                          </p>
                          <p>
                            C&apos;est ainsi qu&apos;en 1849, plusieurs communautés protestantes décidèrent de se séparer des
                            églises officielles pour former des &quot;églises libres&quot;. Le 1er août 1849, à Paris, ces
                            églises se réunirent en synode constituant et adoptèrent une confession de foi et une discipline
                            ecclésiastique, donnant ainsi naissance à l&apos;Union des Églises Évangéliques Libres de France.
                          </p>
                          <p>
                            Les fondateurs de cette union, parmi lesquels figuraient Frédéric Monod et Agénor de Gasparin,
                            étaient animés par la conviction que l&apos;Église devait être indépendante de l&apos;État et
                            composée uniquement de croyants professants.
                          </p>
                          <div className="my-6">
                            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                              <Image
                                src="/images/histoire/eglise-histoire.jpg"
                                alt="Premier synode des Églises Libres en 1849"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          </div>
                          <p>
                            Cette décision de séparation n&apos;était pas prise à la légère, car elle impliquait de renoncer
                            aux subventions de l&apos;État et d&apos;assumer entièrement la charge financière du culte et des
                            pasteurs. C&apos;était un acte de foi et de conviction.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="principes">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">Les principes fondateurs</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            L&apos;Union des Églises Évangéliques Libres s&apos;est constituée autour de plusieurs principes
                            fondamentaux qui continuent de la caractériser aujourd&apos;hui :
                          </p>
                          <h4 className="font-bold mt-4">1. La séparation de l&apos;Église et de l&apos;État</h4>
                          <p>
                            Les Églises Libres ont été pionnières en France dans la défense du principe de séparation de
                            l&apos;Église et de l&apos;État, bien avant la loi de 1905. Elles considèrent que l&apos;Église
                            doit être indépendante de toute tutelle étatique pour accomplir fidèlement sa mission.
                          </p>
                          <h4 className="font-bold mt-4">2. L&apos;Église de professants</h4>
                          <p>
                            Les Églises Libres affirment que l&apos;Église visible doit être composée de personnes qui font
                            une profession personnelle de leur foi en Jésus-Christ. L&apos;adhésion à l&apos;église est donc
                            volontaire et basée sur une confession de foi personnelle.
                          </p>
                          <h4 className="font-bold mt-4">3. L&apos;autorité des Écritures</h4>
                          <p>
                            Les Églises Libres reconnaissent la Bible comme seule autorité en matière de foi et de vie
                            chrétienne. Elles affirment que les Écritures sont inspirées de Dieu et constituent la norme
                            suprême pour la doctrine et la pratique.
                          </p>
                          <h4 className="font-bold mt-4">4. L&apos;autonomie des églises locales</h4>
                          <p>
                            Chaque église locale est autonome dans son fonctionnement et sa gouvernance, tout en étant liée
                            aux autres églises de l&apos;Union par une confession de foi commune et des relations
                            fraternelles.
                          </p>
                          <div className="my-6">
                            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                              <Image
                                src="/images/histoire/eglise-histoire.jpg"
                                alt="Église Libre historique"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          </div>
                          <p>
                            Ces principes fondateurs ont façonné l&apos;identité des Églises Évangéliques Libres et continuent
                            d&apos;orienter leur témoignage et leur mission aujourd&apos;hui.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="evolution">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">L&apos;évolution de l&apos;Union (1872-1938)</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            Au cours de son histoire, l&apos;Union des Églises Évangéliques Libres a connu plusieurs phases
                            d&apos;évolution et de développement :
                          </p>
                          <h4 className="font-bold mt-4">Expansion initiale (1849-1872)</h4>
                          <p>
                            Dans les premières décennies de son existence, l&apos;Union connut une période d&apos;expansion
                            avec la création de nouvelles églises dans différentes régions de France. En 1872, elle comptait
                            environ 40 églises et postes d&apos;évangélisation.
                          </p>
                          <h4 className="font-bold mt-4">Consolidation et difficultés (1872-1905)</h4>
                          <p>
                            Cette période fut marquée par des difficultés financières et une certaine stagnation. Cependant,
                            les Églises Libres continuèrent à défendre leurs principes et à développer leur témoignage.
                          </p>
                          <h4 className="font-bold mt-4">
                            Après la séparation de l&apos;Église et de l&apos;État (1905-1938)
                          </h4>
                          <p>
                            La loi de séparation des Églises et de l&apos;État de 1905 vint confirmer le bien-fondé des
                            positions défendues par les Églises Libres depuis leur origine. Paradoxalement, cette loi rendit
                            moins visible la spécificité des Églises Libres, puisque toutes les églises protestantes
                            devenaient désormais &quot;libres&quot; par rapport à l&apos;État.
                          </p>
                          <div className="my-6">
                            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                              <Image
                                src="/images/histoire/eglise-histoire.jpg"
                                alt="Église Libre historique"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          </div>
                          <h4 className="font-bold mt-4">Renaissance (1950-1960)</h4>
                          <p>
                            Dans les années 1950-1960, l&apos;Union connut une renaissance avec la création de nouvelles églises 
                            et un renouveau de son témoignage évangélique. Cette période a permis de réaffirmer l'identité propre 
                            des Églises Libres dans le paysage protestant français.
                          </p>
                          <p>
                            Cette longue histoire, avec ses moments forts et ses défis, témoigne de la fidélité et de la 
                            persévérance des Églises Évangéliques Libres dans leur mission de proclamer l'Évangile tout 
                            en restant fidèles à leurs principes fondateurs.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="aujourdhui">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">L&apos;Union aujourd&apos;hui</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            Aujourd&apos;hui, l&apos;Union des Églises Évangéliques Libres de France (UEEL) rassemble une
                            cinquantaine d&apos;églises réparties sur l&apos;ensemble du territoire français.
                          </p>
                          <h4 className="font-bold mt-4">Organisation</h4>
                          <p>L&apos;UEEL fonctionne selon un système presbytérien-synodal :</p>
                          <ul>
                            <li>
                              Chaque église locale est dirigée par un conseil presbytéral (ou conseil d&apos;église) composé
                              de pasteurs et d&apos;anciens élus par l&apos;assemblée des membres.
                            </li>
                            <li>
                              Les églises sont regroupées en régions qui se réunissent régulièrement pour des temps de partage
                              et de concertation.
                            </li>
                            <li>
                              Le Synode, qui se réunit tous les deux ans, est l&apos;instance suprême de décision. Il est
                              composé de délégués (pasteurs et laïcs) de toutes les églises.
                            </li>
                            <li>
                              Entre les synodes, la Commission Synodale veille à l&apos;application des décisions synodales et
                              à la coordination des activités de l&apos;Union.
                            </li>
                          </ul>
                          <h4 className="font-bold mt-4">Engagements</h4>
                          <p>L&apos;UEEL est engagée dans plusieurs domaines :</p>
                          <ul>
                            <li>L&apos;évangélisation et l&apos;implantation de nouvelles églises</li>
                            <li>La formation théologique des pasteurs et des laïcs</li>
                            <li>L&apos;action sociale et humanitaire</li>
                            <li>Le dialogue œcuménique avec d&apos;autres églises chrétiennes</li>
                            <li>La réflexion sur les questions éthiques et sociétales</li>
                          </ul>
                          <div className="my-6">
                            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                              <Image
                                src="/images/histoire/eglise-histoire.jpg"
                                alt="Synode récent de l'UEEL"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          </div>
                          <h4 className="font-bold mt-4">Relations</h4>
                          <p>
                            L&apos;UEEL entretient des relations fraternelles avec d&apos;autres unions d&apos;églises en
                            France et à l&apos;étranger :
                          </p>
                          <ul>
                            <li>Elle est membre du Conseil National des Évangéliques de France (CNEF)</li>
                            <li>Elle est en communion avec la Communion Mondiale d&apos;Églises Réformées (CMER)</li>
                            <li>
                              Elle entretient des liens particuliers avec les Églises Libres de Suisse, de Belgique et
                              d&apos;Italie
                            </li>
                          </ul>
                          <p>
                            Fidèle à ses origines et à ses principes fondateurs, l&apos;Union des Églises Évangéliques Libres
                            continue aujourd&apos;hui à témoigner de l&apos;Évangile de Jésus-Christ dans la société
                            française, en affirmant la liberté de l&apos;Église et la nécessité d&apos;un engagement personnel
                            dans la foi.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Pour en savoir plus sur l&apos;Union des Églises Évangéliques Libres de France, vous pouvez visiter le
                    site officiel :
                  </p>
                  <Link
                    href="https://www.eglises-libres.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    www.eglises-libres.fr
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 