import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { ImageBlock } from "@/components/ui/image-block"
import EgliseSidebar from "../components/eglise/EgliseSidebar"

export const metadata: Metadata = {
  title: "Notre Église | Église Protestante Libre de Strasbourg",
  description: "Découvrez notre église, ses valeurs, son histoire et ses activités. Nous sommes une communauté chrétienne protestante, évangélique et libre à Strasbourg.",
}

export default function NotreEglise() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Notre Église</h1>

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
                  <span className="text-gray-700 dark:text-gray-200">Notre Église</span>
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

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-10">
                <h2 className="text-3xl font-semibold mb-6 dark:text-white">Bienvenue à l&apos;Église Protestante Libre de Strasbourg</h2>
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
                  <ImageBlock 
                    src="/images/hero/church-hero.png" 
                    alt="L'église protestante libre de Strasbourg"
                    type="content"
                    className="object-cover"
                    containerClassName="h-full"
                  />
                </div>
                <p className="text-lg mb-4 dark:text-gray-300">
                  L&apos;Église Protestante Libre de Strasbourg est une communauté chrétienne vivante, enracinée dans la
                  foi biblique et ouverte à tous. Notre désir est d&apos;être un lieu où chacun peut découvrir et
                  approfondir sa relation avec Dieu dans une atmosphère chaleureuse et accueillante.
                </p>
                <p className="text-lg dark:text-gray-300">
                  Notre église fait partie de l&apos;Union des Églises Évangéliques Libres de France, un mouvement fondé
                  au 19ème siècle pour promouvoir une expression de la foi protestante à la fois fidèle à la Bible et
                  indépendante de l&apos;État.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <Card>
                  <CardHeader>
                    <CardTitle>Qui sommes-nous ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base dark:text-gray-300">
                      Découvrez notre identité, notre vision et notre mission en tant qu&apos;église chrétienne protestante et
                      évangélique.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary/10 dark:text-white"
                    >
                      <Link href="/notre-eglise/qui-sommes-nous">En savoir plus</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nos valeurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base dark:text-gray-300">
                      Explorez les valeurs fondamentales qui guident notre vie d&apos;église et notre témoignage dans le monde.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary/10 dark:text-white"
                    >
                      <Link href="/notre-eglise/nos-valeurs">En savoir plus</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Où sommes-nous ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base dark:text-gray-300">
                      Trouvez notre lieu de culte et nos coordonnées pour nous rejoindre facilement.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary/10 dark:text-white"
                    >
                      <Link href="/notre-eglise/ou-sommes-nous">En savoir plus</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notre histoire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base dark:text-gray-300">
                      Plongez dans l&apos;histoire de notre église et de l&apos;Union des Églises évangéliques libres.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary/10 dark:text-white"
                    >
                      <Link href="/notre-eglise/histoire">En savoir plus</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 