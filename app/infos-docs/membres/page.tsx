import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from "../components/Sidebar"
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block"

export const metadata = {
  title: "Liste des membres - Église Protestante Libre de Strasbourg",
  description: "Découvrez le conseil d'église, les responsables de ministères et les informations pour devenir membre de l'Église Protestante Libre de Strasbourg"
}

export default function Membres() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Liste des membres</h1>

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
                    Infos/Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">Liste des membres</span>
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
                    <CardTitle>Accès réservé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Cette page est réservée aux membres de l&apos;Église Protestante Libre de Strasbourg. Veuillez vous
                      connecter pour accéder à la liste des membres et à l&apos;annuaire.
                    </p>
                    <div className="flex justify-center">
                      <Button asChild className="shadow-md">
                        <Link href="/connexion">Se connecter</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="prose prose-lg max-w-none mb-8">
                  <h2>Le conseil d&apos;église</h2>
                  <p>
                    L&apos;Église Protestante Libre de Strasbourg est dirigée par un conseil composé du pasteur et
                    d&apos;anciens élus par l&apos;assemblée des membres. Le conseil est responsable de la direction
                    spirituelle de l&apos;église, de l&apos;enseignement, de la pastorale et de l&apos;administration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {/* Pasteur */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                          <DynamicImageBlock
                            zone="membres-pasteur-1"
                            fallbackSrc="/placeholder.svg?height=128&width=128"
                            alt="Pasteur Samuel Dupont"
                            type="avatar"
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-medium mb-1">Samuel Dupont</h3>
                        <p className="text-gray-500 mb-3">Pasteur</p>
                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                          Pasteur de l&apos;église depuis 2015
                          <br />
                          Formation : Institut Biblique de Nogent
                          <br />
                          Contact : pasteur@epls.fr
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ancien 1 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                          <DynamicImageBlock
                            zone="membres-pasteur-2"
                            fallbackSrc="/placeholder.svg?height=128&width=128"
                            alt="Pierre Martin"
                            type="avatar"
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-medium mb-1">Pierre Martin</h3>
                        <p className="text-gray-500 mb-3">Ancien</p>
                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                          Ancien depuis 2010
                          <br />
                          Responsable du ministère de la louange
                          <br />
                          Contact : pierre.martin@epls.fr
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ancien 2 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                          <DynamicImageBlock
                            zone="membres-pasteur-3"
                            fallbackSrc="/placeholder.svg?height=128&width=128"
                            alt="Jean Dubois"
                            type="avatar"
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-medium mb-1">Jean Dubois</h3>
                        <p className="text-gray-500 mb-3">Ancien</p>
                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                          Ancien depuis 2018
                          <br />
                          Responsable du ministère de la diaconie
                          <br />
                          Contact : jean.dubois@epls.fr
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <h2>Les responsables de ministères</h2>
                  <p>
                    Plusieurs membres de l&apos;église sont responsables de ministères spécifiques. Ils travaillent en
                    collaboration avec le conseil d&apos;église pour coordonner les différentes activités.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {/* Responsable 1 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                          <DynamicImageBlock
                            zone="membres-conseil-1"
                            fallbackSrc="/placeholder.svg?height=96&width=96"
                            alt="Marie Laurent"
                            type="avatar"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Marie Laurent</h3>
                        <p className="text-gray-500 mb-2">Enfants & Jeunesse</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Responsable 2 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                          <DynamicImageBlock
                            zone="membres-conseil-2"
                            fallbackSrc="/placeholder.svg?height=96&width=96"
                            alt="Thomas Leroux"
                            type="avatar"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Thomas Leroux</h3>
                        <p className="text-gray-500 mb-2">Enseignement</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Responsable 3 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                          <DynamicImageBlock
                            zone="membres-conseil-3"
                            fallbackSrc="/placeholder.svg?height=96&width=96"
                            alt="Sophie Moreau"
                            type="avatar"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Sophie Moreau</h3>
                        <p className="text-gray-500 mb-2">Accueil & Intégration</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Responsable 4 */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                          <DynamicImageBlock
                            zone="membres-conseil-4"
                            fallbackSrc="/placeholder.svg?height=96&width=96"
                            alt="Marc Petit"
                            type="avatar"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Marc Petit</h3>
                        <p className="text-gray-500 mb-2">Communication</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <h2>Devenir membre</h2>
                  <p>
                    L&apos;Église Protestante Libre de Strasbourg accueille toute personne désireuse de découvrir la foi
                    chrétienne ou d&apos;approfondir sa relation avec Dieu. Pour devenir membre, il est nécessaire de :
                  </p>
                  <ul>
                    <li>Confesser sa foi en Jésus-Christ comme Seigneur et Sauveur</li>
                    <li>Avoir reçu le baptême chrétien (par immersion ou aspersion)</li>
                    <li>Adhérer à la confession de foi de l&apos;église</li>
                    <li>Participer régulièrement à la vie de l&apos;église</li>
                    <li>S&apos;engager à soutenir l&apos;église par la prière, le service et les dons</li>
                  </ul>
                  <p>
                    Si vous souhaitez en savoir plus sur la démarche pour devenir membre, n&apos;hésitez pas à contacter le
                    pasteur ou un ancien.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Vous souhaitez en savoir plus ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Si vous avez des questions sur l&apos;église, sa structure, son fonctionnement ou comment vous impliquer,
                      n&apos;hésitez pas à nous contacter.
                    </p>
                    <div className="flex justify-center">
                      <Button asChild>
                        <Link href="/contact">Nous contacter</Link>
                      </Button>
                    </div>
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