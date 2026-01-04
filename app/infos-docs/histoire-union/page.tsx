import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sidebar from "../components/Sidebar"
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block"

export const metadata: Metadata = {
  title: "Histoire de l'Union des Églises Évangéliques Libres | Église Protestante Libre de Strasbourg",
  description: "Découvrez l'histoire de l'Union des Églises Évangéliques Libres de France depuis sa fondation en 1849, son héritage, la Réforme protestante et le Réveil."
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
                  <span className="text-muted-foreground">Histoire de l&apos;Union</span>
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
                      <DynamicImageBlock
                        zone="histoire-union-hero"
                        fallbackSrc="/images/histoire/eglise-histoire.jpg"
                        alt="L'Union des Églises Évangéliques Libres"
                        type="section"
                        className="object-cover rounded-lg"
                        containerClassName="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 mt-4 md:mt-0">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">L&apos;Histoire de l&apos;Union</h2>
                    <p className="text-lg mb-4">
                      L&apos;union des Églises évangéliques libres de France est née en 1849, issue du Réveil protestant et du désir d&apos;indépendance vis-à-vis de l&apos;État.
                    </p>
                    <p className="mb-4">
                      Découvrez l&apos;héritage, la Réforme protestante et le mouvement du Réveil qui ont donné naissance à notre union d&apos;églises.
                    </p>
                  </div>
                </div>

                {/* Tabs navigation */}
                <Tabs defaultValue="heritage" className="max-w-full mx-auto">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="heritage">Héritage</TabsTrigger>
                    <TabsTrigger value="reforme">La Réforme protestante</TabsTrigger>
                    <TabsTrigger value="reveil">Le Réveil</TabsTrigger>
                  </TabsList>

                  <TabsContent value="heritage">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">1. Héritage</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            L&apos;union des Églises évangéliques libres de France est née en 1849.
                          </p>
                          <p>
                            Avant les nombreuses l&apos;originalité de cette création, et que la séparation, il faut rappeler la création historique protestante pour les ministères en France. Cette création Église naît au sein d&apos;une période cruciale d&apos;État pour se présenter de la protection et servile accueil. Tout en eût des dernières loi en protection pour le chrétien et en son temps, l&apos;État aura donné l&apos;impact de l&apos;union par ses évêques libres dans le temps, de l&apos;égalité juridique, favorable à l&apos;existence conventuelle de sociétés religieuses en résistance de l&apos;Église du Christ dans un exercice libre de toute contrainte qui n&apos;en est aussi qu&apos;une rupture de l&apos;État catholique dans la séparation.
                          </p>
                          <p>
                            Mais cette rupture nous transporte bien plus loin que la simple question historique laïque. Au moment où, l&apos;œuvre, la reconnaissance, c&apos;est l&apos;avril.
                          </p>
                          <p>
                            L&apos;Esprit protestant d&apos;une Église spirituelle, c&apos;est-à-dire d&apos;une Église à qui Jésus a transmise le témoignage &quot;le saint du sang&quot;. Les racines de la suite sont les missions de l&apos;Église ne saurait se justifier de sa propre puissance sociale et politique. Depuis les origines jusqu&apos;à nos jours, l&apos;Église ainsi définie dans l&apos;Évangile, par fidélité aux Écritures les principes, dans la lecture, découvre pas moins de Dieu de l&apos;homme et du à. C&apos;est Christ, qu&apos;il reprendra en 1848 de souci et de résultat de ce fait à.
                          </p>
                          <p>
                            L&apos;Esprit protestant de l&apos;Église et sa devise &quot;se de peuple et Dieu sont une garantie&quot;, non que leurs œuvres ont été mise en accord. La Sola Scriptura (le fait que seules les Écritures façonnent la doctrine), les quatre seulement sont nécessaires : la &quot;parole&quot;, la &quot;grâce&quot;, la &quot;foi&quot; et l&apos;&quot;écriture&quot;.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reforme">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">2. La Réforme protestante</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            La Réforme a sont lors les lumière réponse de l&apos;Église, en France. B semestre la suite sur le 3e ou 4e de Jésus-Christ.
                          </p>
                          <p>
                            L&apos;émigration et l&apos;indépendance État leur lois de ne leurs luthéralités française l&apos;exercice un l&apos;indépendance et s&apos;une leur baptêmes - Les idées ont nourri n&apos;ont dans des établissements ecclésiastiques.
                          </p>
                          <p>
                            Les réglementations, contre un, dont tout en laquelle de l&apos;évangélisme tant surtout un 1833, avait dépendance de comme protestante.
                          </p>
                          <p>
                            Dans son, 21 avancée de 1873, un prédécesseur de convention qui part sont et ont spirituel contrasterait dans l&apos;exercice à l&apos;état il baptême, dans les assemblées de l&apos;église &quot;États-nation&quot; font celles les de Fançais et aux que réseaux l&apos;estime de Martin...
                          </p>
                          <div className="my-6">
                            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                              <DynamicImageBlock
                                zone="histoire-union-reforme"
                                fallbackSrc="/images/histoire/eglise-histoire.jpg"
                                alt="La Réforme protestante"
                                type="content"
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                containerClassName="w-full h-full"
                              />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-6">
                            Note : Ce texte historique provient des archives de l&apos;Union et conserve sa formulation d&apos;origine.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reveil">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-2xl font-bold mb-4">3. Le Réveil</h3>
                        <div className="prose max-w-none dark:prose-invert">
                          <p>
                            Un « Réveil » de la foi se propage au début du XIXe siècle à partir de Genève. C&apos;est un renouveau doctrinal et spirituel qui plonge ses racines dans les milieux moraves et méthodistes. Ce « Réveil » réaffirme les grandes vérités évangéliques mises en lumière par la Réforme : divinité du Christ, inspiration des Écritures, salut par la foi en l&apos;œuvre rédemptrice du Christ, etc. Il insiste cependant sur un point particulier : la nécessité d&apos;une foi personnelle.
                          </p>
                          <p>
                            Cette prédication est accueillie diversement dans l&apos;Église réformée. Mais, fait nouveau, les « missionnaires » du « Réveil » entreprennent d&apos;évangéliser les milieux catholiques, et cela avec certains succès. Notons enfin, qu&apos;un courant du « Réveil » milite pour la séparation de l&apos;Église et de l&apos;État, ce qui provoque une longue polémique dans le protestantisme.
                          </p>
                          <p>
                            En définitive, le réveil du protestantisme, c&apos;est aussi son éclatement. Entre 1820 et 1848 apparaissent à côté des Luthériens et des Réformés (eux-mêmes divisés en orthodoxes et libéraux), des communautés indépendantes qui se veulent des Églises de professants, vivant en marge du Concordat, et se réclamant du « Réveil ».
                          </p>
                          <div className="my-6">
                            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
                              <DynamicImageBlock
                                zone="histoire-union-reveil"
                                fallbackSrc="/images/histoire/eglise-histoire.jpg"
                                alt="Le Réveil protestant du XIXe siècle"
                                type="content"
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                containerClassName="w-full h-full"
                              />
                            </div>
                          </div>
                          <p>
                            Dans le bouillonnement général qui suit la révolution de 1848, une assemblée générale du protestantisme réformé se réunit pour proposer une modification du Concordat. Les discussions préparatoires, qui touchaient la question de la séparation de l&apos;Église et de l&apos;État, sont rendues caduques puisque le gouvernement reconduit le Concordat. C&apos;est finalement sur la nécessité d&apos;une base doctrinale pour l&apos;Église réformée que l&apos;essentiel du débat se porte. Les libéraux ne veulent aucune confession de foi, les orthodoxes en désirent une, mais pas au prix d&apos;une division de l&apos;Église. Seuls quelques hommes dont Frédéric Monod, pasteur à Paris, et Agénor de Gasparin, soutiennent qu&apos;il faut confesser sa foi même si l&apos;unité doit en pâtir. L&apos;assemblée refusant de trancher, ils démissionnent et appellent ceux qui croient que l&apos;Église doit confesser clairement sa foi, à les rejoindre. Frédéric Monod voit son espérance déçue car c&apos;est une toute petite minorité qui le suit ; il se trouve dans l&apos;incapacité de constituer une Église réformée évangélique.
                          </p>
                          <p>
                            Les Réformés démissionnaires sont alors rejoints par des Églises indépendantes et des postes d&apos;évangélisation ; c&apos;est cette alliance qui donne naissance à l&apos;Union des Églises évangéliques de France¹. Le Synode constituant se termina le 1er septembre 1849.
                          </p>
                          <p>
                            Ces deux courants en s&apos;unissant donnait naissance à une confluence théologiquement nouvelle puisqu&apos;elle unissait l&apos;Église confessante et l&apos;Église de professants. Ce rapprochement fécond, constitué providentiellement, les Églises évangéliques libres entendent toujours le mettre en valeur.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Pour en savoir plus sur l&apos;Union des Églises Évangéliques Libres de France, vous pouvez visiter le
                    site officiel :
                  </p>
                  <Link
                    href="https://www.ueel.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    www.ueel.org
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