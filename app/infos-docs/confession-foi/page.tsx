import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Sidebar from "../components/Sidebar"

export const metadata: Metadata = {
  title: "Confession de Foi - Église Protestante Libre de Strasbourg",
  description: "Découvrez la confession de foi de l'Église Protestante Libre de Strasbourg et de l'Union des Églises évangéliques libres de France."
}

export default function ConfessionFoi() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Confession de Foi</h1>

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
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos & Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-300">/</span>
                  <span className="text-gray-700 dark:text-gray-200">Confession de Foi</span>
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
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Notre Confession de Foi</CardTitle>
                    <CardDescription>
                      Ce que nous croyons en tant qu'Église Protestante Libre
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <p>
                      En tant qu'Église Protestante Libre de Strasbourg, nous adhérons à la confession de foi de l'Union des Églises évangéliques libres de France (UEEL), qui exprime les convictions fondamentales de notre foi chrétienne.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Préambule</h3>
                    <p>
                      L'Église évangélique libre affirme sa foi en Jésus-Christ, son Seigneur et son Sauveur, et sa volonté de le servir selon les Écritures. Elle s'inscrit dans la tradition de la Réforme protestante et confesse le Symbole des Apôtres.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Les Écritures</h3>
                    <p>
                      Nous croyons que l'Écriture Sainte, l'Ancien et le Nouveau Testament, est la Parole de Dieu. Elle est inspirée par Dieu en totalité et dans toutes ses parties. Elle est l'autorité souveraine en matière de foi et de vie. Tout ce qui est nécessaire au salut s'y trouve clairement révélé.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Dieu</h3>
                    <p>
                      Nous croyons en un seul Dieu, personnel, spirituel, éternel, infini en sainteté, en sagesse, en puissance et en amour, qui est Père, Fils et Saint-Esprit.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Jésus-Christ</h3>
                    <p>
                      Nous croyons en Jésus-Christ, Fils éternel de Dieu, qui par sa naissance miraculeuse, sa vie sans péché, ses miracles, sa mort expiatoire, sa résurrection corporelle, son ascension et son retour visible et glorieux, est le seul et unique médiateur entre Dieu et les hommes.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Le Saint-Esprit</h3>
                    <p>
                      Nous croyons au Saint-Esprit, personne divine, qui régénère le pécheur et habite en tout croyant. Il le conduit dans la vérité, le sanctifie, lui communique les dons nécessaires au service de Dieu et témoigne de son adoption.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">L'Homme et le Péché</h3>
                    <p>
                      Nous croyons que l'homme a été créé à l'image de Dieu, mais qu'il est déchu par sa désobéissance volontaire. Sa nature est désormais encline au mal. Séparé de Dieu et incapable de se sauver lui-même, il est perdu sans l'intervention miséricordieuse de Dieu.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Le Salut</h3>
                    <p>
                      Nous croyons que le salut, don gratuit de Dieu, est acquis par la foi en Jésus-Christ, qui est mort pour nos péchés et ressuscité pour notre justification. Par sa grâce, Dieu nous rend justes par le mérite de Christ seul, indépendamment de nos œuvres.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">L'Église</h3>
                    <p>
                      Nous croyons que l'Église universelle est l'ensemble des rachetés de tous les temps. Communauté fraternelle, elle est appelée à célébrer le culte en esprit et en vérité, à proclamer l'Évangile et à servir Christ dans le monde. L'Église locale est une assemblée de croyants baptisés qui s'organisent selon l'enseignement du Nouveau Testament.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Les Baptêmes et la Cène</h3>
                    <p>
                      Nous croyons que le baptême des croyants par immersion et la Cène sont des ordonnances instituées par Jésus-Christ que l'Église doit observer jusqu'à son retour.
                    </p>

                    <h3 className="mt-6 mb-4 text-xl font-semibold">Le Retour de Christ</h3>
                    <p>
                      Nous croyons au retour visible de Jésus-Christ, à la résurrection des morts, au jugement final, à la vie éternelle des rachetés et à la condamnation des perdus.
                    </p>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button variant="outline" asChild>
                    <Link href="/infos-docs">Retour à la section Infos & Docs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 