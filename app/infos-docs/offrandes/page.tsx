import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { HeartIcon, CreditCardIcon, BanknoteIcon as BankIcon, HandIcon } from "lucide-react"
import Sidebar from "../components/Sidebar"

export const metadata = {
  title: "Offrandes et soutien - Église Protestante Libre de Strasbourg",
  description: "Découvrez comment soutenir financièrement l'œuvre de l'Église Protestante Libre de Strasbourg par vos dons et offrandes et bénéficier d'une déduction fiscale"
}

export default function OffrandesPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
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
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos & Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700">Offrandes</span>
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
            <p className="text-lg text-gray-600">
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
                  <p>
                    La Bible nous enseigne que donner fait partie intégrante de notre vie de foi. C&apos;est un acte de
                    reconnaissance envers Dieu pour tout ce qu&apos;il nous donne.
                  </p>
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
                      <div className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-slate-700 p-4 rounded-md mb-4">
                        <p className="font-medium dark:font-semibold dark:text-white">Église Protestante Libre de Strasbourg</p>
                        <p className="dark:text-gray-100">IBAN : FR76 XXXX XXXX XXXX XXXX XXXX XXX</p>
                        <p className="dark:text-gray-100">BIC : XXXXXXXX</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
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
                        Vous pouvez envoyer un chèque à l&apos;ordre de &quot;Église Protestante Libre de Strasbourg&quot;
                        à l&apos;adresse suivante :
                      </p>
                      <div className="bg-slate-50 p-4 rounded-md mb-4">
                        <p className="font-medium">Église Protestante Libre de Strasbourg</p>
                        <p>7 rue des Écrivains</p>
                        <p>67000 Strasbourg</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Vous pouvez également déposer votre chèque dans la boîte aux lettres de l&apos;église ou lors du
                        culte.
                      </p>
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
                        Vous pouvez faire un don en espèces lors des cultes dominicaux. Un moment est prévu pendant le
                        culte pour les offrandes.
                      </p>
                      <p className="text-sm text-gray-600">
                        Des enveloppes sont disponibles à l&apos;entrée du temple si vous souhaitez que votre don reste
                        confidentiel.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Déduction fiscale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    L&apos;Église Protestante Libre de Strasbourg est habilitée à délivrer des reçus fiscaux pour les dons
                    qui lui sont adressés.
                  </p>
                  <p className="mb-4">
                    En tant que particulier, vous pouvez déduire de votre impôt sur le revenu 66% du montant de votre don,
                    dans la limite de 20% de votre revenu imposable.
                  </p>
                  <p className="mb-4">
                    Par exemple, un don de 100€ ne vous coûte réellement que 34€ après déduction fiscale.
                  </p>
                  <p className="text-sm text-gray-600">
                    Un reçu fiscal vous sera envoyé au début de l&apos;année suivant votre don pour votre déclaration
                    d&apos;impôts.
                  </p>
                </CardContent>
              </Card>

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