import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import EgliseSidebar from "../../components/eglise/EgliseSidebar"
import { Clock, MapPin } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"

export const metadata: Metadata = {
  title: "Qui sommes-nous | Église Protestante Libre de Strasbourg",
  description: "Découvrez notre identité protestante, évangélique et libre, notre devise et notre déclaration de foi",
}

export default function QuiSommesNous() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Notre Église", href: "/notre-eglise" },
    { label: "Qui sommes-nous", href: "/notre-eglise/qui-sommes-nous", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Qui sommes-nous ?"
        breadcrumbs={breadcrumbItems}
      />

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
              {/* En-tête avec horaires */}
              <Card className="mb-10 border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-primary">Culte le dimanche à 10h00</h2>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">À l&apos;église Saint-Marc</p>
                        <p className="text-muted-foreground">18 rue de Franche-Comté</p>
                        <p className="text-muted-foreground">67380 Lingolsheim</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* La devise de l'Union */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">La devise de l&apos;Union</h2>
                <Card className="bg-muted/50">
                  <CardContent className="p-8 text-center">
                    <p className="text-xl font-semibold mb-2 text-primary">
                      Dans les choses essentielles, fidélité
                    </p>
                    <p className="text-xl font-semibold mb-2 text-primary">
                      Dans les choses secondaires, liberté
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      En toutes choses charité
                    </p>
                  </CardContent>
                </Card>
                <div className="mt-4">
                  <p className="text-muted-foreground mb-2">
                    <strong>Historique de l&apos;Union des Églises Évangéliques libres :</strong>
                  </p>
                  <Link
                    href="http://www.museeprotestant.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Site du Musée du Protestantisme →
                  </Link>
                </div>
              </div>

              {/* Déclaration de foi de l'UEEL */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">Déclaration de foi de l&apos;UEEL</h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <p>
                      Dieu, après avoir parlé au peuple d&apos;Israël par ses prophètes, s&apos;est révélé parfaitement en
                      son Fils Jésus-Christ. La Bible est l&apos;expression infaillible de cette révélation. Fondés sur
                      cette Écriture sainte, en communion avec l&apos;Église universelle et en particulier avec les Églises
                      de la Réforme, nous déclarons notre foi en ces termes :
                    </p>

                    <p>
                      <strong>Nous croyons en Dieu</strong>, le Père, le Fils et le Saint-Esprit, un seul Dieu béni éternellement.
                      Il a crée le ciel et la terre, les choses visibles et invisibles, il a fait l&apos;homme à son image.
                      L&apos;homme s&apos;est révolté contre son Dieu, encourant ainsi sa colère. Dès lors, captive du mensonge,
                      incapable de servir son créateur, l&apos;humanité est livrée à la perdition. Mais Dieu dans sa miséricorde,
                      ne l&apos;a pas abandonnée à la mort, il a envoyé son Fils dans le monde.
                    </p>

                    <p>
                      <strong>Nous croyons en Jésus-Christ</strong>, né de la vierge Marie, vrai Dieu et vrai homme, médiateur
                      d&apos;une alliance nouvelle par laquelle la vérité et la vie sont offertes aux hommes. Il a donné sa vie
                      en sacrifice, une fois pour toutes, sur la croix. Livré pour nos fautes, il est ressuscité pour notre
                      justification. Il est les prémices de notre propre résurrection. Élevé à la droite du Père, il est
                      l&apos;unique voie du salut.
                    </p>

                    <p>
                      <strong>Nous croyons en l&apos;Esprit-Saint</strong> qui communique la vérité et la vie du Fils à ceux
                      que le Père appelle dans sa miséricorde et sauve par grâce. Unis par l&apos;Esprit au Christ ressuscité,
                      nous devenons enfants de Dieu par la nouvelle naissance. Justifiés gratuitement par le moyen de la foi
                      en Jésus-Christ, nous sommes en paix avec Dieu.
                    </p>

                    <p>
                      <strong>L&apos;Église</strong> est formée de tous ceux que le Christ a réconciliés avec Dieu. Habitée
                      par l&apos;Esprit, elle est le temple de Dieu édifié par le Christ. Elle est visible localement dans des
                      communautés qui, nous le croyons, doivent rassembler ceux qui professent leur foi en Jésus Christ. Après
                      avoir répondu personnellement à l&apos;appel de Dieu, ils s&apos;appliquent à le servir ensemble, conduits
                      par l&apos;Esprit du Christ, et soumis à sa Parole.
                    </p>

                    <p>
                      L&apos;amour de Dieu étant la source et le fondement de notre salut, nous voulons aimer nos frères et
                      soeurs en Christ et proclamer l&apos;Evangile sans lequel il n&apos;y a pas de salut. Nous voulons aussi,
                      aimer notre prochain en travaillant pour la paix et la justice, jusqu&apos;à la venue de notre Seigneur
                      Jésus-Christ. Car il reviendra pour juger toute créature et établir son règne. Nous attendons selon sa
                      promesse, de nouveaux cieux et une nouvelle terre où la justice habitera. Telle est notre espérance.
                    </p>

                    <div className="bg-primary/10 border-l-4 border-primary p-4 mt-6">
                      <p className="text-sm font-medium">
                        Notre Union d&apos;Églises est membre :<br />
                        • de la Fédération Protestante de France (FPF)<br />
                        • du Conseil National des Évangéliques de France (CNEF)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* PLV, le magazine */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">PLV, le magazine</h2>
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle>PLV, le magazine en ligne des Églises évangéliques libres !</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <blockquote className="border-l-4 border-primary pl-4 italic">
                      &quot;Nous n&apos;avons pas de puissance contre la vérité, nous n&apos;en avons que pour la vérité&quot;
                      <br />
                      <span className="text-sm">La Bible : 2 Corinthiens 13 v. 8</span>
                    </blockquote>
                    <p>
                      Dieu a été révélé par la vérité donc de Dieu découle la vérité, il n&apos;y a pas eu de séparation entre
                      vérité et Dieu. Dieu a été incarné et révélé par la foi du Christ qui est révélé pour que cette révélation
                      qui est en Jésus-Christ, soit Révélée à l&apos;homme d&apos;aujourd&apos;hui.
                    </p>
                    <Link
                      href="https://www.plv-eel.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-primary hover:underline font-medium"
                    >
                      Le site de PLV →
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Relations */}
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">Relations</h2>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notre Église est membre :</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>• de l&apos;Union des Églises Évangéliques Libres de France (UEEL)</p>
                      <p>• du Conseil National des Évangéliques de France (CNEF)</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Partenariats locaux</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p className="mb-4">
                        La CPS réunit principalement des paroisses luthériennes et réformées (UEPAL) ainsi que quelques
                        Églises évangéliques de la métropole strasbourgeoise.
                      </p>
                      <p className="font-medium mb-2">Par ailleurs, nous entretenons des relations avec :</p>
                      <p>• l&apos;Église FEG de Karl-Sundheim dans l&apos;Ortenau voisin</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-6">
                      <p className="font-medium mb-2">Notre Union d&apos;Églises est membre :</p>
                      <p>• de la Fédération Protestante de France (FPF)</p>
                      <p>• du Conseil National des Évangéliques de France (CNEF)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Liens utiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nos valeurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Découvrez ce qui nous caractérise en tant qu&apos;église protestante, évangélique et libre.
                    </p>
                    <Link href="/notre-eglise/nos-valeurs" className="text-primary hover:underline">
                      En savoir plus →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Nous contacter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Une question ? Envie de nous rencontrer ? N&apos;hésitez pas à nous écrire.
                    </p>
                    <Link href="/contact" className="text-primary hover:underline">
                      Contactez-nous →
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
