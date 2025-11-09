import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeartIcon, HandIcon, GlobeIcon, UsersIcon } from "lucide-react"
import Sidebar from "../components/Sidebar"

export const metadata = {
  title: "Association Eau Vive Espoir (EVE) - Église Protestante Libre de Strasbourg",
  description: "Découvrez l'association humanitaire Eau Vive Espoir (EVE) créée par l'Église Protestante Libre de Strasbourg pour venir en aide aux populations défavorisées"
}

export default function EvePage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Eau Vive Espoir (EVE)</h1>

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
                  <span className="text-gray-700 dark:text-gray-300">EVE</span>
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
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="md:w-1/3">
                    <div className="relative w-64 h-64 mx-auto">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Logo Eau Vive Espoir"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold mb-4">Notre association humanitaire</h2>
                    <p className="text-lg mb-4">
                      Eau Vive Espoir (EVE) est une association humanitaire créée par l&apos;Église Protestante Libre de
                      Strasbourg pour venir en aide aux populations défavorisées en France et à l&apos;étranger.
                    </p>
                    <p className="mb-4">
                      Fondée sur des valeurs chrétiennes d&apos;amour et de solidarité, EVE s&apos;engage dans des projets
                      concrets pour améliorer les conditions de vie des plus démunis, sans distinction d&apos;origine, de
                      religion ou de culture.
                    </p>
                  </div>
                </div>

                {/* Nos missions */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center">Nos missions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GlobeIcon className="h-5 w-5 text-primary" />
                          Projets internationaux
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          EVE soutient des projets de développement dans plusieurs pays d&apos;Afrique et d&apos;Asie :
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>Construction et rénovation de puits et systèmes d&apos;accès à l&apos;eau potable</li>
                          <li>Soutien à des écoles et centres de formation</li>
                          <li>Aide médicale et sanitaire</li>
                          <li>Parrainage d&apos;enfants pour leur scolarisation</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HandIcon className="h-5 w-5 text-primary" />
                          Actions locales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">À Strasbourg et dans sa région, EVE mène plusieurs actions :</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>Distribution de repas aux sans-abri</li>
                          <li>Collecte et distribution de vêtements</li>
                          <li>Aide aux familles en difficulté</li>
                          <li>Soutien scolaire pour les enfants défavorisés</li>
                          <li>Visites aux personnes isolées</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Projets en cours */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center">Nos projets en cours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=400&width=600"
                          alt="Projet eau potable au Burkina Faso"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>Eau potable au Burkina Faso</CardTitle>
                        <CardDescription>Construction de puits dans 3 villages</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Ce projet vise à fournir un accès à l&apos;eau potable à plus de 2000 personnes dans trois villages
                          isolés du Burkina Faso.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Objectif de financement : 15 000 €</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=400&width=600"
                          alt="Centre d'alphabétisation au Togo"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>Alphabétisation au Togo</CardTitle>
                        <CardDescription>Soutien à un centre d&apos;apprentissage</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Financement d&apos;un centre d&apos;alphabétisation pour adultes et enfants non scolarisés dans un
                          quartier défavorisé de Lomé.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Objectif de financement : 8 000 €</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=400&width=600"
                          alt="Aide alimentaire à Strasbourg"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>Aide alimentaire locale</CardTitle>
                        <CardDescription>Distribution de repas à Strasbourg</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Organisation de distributions hebdomadaires de repas chauds et de colis alimentaires pour les
                          personnes sans domicile fixe à Strasbourg.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Besoin mensuel : 1 200 €</p>
                      </CardContent>
                    </Card>
                  </div>
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
                          Vos dons permettent de financer nos projets et actions humanitaires. Vous pouvez faire un don
                          ponctuel ou régulier :
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 dark:border dark:border-slate-700 p-4 rounded-md mb-4">
                          <p className="font-medium dark:font-semibold dark:text-white">Association Eau Vive Espoir</p>
                          <p className="dark:text-gray-100">IBAN : FR76 XXXX XXXX XXXX XXXX XXXX XXX</p>
                          <p className="dark:text-gray-100">BIC : XXXXXXXX</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          L&apos;association est reconnue d&apos;intérêt général. Vos dons sont déductibles des impôts à
                          hauteur de 66% dans la limite de 20% de votre revenu imposable.
                        </p>
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
                        <p className="mb-4">Vous pouvez vous engager comme bénévole dans nos différentes actions :</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>Participation aux distributions alimentaires</li>
                          <li>Collecte de fonds et organisation d&apos;événements</li>
                          <li>Aide administrative</li>
                          <li>Missions ponctuelles sur le terrain (selon compétences)</li>
                        </ul>
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