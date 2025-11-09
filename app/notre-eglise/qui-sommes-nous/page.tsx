import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import { ImageBlock } from "@/components/ui/image-block"
import EgliseSidebar from "../../components/eglise/EgliseSidebar"

export const metadata: Metadata = {
  title: "Qui sommes-nous | Église Protestante Libre de Strasbourg",
  description: "Découvrez notre identité protestante, évangélique et libre, notre vision et nos valeurs",
}

export default function QuiSommesNous() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Qui sommes-nous ?</h1>

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
                  <span className="text-gray-700">Qui sommes-nous</span>
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
              <h2 className="text-3xl font-semibold mb-6">Notre identité</h2>
              <p className="mb-6">
                L&apos;Église Protestante Libre de Strasbourg est une communauté chrétienne évangélique ancrée dans la
                tradition protestante. Nous sommes une église indépendante au sein de l&apos;Union des Églises
                évangéliques libres.
              </p>

              <p className="mb-6">
                Notre communauté est composée de personnes de tous âges et de diverses origines, unies par la foi en
                Jésus-Christ et le désir de vivre selon l&apos;enseignement de la Bible.
              </p>

              <div className="bg-slate-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-medium mb-4">Notre vision</h3>
                <p className="italic">
                  &laquo; Être une communauté chrétienne vivante, qui aime Dieu, s&apos;aime les uns les autres, et
                  témoigne de l&apos;amour du Christ dans notre société. &raquo;
                </p>
              </div>

              <h2 className="text-3xl font-semibold mb-6">Notre mission</h2>
              <p className="mb-6">
                Notre mission s&apos;articule autour de trois axes principaux, inspirés de la Grande Mission confiée par
                Jésus à ses disciples :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Adorer</h3>
                  <p>
                    Célébrer Dieu par la louange, la prière et une vie qui l&apos;honore dans tous les aspects de notre
                    quotidien.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Former</h3>
                  <p>
                    Encourager chacun à grandir dans sa foi et à développer une relation personnelle avec Dieu par
                    l&apos;étude de la Bible.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Témoigner</h3>
                  <p>
                    Partager l&apos;amour de Dieu par nos paroles et nos actions, en servant notre prochain et en
                    annonçant la Bonne Nouvelle.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-semibold mb-6">Nos croyances fondamentales</h2>
              <p className="mb-6">
                Nous adhérons aux grandes vérités de la foi chrétienne historique, notamment :
              </p>

              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>La Bible comme Parole de Dieu, autorité suprême en matière de foi et de vie</li>
                <li>Un seul Dieu en trois personnes : Père, Fils et Saint-Esprit</li>
                <li>
                  Jésus-Christ, pleinement Dieu et pleinement homme, sa vie sans péché, sa mort expiatoire et sa
                  résurrection
                </li>
                <li>Le salut par la grâce, au moyen de la foi en Jésus-Christ</li>
                <li>L&apos;œuvre du Saint-Esprit dans la conversion et la sanctification du croyant</li>
                <li>L&apos;Église, corps du Christ, communauté des croyants</li>
                <li>Le retour visible de Jésus-Christ et l&apos;établissement final du Royaume de Dieu</li>
              </ul>

              <h2 className="text-3xl font-semibold mb-6">Notre vie d&apos;église</h2>
              <p className="mb-6">
                Notre vie communautaire s&apos;articule autour de plusieurs objectifs qui permettent à chacun de :
              </p>

              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Découvrir et approfondir sa relation avec Dieu</li>
                <li>Grandir dans la foi et la connaissance de la Bible</li>
                <li>Développer des relations fraternelles authentiques</li>
                <li>Servir selon ses dons et ses capacités</li>
                <li>Témoigner de l&apos;amour de Dieu dans notre ville et au-delà</li>
              </ul>

              <h2 className="text-3xl font-semibold mb-6">Notre appartenance</h2>
              <p className="mb-8">
                Notre église fait partie de l&apos;Union des Églises évangéliques libres de France (UEEL), fondée en
                1849. À travers cette union, nous sommes également membres de la Fédération Protestante de France (FPF)
                et du Conseil National des Évangéliques de France (CNEF).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notre conseil d&apos;église</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Notre église est dirigée par un conseil composé du pasteur et d&apos;anciens élus par
                      l&apos;assemblée des membres.
                    </p>
                    <Link href="/infos-docs/membres" className="text-primary hover:underline">
                      Voir les membres du conseil →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nos activités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Découvrez les différentes activités et groupes qui animent la vie de notre communauté.
                    </p>
                    <Link href="/culte" className="text-primary hover:underline">
                      Voir nos activités →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nous rejoindre</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Vous êtes les bienvenus pour nous rejoindre lors d&apos;un culte ou d&apos;une autre activité.
                    </p>
                    <Link href="/notre-eglise/ou-sommes-nous" className="text-primary hover:underline">
                      Comment nous trouver →
                    </Link>
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