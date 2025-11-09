'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ImageBlock } from "@/components/ui/image-block"
import { useRouter } from "next/navigation"

export default function HistoirePage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Notre Histoire</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href="/notre-eglise" className="hover:text-primary transition-colors">
            Notre Église
          </Link>
          <span className="mx-2">/</span>
          <span>Histoire</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-16">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          {/* EgliseSidebar remplacé par une navigation simple pour éviter les erreurs */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Notre Église</h2>
              <nav className="space-y-2">
                <Link
                  href="/notre-eglise/qui-sommes-nous"
                  className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Qui sommes-nous
                </Link>
                <Link 
                  href="/notre-eglise/nos-valeurs" 
                  className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Nos valeurs
                </Link>
                <Link 
                  href="/notre-eglise/ou-sommes-nous" 
                  className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Où sommes-nous
                </Link>
                <Link 
                  href="/notre-eglise/histoire" 
                  className="block p-2 rounded-md text-primary font-medium bg-slate-50 dark:bg-slate-800/50"
                >
                  Histoire
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Notre parcours</h2>
              <p className="text-lg mb-6">
                L'Église Protestante Libre de Strasbourg est le fruit d'une longue tradition de foi chrétienne
                ancrée dans les principes de la Réforme protestante et enrichie par diverses influences théologiques
                au fil des décennies.
              </p>
              <p className="mb-6">
                Notre communauté s'inscrit dans la continuité du mouvement des églises libres qui, dès le XIXe siècle,
                ont affirmé leur indépendance vis-à-vis de l'État tout en maintenant une fidélité aux principes
                fondamentaux de la foi chrétienne.
              </p>
            </div>
            <div className="relative h-64 lg:h-full">
              <ImageBlock
                src="/images/histoire/eglise-histoire.jpg"
                alt="Photo historique de l'église"
                type="content"
                className="object-cover"
                containerClassName="h-full"
                rounded="lg"
              />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Chronologie</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1855">
                <AccordionTrigger>1855 - Les premières rencontres</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        Les premières rencontres informelles ont lieu dans des maisons particulières. 
                        Un petit groupe de croyants se rassemble pour étudier la Bible et prier ensemble, 
                        en quête d'une expression de foi authentique et libre.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Réunion de maison historique"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="1872">
                <AccordionTrigger>1872 - Constitution officielle</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        L'assemblée se constitue officiellement en tant qu'Église Protestante Libre, 
                        adoptant une confession de foi et des statuts propres. Cette étape marque 
                        l'indépendance de la communauté vis-à-vis des structures ecclésiastiques établies.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Document historique"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="1920">
                <AccordionTrigger>1920 - Premier lieu de culte</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        Acquisition du premier lieu de culte dédié, permettant à la communauté de se 
                        développer et d'accueillir davantage de personnes. Ce bâtiment modeste 
                        devient un lieu de vie spirituelle intense et de témoignage dans le quartier.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Ancien bâtiment de l'église"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="1968">
                <AccordionTrigger>1968 - Renouveau charismatique</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        L'église est touchée par le mouvement de renouveau charismatique qui traverse 
                        de nombreuses dénominations chrétiennes. Cette période apporte un nouveau 
                        dynamisme spirituel et une croissance significative de la communauté.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Culte des années 70"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="1995">
                <AccordionTrigger>1995 - Déménagement</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        Face à la croissance de l'assemblée, l'église déménage dans des locaux plus 
                        spacieux dans le quartier actuel. Ce nouveau bâtiment permet de développer 
                        davantage d'activités et de ministères pour servir la communauté locale.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Nouvel emplacement de l'église"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2010">
                <AccordionTrigger>2010 - Renouvellement et vision</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        L'église adopte une nouvelle vision pour les années à venir, axée sur 
                        l'évangélisation, la formation de disciples et le service de la 
                        communauté locale. Cette période marque un tournant dans la vie de l'église.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Équipe pastorale en réunion"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="today">
                <AccordionTrigger>Aujourd'hui - Une église pour tous</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        Notre église continue de grandir et d'évoluer, tout en restant fidèle à ses 
                        racines et à sa mission fondamentale. Nous sommes une communauté 
                        intergénérationnelle et multiculturelle, ouverte à tous et désireuse de 
                        partager l'amour du Christ dans notre ville.
                      </p>
                    </div>
                    <div className="relative h-48">
                      <ImageBlock
                        src="/placeholder.svg?height=200&width=300"
                        alt="Notre communauté aujourd'hui"
                        type="content"
                        className="object-cover"
                        containerClassName="h-full"
                        rounded="lg"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-16">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Notre héritage théologique</h2>
                <p className="mb-4">
                  Notre église s'inscrit dans la tradition protestante évangélique, influencée à la fois par :
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>L'héritage de la Réforme (Luther, Calvin)</li>
                  <li>Le mouvement du Réveil du XIXe siècle</li>
                  <li>Le renouveau charismatique du XXe siècle</li>
                  <li>Une ouverture œcuménique aux autres traditions chrétiennes</li>
                </ul>
                <p>
                  Cette richesse d'influences nous permet d'aborder la foi chrétienne avec à la fois
                  un solide ancrage biblique et une ouverture aux diverses expressions de la spiritualité chrétienne.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">En savoir plus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="relative h-48 mb-4">
                    <ImageBlock
                      src="/placeholder.svg?height=200&width=400"
                      alt="Nos archives"
                      type="content"
                      className="object-cover rounded-lg"
                      containerClassName="h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Nos archives</h3>
                  <p className="mb-4">
                    Consultez nos archives historiques pour découvrir les documents, 
                    photographies et témoignages qui racontent notre histoire en détail.
                  </p>
                  <Link 
                    href="/contact" 
                    className="text-primary hover:underline"
                  >
                    Contacter notre équipe pour une visite des archives
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="relative h-48 mb-4">
                    <ImageBlock
                      src="/placeholder.svg?height=200&width=400"
                      alt="L'Union des Églises Évangéliques Libres"
                      type="content"
                      className="object-cover rounded-lg"
                      containerClassName="h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">L'Union des ÉÉEL</h3>
                  <p className="mb-4">
                    Découvrez l'histoire et les valeurs de l'Union des Églises 
                    Évangéliques Libres, dont notre église fait partie depuis sa fondation.
                  </p>
                  <Link 
                    href="/infos-docs/union-eglise" 
                    className="text-primary hover:underline"
                  >
                    En savoir plus sur l'Union
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 