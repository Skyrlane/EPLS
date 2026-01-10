import Link from "next/link"
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeartIcon, UsersIcon } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"

export const metadata = {
  title: "Association EVE - Église Protestante Libre de Strasbourg",
  description: "EVE est l'association culturelle adossée à l'Église Protestante Libre de Strasbourg. Association à but non lucratif couvrant la région de Strasbourg."
}

export default function EvePage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "EVE", href: "/infos-docs/eve", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Association EVE"
        breadcrumbs={breadcrumbItems}
      />

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
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="md:w-1/3">
                    <div className="relative w-64 h-64 mx-auto">
                      <DynamicImageBlock
                        zone="eve-logo"
                        fallbackSrc="/placeholder.svg?height=400&width=400"
                        alt="Logo Eau Vive Espoir"
                        type="avatar"
                        width={400}
                        height={400}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold mb-4">Notre association</h2>
                    <p className="text-lg mb-4">
                      EVE est l&apos;association culturelle adossée à l&apos;Église Protestante Libre de Strasbourg.
                    </p>
                    <p className="mb-4">
                      Notre association est à but non lucratif et compte une vingtaine de membres (tous bénévoles) 
                      et n&apos;a aucun salarié. Elle couvre, à partir de Lingolsheim, la région de Strasbourg 
                      (Eurométropole + Alsace).
                    </p>
                  </div>
                </div>

                {/* Notre bureau */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center">Notre bureau</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Composition du bureau</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="font-semibold text-primary">Président</p>
                          <p>Pierre Schlosser</p>
                        </div>
                        <div>
                          <p className="font-semibold text-primary">Vice-Président</p>
                          <p>David Thobois</p>
                        </div>
                        <div>
                          <p className="font-semibold text-primary">Secrétaire</p>
                          <p>Pierre Bauer</p>
                        </div>
                        <div>
                          <p className="font-semibold text-primary">Trésorier</p>
                          <p>Christophe Thobois</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-primary mb-2">Autres membres du CA</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Xialy Ya</li>
                          <li>Eric Gaentzler</li>
                          <li>Jean-Pierre Siegrist</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Comment nous soutenir */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center">Comment nous soutenir</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HeartIcon className="h-5 w-5 text-primary" />
                          Faire un don
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Vos dons permettent de financer nos actions. Vous pouvez faire un don
                          ponctuel ou régulier :
                        </p>
                        <div className="bg-muted border border-border p-4 rounded-md mb-4">
                          <p className="font-semibold mb-3">Titulaire du compte :</p>
                          <p className=" mb-3">
                            <strong>EAU VIVE ESPOIR</strong><br />
                            18 Rue de Franche-Comté<br />
                            67380 Lingolsheim
                          </p>
                          
                          <p className="font-semibold mb-2">Coordonnées bancaires :</p>
                          <p className=" font-mono text-sm mb-1">
                            <strong>IBAN :</strong> FR76 1027 8012 0000 0202 0230 165
                          </p>
                          <p className=" font-mono text-sm mb-3">
                            <strong>BIC :</strong> CMCIFR2A
                          </p>
                          
                          <p className="font-semibold mb-2">Établissement bancaire :</p>
                          <p className=" text-sm">
                            CCM PLAINE DE L&apos;ILL<br />
                            50 RUE DU GAL DE GAULLE<br />
                            CS 70023<br />
                            67151 ERSTEIN CEDEX
                          </p>
                        </div>
                        <Button asChild variant="outline" className="w-full mb-4">
                          <a href="/documents/rib-eve.pdf" download target="_blank" rel="noopener noreferrer">
                            Télécharger le RIB
                          </a>
                        </Button>
                        <Button asChild className="w-full bg-primary text-white shadow-md hover:bg-primary/90 hover:text-white">
                          <Link href="/infos-docs/offrandes">En savoir plus sur les dons</Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UsersIcon className="h-5 w-5 text-primary" />
                          Devenir bénévole
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Vous souhaitez vous engager comme bénévole dans nos activités ? 
                          Nous serions ravis de vous accueillir dans notre équipe.
                        </p>
                        <p className="mb-4">
                          Contactez-nous pour en savoir plus sur les possibilités d&apos;engagement 
                          et les besoins actuels de l&apos;association.
                        </p>
                        <Button asChild className="w-full bg-primary text-white shadow-md hover:bg-primary/90 hover:text-white">
                          <Link href="/contact">Nous contacter pour devenir bénévole</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Contactez-nous</h3>
                  <p className="mb-6">
                    Pour toute question concernant l&apos;association ou si vous souhaitez participer à nos actions,
                    n&apos;hésitez pas à nous contacter.
                  </p>
                  <Button asChild size="lg" className="shadow-md">
                    <Link href="/contact?sujet=eve">Contacter EVE</Link>
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