import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import { ImageBlock } from "@/components/ui/image-block"
import EgliseSidebar from "../../components/eglise/EgliseSidebar"

export const metadata: Metadata = {
  title: "Nos valeurs | Église Protestante Libre de Strasbourg",
  description: "Découvrez les valeurs fondamentales qui animent notre église : la centralité de la Bible, l'amour et la grâce, l'authenticité, la communauté, le service et la liberté",
}

export default function NosValeurs() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nos valeurs</h1>

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
                  <Link href="/notre-eglise" className="text-primary hover:text-primary/80">
                    Notre Église
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700">Nos valeurs</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <EgliseSidebar />
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-semibold mb-6">Nos valeurs fondamentales</h2>
              <p className="mb-6">
                Les valeurs qui nous animent et guident notre vie d&apos;église sont enracinées dans notre compréhension
                de l&apos;Évangile et de l&apos;enseignement biblique. Elles façonnent notre identité et notre mission.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <Card>
                  <CardHeader>
                    <CardTitle>Fidélité à la Parole de Dieu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nous reconnaissons la Bible comme l&apos;autorité suprême en matière de foi et de vie. Notre
                      engagement est d&apos;étudier, enseigner et appliquer fidèlement les Écritures dans tous les
                      aspects de notre vie individuelle et communautaire.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Amour et relation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Suivant le double commandement de Jésus, nous valorisons l&apos;amour pour Dieu et pour notre
                      prochain. Nous cultivons des relations authentiques, bienveillantes et réconciliatrices, tant au
                      sein de notre communauté qu&apos;avec ceux qui ne partagent pas notre foi.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Grâce et vérité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      À l&apos;image de Jésus, nous cherchons à manifester un équilibre entre la grâce et la vérité,
                      accueillant chacun avec compassion tout en restant attachés aux vérités bibliques. Nous évitons
                      tant le légalisme que le relativisme moral.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Excellence et intégrité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nous nous efforçons d&apos;honorer Dieu par l&apos;excellence dans tout ce que nous entreprenons,
                      tout en maintenant une intégrité irréprochable. Nous aspirons à une cohérence entre nos paroles et
                      nos actes, aussi bien en public qu&apos;en privé.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service et générosité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Suivant l&apos;exemple de Christ qui est venu pour servir, nous valorisons une attitude de service
                      désintéressé et une générosité joyeuse. Nous encourageons chacun à mettre ses dons et ressources au
                      service de Dieu et des autres.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Témoignage et mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Nous sommes engagés à partager la Bonne Nouvelle de Jésus-Christ par nos paroles et nos actions.
                      Nous soutenons la mission locale et globale, cherchant à faire des disciples dans toutes les
                      nations comme Jésus nous l&apos;a commandé.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-semibold mb-6">Notre approche</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">Centrés sur Christ</h3>
                  <p>
                    Nous plaçons Jésus-Christ au centre de notre vie d&apos;église, cherchant à le connaître davantage et
                    à le faire connaître. Nous voulons que son enseignement et son exemple guident toutes nos décisions.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">Ancrés dans la Bible</h3>
                  <p>
                    La Bible est notre fondement, notre guide et notre source d&apos;autorité. Nous l&apos;étudions avec
                    rigueur et avec humilité, cherchant à la comprendre et à la vivre fidèlement.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">Conduits par l&apos;Esprit</h3>
                  <p>
                    Nous reconnaissons notre dépendance à l&apos;égard du Saint-Esprit et nous lui faisons confiance pour
                    nous guider, nous équiper et nous transformer à l&apos;image de Christ.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-semibold mb-6">Vivre nos valeurs</h2>
              <p className="mb-6">
                Nous nous efforçons de mettre en pratique ces valeurs dans tous les aspects de notre vie d&apos;église :
              </p>

              <div className="bg-slate-50 p-6 rounded-lg mb-10">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Dans nos <strong>cultes</strong>, par une louange sincère et une prédication fidèle de la Parole de
                    Dieu
                  </li>
                  <li>
                    Dans nos <strong>relations communautaires</strong>, par l&apos;amour fraternel, le respect mutuel et
                    le soutien dans les épreuves
                  </li>
                  <li>
                    Dans notre <strong>enseignement</strong>, par une formation biblique solide pour tous les âges
                  </li>
                  <li>
                    Dans notre <strong>engagement</strong>, par le service bénévole selon les dons et les appels de
                    chacun
                  </li>
                  <li>
                    Dans notre <strong>témoignage</strong>, par une présence bienveillante et généreuse dans la société
                  </li>
                  <li>
                    Dans notre <strong>gouvernance</strong>, par la transparence, l&apos;intégrité et la recherche de
                    l&apos;unité
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary">
                <h3 className="text-xl font-medium mb-3 text-primary">Notre prière</h3>
                <p className="italic">
                  &laquo; Que ces valeurs ne restent pas de simples mots sur une page, mais qu&apos;elles se traduisent en
                  actions concrètes et en transformation réelle, pour la gloire de Dieu et le bien de tous. &raquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 