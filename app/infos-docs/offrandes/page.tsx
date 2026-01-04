import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { HeartIcon, CreditCardIcon, BanknoteIcon as BankIcon, HandIcon } from "lucide-react"
import Sidebar from "../components/Sidebar"

export const metadata = {
  title: "Offrandes et soutien - Église Protestante Libre de Strasbourg",
  description: "Découvrez comment soutenir financièrement l'œuvre de l'Église Protestante Libre de Strasbourg par vos dons et offrandes"
}

export default function OffrandesPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Offrandes et soutien</h1>

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
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos & Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Offrandes</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Soutenir l&apos;œuvre de Dieu</h2>
            <p className="text-lg text-muted-foreground">
              Votre soutien financier permet à notre église de poursuivre sa mission d&apos;annonce de l&apos;Évangile
              et de service auprès de notre communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartIcon className="h-5 w-5 text-primary" />
                    Pourquoi soutenir l&apos;église ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    L&apos;Église Protestante Libre de Strasbourg ne reçoit aucune subvention de l&apos;État. Son
                    fonctionnement et ses activités dépendent entièrement des dons et offrandes des fidèles.
                  </p>
                  <p className="mb-4">Votre soutien financier permet de :</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Maintenir et entretenir notre lieu de culte</li>
                    <li>Soutenir le ministère pastoral</li>
                    <li>Financer nos activités d&apos;évangélisation et d&apos;enseignement</li>
                    <li>Développer nos actions sociales et caritatives</li>
                    <li>Soutenir des missions en France et à l&apos;étranger</li>
                  </ul>
                  <p className="mb-4">
                    La Bible nous enseigne que donner fait partie intégrante de notre vie de foi. C&apos;est un acte de
                    reconnaissance envers Dieu pour tout ce qu&apos;il nous donne.
                  </p>
                  <div className="bg-primary/10 border-l-4 border-primary p-4 mt-4">
                    <p className="text-sm">
                      <strong>Note importante :</strong> Notre Église est membre de l&apos;Union des Églises évangéliques 
                      libres de France, et à travers elle, de la Fédération protestante de France (FPF) et du Conseil 
                      national des Évangéliques de France (CNEF). Notre pasteur est rémunéré par les dons des fidèles 
                      et notre association cultuelle ne recherche ni ne bénéficie d&apos;aucune subvention. Si vous avez 
                      à cœur de nous soutenir, ponctuellement ou régulièrement, vous pouvez utiliser les coordonnées 
                      bancaires ci-dessous pour effectuer un virement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="virement" className="mb-8">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="virement">Virement bancaire</TabsTrigger>
                  <TabsTrigger value="cheque">Chèque</TabsTrigger>
                  <TabsTrigger value="especes">Espèces</TabsTrigger>
                </TabsList>

                <TabsContent value="virement">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BankIcon className="h-5 w-5 text-primary" />
                        Virement bancaire
                      </CardTitle>
                      <CardDescription>Le moyen le plus simple pour des dons réguliers ou ponctuels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Vous pouvez effectuer un virement bancaire sur le compte de l&apos;église :</p>
                      <div className="bg-muted border border-border p-4 rounded-md mb-4">
                        <p className="font-semibold mb-2">Église Protestante Libre de Strasbourg</p>
                        <p className=" font-mono text-sm mb-1">
                          <strong>IBAN :</strong> FR76 1027 8012 2800 0200 2160 192
                        </p>
                        <p className=" font-mono text-sm">
                          <strong>BIC :</strong> CMCIFR2A
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Merci d&apos;indiquer &quot;Don&quot; ou &quot;Offrande&quot; en libellé de votre virement.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cheque">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCardIcon className="h-5 w-5 text-primary" />
                        Chèque
                      </CardTitle>
                      <CardDescription>Pour les dons par chèque</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Vous pouvez également faire un don par chèque.
                      </p>
                      <p className="mb-4">
                        Libeller votre chèque à l&apos;ordre de : <strong>Église Protestante Libre de Strasbourg</strong>
                      </p>
                      <p className="mb-4">
                        Et l&apos;envoyer à l&apos;adresse suivante :
                      </p>
                      <div className="bg-muted border border-border p-4 rounded-md mb-4">
                        <p className="font-semibold">Église Protestante Libre de Strasbourg</p>
                        <p className="">18 Rue de Franche-Comté</p>
                        <p className="">67380 Lingolsheim</p>
                      </div>
                      
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="especes">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HandIcon className="h-5 w-5 text-primary" />
                        Espèces
                      </CardTitle>
                      <CardDescription>Pour les dons en espèces</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Vous pouvez déposer votre offrande en espèces lors des cultes.
                      </p>
                      <p className="mb-4">
                        Lors de chaque culte dominical, une corbeille est mise à disposition pour recueillir vos offrandes.
                      </p>
                      <p className="mb-4">
                        Vous pouvez également remettre votre don en mains propres à un membre du conseil ou au pasteur.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pour les dons importants, nous vous recommandons de privilégier le virement ou le chèque.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <p className="text-sm text-muted-foreground text-center bg-muted p-4 rounded-lg">
                💡 Pour toute question concernant les aspects fiscaux de vos dons, n&apos;hésitez pas à nous contacter.
              </p>

              <div className="text-center mt-8">
                <h3 className="text-2xl font-bold mb-4">Vous avez des questions ?</h3>
                <p className="mb-6">
                  N&apos;hésitez pas à nous contacter pour toute question concernant les dons et offrandes.
                </p>
                <Button asChild className="shadow-md">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 