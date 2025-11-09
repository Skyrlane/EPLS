import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Phone, Mail, MapPin, User, Building, Users } from "lucide-react"
import Sidebar from "../components/Sidebar"

export const metadata = {
  title: "Carnet d'adresses - Église Protestante Libre de Strasbourg",
  description: "Consultez les contacts et coordonnées des membres et services de l'Église Protestante Libre de Strasbourg"
}

export default function CarnetAdressePage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Carnet d&apos;adresses</h1>

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
                  <span className="text-gray-700 dark:text-gray-300">Carnet d&apos;adresses</span>
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
                    <CardTitle>Accès réservé aux membres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Le carnet d&apos;adresses complet est réservé aux membres de l&apos;Église Protestante Libre de
                      Strasbourg. Veuillez vous connecter pour accéder à l&apos;ensemble des coordonnées.
                    </p>
                    <div className="flex justify-center">
                      <Button asChild>
                        <Link href="/connexion">Se connecter</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recherche */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Rechercher un contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input type="search" placeholder="Nom, fonction, service..." className="pl-10" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Note: La recherche complète est disponible après connexion à l&apos;espace membre.
                    </p>
                  </CardContent>
                </Card>

                {/* Contacts publics */}
                <h2 className="text-2xl font-bold mb-6">Contacts publics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {/* Contact principal */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Église Protestante Libre de Strasbourg
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Adresse</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              18 rue de Franche-Comté
                              <br />
                              67380 Lingolsheim
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Téléphone</h3>
                            <p className="text-gray-600 dark:text-gray-300">03 88 XX XX XX</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300">contact@epls.fr</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pasteur */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Pasteur
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Nom</h3>
                            <p className="text-gray-600 dark:text-gray-300">Samuel Dupont</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Téléphone</h3>
                            <p className="text-gray-600 dark:text-gray-300">03 88 XX XX XX</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300">pasteur@epls.fr</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Services */}
                <h2 className="text-2xl font-bold mb-6">Services de l&apos;église</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {/* Conseil d'église */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Conseil d&apos;église
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Pour contacter le conseil d&apos;église (anciens et pasteur) pour des questions spirituelles ou
                        administratives.
                      </p>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">conseil@epls.fr</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Jeunesse */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Service Jeunesse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Pour toute question concernant les activités pour enfants et adolescents.
                      </p>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">jeunesse@epls.fr</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Diaconie */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Service Diaconie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Pour les besoins d&apos;aide sociale, matérielle ou d&apos;accompagnement.
                      </p>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">diaconie@epls.fr</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Associations liées */}
                <h2 className="text-2xl font-bold mb-6">Associations liées</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* EVE */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Association Eau Vive Espoir (EVE)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Association humanitaire liée à l&apos;église, active en France et à l&apos;international.
                      </p>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">contact@eve-asso.fr</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/infos-docs/eve">En savoir plus</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* UEEL */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Union des Églises Évangéliques Libres
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        L&apos;union nationale à laquelle notre église est affiliée.
                      </p>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">contact@ueel.org</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/infos-docs/union-eglise">En savoir plus</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 