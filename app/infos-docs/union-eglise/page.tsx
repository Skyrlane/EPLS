import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block"

export const metadata: Metadata = {
  title: "Union des Églises Évangéliques Libres | Église Protestante Libre de Strasbourg",
  description: "Découvrez l'Union des Églises Évangéliques Libres de France (UEEL), membre de la FPF et du CNEF, son magazine PLV, ses églises et sa Commission Synodale",
  keywords: ["UEEL", "Union des Églises", "Église Libre", "protestantisme", "évangélique", "FPF", "CNEF", "PLV Magazine", "Strasbourg"]
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
                  {/* Intro avec logo */}
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="md:w-1/3">
                      <div className="relative w-64 h-64 mx-auto">
                        <DynamicImageBlock
                          zone="ueel-logo"
                          fallbackSrc="/placeholder.svg?height=400&width=400"
                          alt="Logo de l'Union des Églises Évangéliques Libres"
                          type="avatar"
                          width={400}
                          height={400}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-bold mb-4">L&apos;Union des Églises Évangéliques Libres</h2>
                      <p className="text-lg mb-4">
                        L&apos;UEEL est une union d&apos;Églises locales qui adhèrent à une confession de foi commune.
                      </p>
                    </div>
                  </div>

                  {/* Section 1 : Présentation */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Présentation</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="mb-4">
                        L&apos;UEEL est une union d&apos;Églises locales qui adhèrent à une confession de foi commune. Elle est :
                      </p>
                      <ul className="space-y-2">
                        <li>Membre de la <strong>Fédération Protestante de France (FPF)</strong></li>
                        <li>Membre du <strong>Conseil National des Évangéliques de France (CNEF)</strong></li>
                        <li>Membre du Conseil National des Évangéliques de France de l&apos;Intermédiaire de la <strong>Fédération Internationale des Églises Évangéliques Libres (IFFEC)</strong></li>
                        <li>Partenaire du <strong>Bund Freier evangelischer Gemeinden (BFeG)</strong></li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Section 2 : PLV Magazine */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>PLV, le magazine...</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="text-xl font-semibold mb-4 text-primary">
                        en ligne des Églises évangéliques libres !
                      </p>
                      <blockquote className="border-l-4 border-primary pl-4 italic mb-4">
                        &quot;Nous n&apos;avons pas de puissance contre la vérité, nous n&apos;en avons que pour la vérité&quot;
                        <footer className="text-sm mt-2">— La Bible : 2 Corinthiens 13 v. 8</footer>
                      </blockquote>
                      <p className="mb-4">
                        Dans sa visibilité l&apos;évangile ne doit pas être mis sous le boisseau mais avec une seule inspiration : la foi en Christ qui la Bible.
                      </p>
                      <Button asChild variant="outline" className="mt-4">
                        <a
                          href="https://plvmagazine.fr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Le site de PLV
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Section 3 : Annuaire */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Annuaire des Églises de l&apos;Union</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Consultez la liste complète des Églises membres de l&apos;Union des Églises Évangéliques Libres de France.
                      </p>
                      <Button asChild variant="outline">
                        <a
                          href="https://www.eglises-libres.fr/annuaire"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Liste des Églises
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Section 4 : Vitalité */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Vitalité</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p>
                        Cette démarche touche à la vie de la communauté, à l&apos;espoir d&apos;une passion, et reste un projet et l&apos;Église en présence à la fois face et réquis : Qui ne peut y prendre des nourriciers. On ne devient pas par hasard une communauté bouleversante de vitalité. Il faut en passer par le discours, inspirée par l&apos;Esprit, d&apos;oter de l&apos;avant et de devenir une église qui s&apos;engage de manière réaliste dans une action de communion durable.
                      </p>
                      <p>
                        Par &quot;témoignage&quot;, nous voulons dire qui accomplir dans le monde la mission que le Christ a confiée à son Église.
                      </p>
                      <p>
                        L&apos;Église n&apos;est pas pour autant réduite à une façade à laquelle il faudrait simplement donner de l&apos;éclat communautaire : il définit de l&apos;édifice d&apos;une Église solide et missionnaire, et quatre types de fonctionnement d&apos;Église, tous s&apos;abordent pas, la grâce peut accompagner chaque étape de son parcours, la niche ou lumière pas pour elle elle le sacre.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Section 5 : Commission Synodale */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>La Commission Synodale</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="mb-4">
                        La Commission synodale est élue par le Synode (rassemblement de délégués de toutes les Églises ayant lieu tous les deux ans). Elle compte 11 membres, 8 pasteurs et 3 laïcs + 4 représentants du Pôle Développement.
                      </p>
                      <h4 className="font-bold mt-6 mb-3">Commission élues lors du Synode du 13 mai 2021 :</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>Président :</strong> Vincent Mecchi (pasteur à Toulouse)</p>
                          <p><strong>Vice-président :</strong> Christian Fornas (EEL Avignon)</p>
                          <p><strong>Secrétaire :</strong> Florence Weissenbach (EEL Saint-Louis)</p>
                          <p><strong>Trésorier :</strong> Olivier Dugand (EEL Valence)</p>
                          <p><strong>Secrétaire Général :</strong> Jérôme Chamard (Pasteur à Valence)</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Membres :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Sylvie Levenets (EEL Orléans)</li>
                            <li>Luc Potanchek (EEL Moulin-en-Yvelines)</li>
                            <li>Florence Venaille (pasteur à Toulouse)</li>
                            <li>Etienne Weissenbach (secrétaire missions / Chef de l&apos;Aumônerie protestante aux Armées)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 6 : Cahiers de l'Union */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Les cahiers de l&apos;Union</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="mb-4">
                        Ces cahiers constituent un lien entre les Églises de notre Union. Ils comportent des nouvelles informatives et/ou édifiantes concernées les Églises, des informations liées à l&apos;Union, ainsi que des enseignements et des réflexions théologiques ou éthiques sur des diverses choses encore. 
                      </p>
                      <p className="mb-4">
                        Nous espérons que ceux-ci pourront vous être utiles dans votre enseignement, votre étude, et tout simplement un outil bulletin d&apos;information, mais sans un livret de prière renouvellent l&apos;information.
                      </p>
                      <Button asChild variant="outline">
                        <a
                          href="https://www.eglises-libres.fr/ressources/cahiers"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Télécharger les Cahiers de l&apos;Union
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Boutons d'action */}
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-12">
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