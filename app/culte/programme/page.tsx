import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User } from "lucide-react"

export const metadata = {
  title: "Programme des cultes - Église Protestante Libre de Strasbourg",
  description: "Découvrez le programme des cultes et prédications de l'Église Protestante Libre de Strasbourg",
};

export default function Programme() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Programme des cultes</h1>

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
                  <Link href="/culte" className="text-primary hover:text-primary/80">
                    Culte & Vie
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700">Programme</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="juin" className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Programme 2023</h2>
                <TabsList>
                  <TabsTrigger value="juin">Juin</TabsTrigger>
                  <TabsTrigger value="juillet">Juillet</TabsTrigger>
                  <TabsTrigger value="aout">Août</TabsTrigger>
                  <TabsTrigger value="septembre">Septembre</TabsTrigger>
                </TabsList>
              </div>

              {/* Juin */}
              <TabsContent value="juin">
                <div className="space-y-6">
                  {/* 4 Juin */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">Dimanche 4 juin 2023</CardTitle>
                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          Sainte Cène
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Horaire</h3>
                            <p className="text-gray-600">10h30 - 12h00</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Prédicateur</h3>
                            <p className="text-gray-600">Pasteur Thomas Leroux</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <h3 className="font-medium">Thème</h3>
                            <p className="text-gray-600">Une foi qui transforme</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">
                          Comment la foi en Jésus-Christ peut transformer radicalement notre vie quotidienne ? Le
                          pasteur Thomas Leroux nous invite à découvrir les signes d&apos;une foi vivante et
                          transformatrice à travers l&apos;exemple des premiers disciples.
                        </p>
                        <p className="text-gray-600 mt-2">
                          Texte biblique : Jacques 2:14-26
                          <br />
                          Garderie et école du dimanche pour les enfants
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 11 Juin */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Dimanche 11 juin 2023</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Horaire</h3>
                            <p className="text-gray-600">10h30 - 12h00</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Prédicateur</h3>
                            <p className="text-gray-600">Pasteur Samuel Dupont</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <h3 className="font-medium">Thème</h3>
                            <p className="text-gray-600">La fidélité de Dieu dans les temps difficiles</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">
                          Dans ce message inspirant, le pasteur Samuel Dupont nous rappelle comment la fidélité de Dieu
                          se manifeste particulièrement dans les moments d&apos;épreuve et de doute. Découvrez comment
                          ancrer votre foi sur le roc inébranlable des promesses divines.
                        </p>
                        <p className="text-gray-600 mt-2">
                          Texte biblique : Lamentations 3:19-26
                          <br />
                          Garderie et école du dimanche pour les enfants
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 18 Juin */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">Dimanche 18 juin 2023</CardTitle>
                        <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          Fête de l&apos;église
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Horaire</h3>
                            <p className="text-gray-600">10h30 - 12h00</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Prédicateur</h3>
                            <p className="text-gray-600">Pasteur Thomas Leroux</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <h3 className="font-medium">Thème</h3>
                            <p className="text-gray-600">La Parole vivante</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">
                          Un culte spécial pour la fête annuelle de l&apos;église, suivi d&apos;un repas partagé et
                          d&apos;un après-midi festif. Le pasteur Thomas Leroux nous parlera de la puissance de la
                          Parole de Dieu qui transforme nos vies.
                        </p>
                        <p className="text-gray-600 mt-2">
                          Texte biblique : Hébreux 4:12-13
                          <br />
                          Programme spécial pour les enfants toute la journée
                          <br />
                          Repas partagé : chacun apporte un plat à partager
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 25 Juin */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Dimanche 25 juin 2023</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Horaire</h3>
                            <p className="text-gray-600">10h30 - 12h00</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Prédicateur</h3>
                            <p className="text-gray-600">Ancien Pierre Martin</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <h3 className="font-medium">Thème</h3>
                            <p className="text-gray-600">Le pouvoir de la prière persévérante</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">
                          À travers les exemples bibliques d&apos;hommes et de femmes qui ont persévéré dans la prière,
                          l&apos;ancien Pierre Martin nous encourage à développer une vie de prière constante et
                          confiante, même face aux silences apparents de Dieu.
                        </p>
                        <p className="text-gray-600 mt-2">
                          Texte biblique : Luc 18:1-8
                          <br />
                          Garderie et école du dimanche pour les enfants
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Juillet */}
              <TabsContent value="juillet">
                <div className="space-y-6">
                  {/* 2 Juillet */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">Dimanche 2 juillet 2023</CardTitle>
                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          Sainte Cène
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Horaire</h3>
                            <p className="text-gray-600">10h30 - 12h00</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Prédicateur</h3>
                            <p className="text-gray-600">Pasteur Samuel Dupont</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <h3 className="font-medium">Thème</h3>
                            <p className="text-gray-600">La Parole vivante pour aujourd&apos;hui</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">
                          Comment lire et comprendre la Bible de manière à ce qu&apos;elle transforme notre vie
                          quotidienne ? Le pasteur Samuel Dupont partage des clés pratiques pour que la lecture biblique
                          devienne une rencontre vivante avec Dieu.
                        </p>
                        <p className="text-gray-600 mt-2">
                          Texte biblique : 2 Timothée 3:14-17
                          <br />
                          Garderie et école du dimanche pour les enfants
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Autres cultes de juillet - message simplifié */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Cultes des dimanches 9, 16, 23 et 30 juillet 2023</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Pendant la période estivale, nos cultes continuent chaque dimanche à 10h30, avec un format
                        légèrement adapté. Le programme détaillé sera communiqué ultérieurement.
                      </p>
                      <p className="text-gray-600">
                        Notez que la garderie et l&apos;école du dimanche fonctionnent avec un programme allégé pendant
                        l&apos;été.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Août */}
              <TabsContent value="aout">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Cultes du mois d&apos;août 2023</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Pendant le mois d&apos;août, nos cultes continuent chaque dimanche à 10h30, avec un format
                      estival. Le programme détaillé sera communiqué ultérieurement.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Notez que certains cultes pourront être organisés en commun avec d&apos;autres églises de la
                      région.
                    </p>
                    <p className="text-gray-600">
                      La garderie et l&apos;école du dimanche fonctionnent avec un programme allégé pendant l&apos;été.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Septembre */}
              <TabsContent value="septembre">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">Dimanche 3 septembre 2023</CardTitle>
                      <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-sm font-medium">
                        Culte de rentrée
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Culte spécial de rentrée avec présentation des activités de l&apos;année et bénédiction des
                      enfants, des jeunes et des équipes de service.
                    </p>
                    <p className="text-gray-600">
                      Le programme complet du mois de septembre sera disponible prochainement.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Informations complémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informations pratiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Lieu des cultes</h3>
                      <p className="text-gray-600">
                        18 rue de Franche-Comté
                        <br />
                        67380 Lingolsheim
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-1">Accessibilité</h3>
                      <p className="text-gray-600">
                        Notre bâtiment est accessible aux personnes à mobilité réduite. Des places de parking sont
                        disponibles à proximité.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-1">Enfants</h3>
                      <p className="text-gray-600">
                        Un accueil est prévu pour les enfants de 0 à 12 ans pendant le culte, avec des activités
                        adaptées à chaque tranche d&apos;âge.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendrier complet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Retrouvez toutes nos activités (cultes, études bibliques, groupes de maison, événements spéciaux...)
                    dans notre calendrier interactif.
                  </p>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <Button asChild>
                      <Link href="/culte/calendrier">Voir le calendrier</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 