import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import EgliseSidebar from "../../components/eglise/EgliseSidebar"

export const metadata: Metadata = {
  title: "Nos valeurs | Église Protestante Libre de Strasbourg",
  description: "Découvrez les valeurs fondamentales qui animent notre église : la centralité de la Bible, l'amour et la grâce, l'authenticité, la communauté, le service et la liberté",
}

export default function NosValeurs() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
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
                  <span className="mx-2 text-muted-foreground">/</span>
                  <Link href="/notre-eglise" className="text-primary hover:text-primary/80">
                    Notre Église
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Nos valeurs</span>
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
              {/* 1. Nous sommes une Église protestante */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">1. Nous sommes une Église protestante</h2>
                <p className="mb-6">
                  Nous nous situons dans la lignée de la Réforme protestante du XVIème siècle qui se caractérise
                  par cinq grandes affirmations (les cinq solas) :
                </p>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">À Dieu seul la gloire</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Toute l&apos;histoire humaine doit tourner autour de Dieu et ce qui compte en définitive,
                        c&apos;est sa gloire. Nous sommes créés pour le connaître, pour le servir, et pour le
                        glorifier. Tout ce que nous faisons doit viser cette fin.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">L&apos;essentiel, c&apos;est la foi</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Le salut se reçoit par la foi seule, sans aucune considération de nos mérites. C&apos;est
                        par la foi que nous embrassons l&apos;œuvre de Jésus, et cette foi, nous la devons à
                        l&apos;action gratuite du Saint-Esprit dans notre cœur. Rien ne doit être ajouté à la foi.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">La Bible seule</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Nous ne reconnaissons pas d&apos;autre autorité finale et suprême que la Bible. La Bible est
                        pour nous inspirée de Dieu, normative et suffisante. Aucune tradition d&apos;Église ni aucun
                        magistère d&apos;institution religieuse ne peut se substituer à la Bible.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">Se réformer sans cesse</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        La Réforme n&apos;est jamais terminée. L&apos;Église a besoin d&apos;être réformée sans cesse
                        selon la Parole de Dieu. Le retour au texte de la Bible doit être une constante de nos
                        communautés. Nous sommes appelés à nous laisser toujours réformer par Dieu et par sa Parole.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">Le sacerdoce universel</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Tout croyant a accès directement à Dieu par Jésus-Christ, et peut le prier sans passer
                        par aucun intermédiaire humain. Par ailleurs, tout chrétien a le sacerdoce de
                        l&apos;intercession : il peut prier pour les autres, et les autres peuvent prier pour lui.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 2. Nous sommes une Église évangélique */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">2. Nous sommes une Église évangélique</h2>
                <Card className="bg-muted/50">
                  <CardContent className="p-6 space-y-4">
                    <p>
                      Le mot évangélique vient du mot &quot;Évangile&quot;, qui signifie &quot;bonne nouvelle&quot;. Nous croyons que
                      la Bible contient l&apos;Évangile, la bonne nouvelle de ce que Dieu a fait pour nous en Jésus-Christ.
                    </p>
                    <p>
                      Nous insistons sur la nécessité de la conversion personnelle à Jésus-Christ. Nous croyons que
                      chacun doit répondre personnellement à l&apos;appel de Dieu, en plaçant sa confiance en Jésus-Christ
                      comme Sauveur et Seigneur.
                    </p>
                    <p>
                      Nous sommes attachés à la proclamation de l&apos;Évangile. Le témoignage et l&apos;évangélisation font
                      partie intégrante de notre identité.
                    </p>
                    <div className="bg-primary/10 border-l-4 border-primary p-4 mt-4">
                      <p className="font-medium">
                        Notre Église est membre du <strong>Conseil National des Évangéliques de France (CNEF)</strong>,
                        qui regroupe plus de 600 000 protestants évangéliques en France.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 3. Nous sommes une Église libre */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">3. Nous sommes une Église libre</h2>
                <p className="mb-6">
                  Le mot &quot;libre&quot; dans notre nom signifie plusieurs choses importantes pour nous :
                </p>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">La communauté des croyants</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Nous croyons que l&apos;Église locale est composée de ceux qui professent personnellement leur
                        foi en Jésus-Christ. L&apos;appartenance à l&apos;Église n&apos;est pas automatique, mais résulte d&apos;une
                        décision personnelle de suivre Christ et de s&apos;engager dans une communauté de disciples.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">L&apos;autonomie de l&apos;Église locale</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Chaque Église locale est autonome dans sa gestion et ses décisions, sous la seule autorité
                        de Jésus-Christ et de sa Parole. Il n&apos;y a pas de hiérarchie ecclésiastique au-dessus de
                        l&apos;Église locale. Notre Union d&apos;Églises existe pour favoriser la communion fraternelle et
                        la coopération entre Églises sœurs.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">L&apos;importance de l&apos;évangélisation</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Nous sommes attachés à la liberté d&apos;annoncer l&apos;Évangile. Nous croyons que chaque
                        chrétien est appelé à être témoin de sa foi et que l&apos;Église a pour mission de proclamer
                        la bonne nouvelle de Jésus-Christ à tous.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">La liberté religieuse</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Nous défendons la liberté de conscience et de culte pour tous. Chacun doit être libre de
                        croire et de pratiquer sa foi (ou de ne pas croire) sans contrainte de la part de l&apos;État
                        ou de toute autre autorité.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">La séparation de l&apos;Église et de l&apos;État</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p>
                        Nous sommes attachés à la séparation de l&apos;Église et de l&apos;État. Notre Église ne reçoit
                        aucun financement public et ne dépend d&apos;aucune autorité civile pour son organisation et
                        son fonctionnement. Nous vivons du soutien libre et volontaire de nos membres. En même temps,
                        nous respectons les autorités civiles et nous nous efforçons d&apos;être de bons citoyens,
                        tout en reconnaissant que notre première allégeance va à Dieu.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Liens vers autres pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle>Qui sommes-nous ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Découvrez notre identité, notre déclaration de foi et nos relations avec d&apos;autres Églises.
                    </p>
                    <Link href="/notre-eglise/qui-sommes-nous" className="text-primary hover:underline">
                      En savoir plus →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle>Où sommes-nous ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Trouvez notre lieu de culte et nos coordonnées pour nous rejoindre facilement.
                    </p>
                    <Link href="/notre-eglise/ou-sommes-nous" className="text-primary hover:underline">
                      Voir l&apos;adresse →
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