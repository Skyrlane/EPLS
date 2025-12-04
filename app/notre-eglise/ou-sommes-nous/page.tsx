import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Bus, Phone, Mail } from "lucide-react"
import { Metadata } from "next"
import { Button } from '@/components/ui/button'
import EgliseSidebar from "../../components/eglise/EgliseSidebar"

export const metadata: Metadata = {
  title: "Où sommes-nous | Église Protestante Libre de Strasbourg",
  description: "Adresse, plan d'accès et informations pratiques pour nous rejoindre lors d'un culte ou d'une autre activité",
}

export default function OuSommesNous() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Où sommes-nous ?</h1>

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
                  <Link href="/notre-eglise" className="text-primary hover:text-primary/80">
                    Notre Église
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700">Où sommes-nous</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h2 className="text-3xl font-semibold mb-6">Notre adresse</h2>
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <p className="font-medium mb-1">Église Protestante Libre de Strasbourg</p>
                    <p className="mb-4">18 rue de Franche-Comté, 67380 Lingolsheim</p>

                    <h3 className="font-medium mb-2">Horaires d&apos;ouverture du secrétariat :</h3>
                    <ul className="space-y-1 mb-4">
                      <li>Mardi : 9h00 - 12h00</li>
                      <li>Jeudi : 14h00 - 17h00</li>
                    </ul>

                    <h3 className="font-medium mb-2">Contact :</h3>
                    <p className="mb-1">Tél : 03 88 84 45 26</p>
                    <p>Email : contact@protestants-libres.fr</p>

                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <Link href="/contact">Nous contacter</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-semibold mb-6">Carte</h2>
                  <div className="bg-slate-100 p-2 rounded-lg h-[300px] overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2639.8!2d7.7088!3d48.5598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4796c84c4c4c4c4c%3A0x1234567890abcdef!2s18%20Rue%20de%20Franche-Comt%C3%A9%2C%2067380%20Lingolsheim!5e0!3m2!1sfr!2sfr!4v1659612345678!5m2!1sfr!2sfr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localisation de l'église"
                    ></iframe>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-semibold mb-6">Comment venir ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle>En transports en commun</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <span className="font-medium">Tram :</span> Ligne A, arrêt "Lixenbuhl" (10 min à pied)
                      </li>
                      <li>
                        <span className="font-medium">Bus :</span> Lignes 41, 57 et 58, arrêt "Lingolsheim Mairie" (5 min à pied)
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>En voiture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <span className="font-medium">Depuis l&apos;A35 :</span> Sortie "Lingolsheim", puis suivre
                        direction centre-ville
                      </li>
                      <li>
                        <span className="font-medium">Parking :</span> Places gratuites disponibles dans les rues
                        adjacentes et parking de l&apos;église Saint-Marc
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>À vélo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <span className="font-medium">Piste cyclable :</span> Accès facile depuis Strasbourg par la piste cyclable
                        rue de la Semm et route de Lyon
                      </li>
                      <li>
                        <span className="font-medium">Stationnement :</span> Arceaux à vélos disponibles à proximité de l&apos;église
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-semibold mb-6">Informations pratiques</h2>
              <div className="bg-slate-50 p-6 rounded-lg mb-12">
                <h3 className="text-xl font-medium mb-4">Accessibilité</h3>
                <p className="mb-6">
                  Notre bâtiment est accessible aux personnes à mobilité réduite. Une rampe d&apos;accès est disponible à
                  l&apos;entrée principale et nos installations sont adaptées pour accueillir tous les visiteurs.
                </p>

                <h3 className="text-xl font-medium mb-4">Équipements</h3>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>Salle principale pouvant accueillir jusqu&apos;à 150 personnes</li>
                  <li>Plusieurs salles de réunion pour les activités en petits groupes</li>
                  <li>Espace café pour les moments de convivialité</li>
                  <li>Équipement audiovisuel moderne</li>
                  <li>Coin enfants aménagé</li>
                </ul>

                <h3 className="text-xl font-medium mb-4">Quartier</h3>
                <p>
                  Nous nous réunissons à l&apos;église Saint-Marc de Lingolsheim, une commune limitrophe de Strasbourg,
                  facilement accessible depuis le centre-ville et les quartiers ouest de l&apos;agglomération.
                </p>
              </div>

              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Nous rendre visite</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Vous êtes les bienvenus pour nous rejoindre lors d&apos;un culte ou d&apos;une autre activité. Voici
                      quelques informations pratiques pour votre première visite :
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Accueil</h3>
                        <p className="text-gray-600">
                          Une équipe d&apos;accueil sera présente pour vous orienter et répondre à vos questions.
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Enfants</h3>
                        <p className="text-gray-600">
                          Un programme adapté est proposé aux enfants de 3 à 12 ans pendant le culte.
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Après le culte</h3>
                        <p className="text-gray-600">
                          Un temps convivial autour d&apos;un café vous permettra de faire connaissance avec la
                          communauté.
                        </p>
                      </div>
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