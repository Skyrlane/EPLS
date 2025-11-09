import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Music, 
  Users, 
  BookOpen, 
  Heart,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata = {
  title: "Culte & Vie communautaire - Église Protestante Libre de Strasbourg",
  description: "Découvrez la vie communautaire et les cultes de l'Église Protestante Libre de Strasbourg. Un temps pour adorer Dieu et grandir ensemble dans la foi.",
};

// Exemple de date pour le prochain culte - Dans une application réelle, 
// cette information serait récupérée dynamiquement depuis une API ou une base de données
const prochainCulte = {
  date: "18 juin 2023",
  theme: "La Parole vivante",
  predicateur: "Pasteur Thomas Leroux",
  special: "Fête de l'église",
  description: "Un culte spécial pour la fête annuelle de l'église, suivi d'un repas partagé et d'un après-midi festif."
};

// Type pour les événements
type Evenement = {
  titre: string;
  heure: string;
  id?: number; // Ajout de l'ID pour faire le lien avec les événements du calendrier
};

// Événements de juin 2023 avec leurs IDs correspondants
const juinEvents: Record<number, Evenement[]> = {
  4: [{ titre: "Culte dominical avec Sainte Cène", heure: "10h30", id: 1 }],
  7: [{ titre: "Étude biblique", heure: "19h00", id: 2 }],
  10: [{ titre: "Catéchisme", heure: "14h00", id: 3 }],
  11: [{ titre: "Culte dominical avec baptême", heure: "10h30", id: 4 }],
  13: [{ titre: "Conseil presbytéral", heure: "19h30", id: 5 }],
  14: [{ titre: "Groupe de prière", heure: "18h30", id: 6 }],
  18: [{ titre: "Culte dominical - Fête de l'église", heure: "10h30", id: 7 }],
  21: [{ titre: "Formation des anciens", heure: "19h00", id: 8 }],
  25: [
    { titre: "Culte dominical festif de fin d'année scolaire", heure: "10h30", id: 9 },
    { titre: "Repas communautaire", heure: "12h30", id: 10 }
  ],
};

// Mapping des jours vers les IDs d'événements pour faciliter la navigation
const getEventIdForDay = (day: number): number | undefined => {
  const events = juinEvents[day];
  return events?.[0]?.id;
};

// Fonction pour vérifier si une date correspond à aujourd'hui
// Pour l'exemple, nous allons considérer un jour spécifique comme "aujourd'hui"
// En production, cette fonction utiliserait new Date() pour la date réelle
const isToday = (day: number): boolean => {
  // Simulons que nous sommes le 19 juin 2023 pour l'exemple
  return day === 19;
};

// Fonction pour vérifier si c'est le prochain culte à mettre en évidence
// Séparé de la logique "aujourd'hui" pour plus de clarté
const isNextService = (day: number): boolean => {
  // Plus besoin de mettre en évidence le jour 18 comme "prochain culte"
  // car cette mise en forme est réservée au jour actuel
  return false;
};

export default function Culte() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Culte & Vie communautaire</h1>

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
                  <span className="text-gray-700">Culte & Vie</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Sommaire et Prochain Culte */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sommaire */}
              <div className="lg:col-span-1">
                <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Sommaire</h2>
                  <ul className="space-y-3">
                    <li>
                      <Link href="#culte-dominical" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Le culte dominical
                      </Link>
                    </li>
                    <li>
                      <Link href="#deroulement" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Déroulement du culte
                      </Link>
                    </li>
                    <li>
                      <Link href="#enfants-jeunes" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Pour les enfants et jeunes
                      </Link>
                    </li>
                    <li>
                      <Link href="#infos-pratiques" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Infos pratiques
                      </Link>
                    </li>
                    <li>
                      <Link href="#vie-communautaire" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Vie communautaire
                      </Link>
                    </li>
                    <li>
                      <Link href="/culte/programme" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Programme complet
                      </Link>
                    </li>
                    <li>
                      <Link href="/culte/calendrier" className="flex items-center text-primary hover:underline">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Calendrier des événements
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Prochain Culte */}
              <div className="lg:col-span-2">
                <Alert className="bg-primary/10 border-primary">
                  <Calendar className="h-5 w-5 text-primary" />
                  <AlertTitle>Prochain culte</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <p className="font-bold text-lg">{prochainCulte.date} à 10h30</p>
                      <p className="font-medium">"{prochainCulte.theme}" - {prochainCulte.predicateur}</p>
                      {prochainCulte.special && (
                        <p className="text-primary font-medium mt-1">{prochainCulte.special}</p>
                      )}
                      <p className="mt-2 text-gray-700">{prochainCulte.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild size="sm">
                          <Link href="/culte/programme">
                            Voir tout le programme
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/culte/calendrier">
                            Consulter le calendrier
                            <Calendar className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=384&width=896" alt="Culte à l'EPLS" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">Nos cultes</h2>
                  <p className="text-xl">Un temps pour adorer Dieu et grandir ensemble dans la foi</p>
                </div>
              </div>
            </div>

            {/* Culte Description */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2 id="culte-dominical">Le culte dominical</h2>
              <p>
                Chaque dimanche à 10h30, nous nous réunissons pour un temps de culte communautaire. Ce moment central
                dans la vie de notre église est l&apos;occasion de :
              </p>
              <ul>
                <li>Louer Dieu par des chants et des prières</li>
                <li>Écouter et méditer sa Parole</li>
                <li>Partager la communion fraternelle</li>
                <li>Témoigner de notre foi</li>
              </ul>

              <p>
                Nos cultes durent environ 1h30 et sont suivis d&apos;un temps convivial autour d&apos;un café, qui
                permet de faire connaissance et d&apos;échanger.
              </p>

              <h3 id="deroulement">Déroulement du culte</h3>
              <p>
                Notre culte se déroule dans une atmosphère à la fois recueillie et chaleureuse. Il comprend généralement
                :
              </p>
              <ul>
                <li>Un temps de louange avec des chants contemporains et des cantiques traditionnels</li>
                <li>Des lectures bibliques</li>
                <li>Un temps de prière communautaire</li>
                <li>La prédication, centrée sur l&apos;explication et l&apos;application de la Bible</li>
                <li>Des annonces concernant la vie de l&apos;église</li>
                <li>
                  La Sainte Cène (communion), célébrée le premier dimanche du mois et lors d&apos;occasions spéciales
                </li>
              </ul>

              <h3 id="enfants-jeunes">Pour les enfants et les jeunes</h3>
              <p>
                Pendant le culte, un programme adapté est proposé aux enfants de 3 à 12 ans. Après un temps de louange
                en commun avec les adultes, ils sont pris en charge par une équipe d&apos;animateurs qualifiés pour un
                temps d&apos;enseignement biblique ludique et interactif.
              </p>
              <p>
                Les adolescents (13-18 ans) participent au culte avec les adultes et se retrouvent une fois par mois
                pour un temps spécifique le vendredi soir.
              </p>
            </div>

            {/* Quick Info Cards */}
            <div id="infos-pratiques" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" /> Horaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Dimanche à 10h30</p>
                  <p className="text-gray-600 text-sm mt-1">Durée : environ 1h30</p>
                  <p className="text-gray-600 text-sm mt-1">Suivi d&apos;un temps convivial</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" /> Lieu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">18 rue de Franche-Comté</p>
                  <p className="text-gray-600 text-sm mt-1">67380 Lingolsheim</p>
                  <Link href="/notre-eglise/ou-sommes-nous" className="text-primary text-sm hover:underline block mt-2">
                    Comment nous trouver →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" /> Prochain culte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{prochainCulte.date}</p>
                  <p className="text-primary text-sm font-medium mt-1">{prochainCulte.special}</p>
                  <Link href="/culte/programme" className="text-primary text-sm hover:underline block mt-2">
                    Voir le programme →
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Programmes et Calendrier */}
            <div className="mb-12 bg-slate-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Planifiez votre visite</h2>
              
              <Tabs defaultValue="programme" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="programme">Programme des cultes</TabsTrigger>
                  <TabsTrigger value="calendrier">Calendrier complet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="programme">
                  <div className="space-y-4">
                    <p>Consultez le programme détaillé des prochains cultes, avec les thématiques et prédicateurs.</p>
                    <Card className="mb-4">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3 mb-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Dimanche {prochainCulte.date}</h3>
                            <p className="text-gray-600">{prochainCulte.theme} - {prochainCulte.predicateur}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Dimanche 25 juin 2023</h3>
                            <p className="text-gray-600">Culte dominical festif de fin d'année scolaire</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Button asChild>
                      <Link href="/culte/programme">Voir le programme complet</Link>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="calendrier">
                  <div className="space-y-4">
                    <p>Accédez au calendrier interactif de tous les événements de notre église.</p>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                        <div key={day} className="text-center font-medium py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={`empty-${i}`} className="h-9 p-1"></div>
                      ))}
                      {Array.from({ length: 30 }, (_, i) => {
                        const day = i + 1;
                        const hasEvents = Object.keys(juinEvents).map(Number).includes(day);
                        const isNextCulte = isNextService(day);
                        const eventId = getEventIdForDay(day);
                        const isCurrentDay = isToday(day);
                        
                        const dayElement = (
                          <div
                            className={`h-9 p-1 border rounded-md flex items-center justify-center relative ${
                              isCurrentDay
                                ? "border-primary/70 ring-1 ring-primary bg-primary/5"
                                : hasEvents
                                ? "border-blue-300 text-blue-600 font-medium"
                                : "border-gray-200"
                            }`}
                          >
                            <span className={isCurrentDay ? "font-bold" : ""}>
                              {day}
                            </span>
                            {hasEvents && (
                              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            )}
                            {isCurrentDay && (
                              <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                            )}
                          </div>
                        );
                        
                        // Si le jour a des événements, on ajoute un tooltip
                        if (hasEvents && eventId) {
                          return (
                            <div key={`day-${day}`}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href={`/culte/calendrier?eventId=${eventId}`}>
                                      {dayElement}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" align="start" className="max-w-[250px]">
                                    <div className="space-y-1">
                                      {juinEvents[day].map((event, eventIndex) => (
                                        <div 
                                          key={eventIndex} 
                                          className={eventIndex > 0 ? "pt-1 border-t border-border/30 mt-1" : ""}
                                        >
                                          <div className="font-semibold text-sm">{event.titre}</div>
                                          <div className="text-xs">{event.heure}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          );
                        } else if (hasEvents) {
                          // Cas fallback si l'ID n'est pas trouvé (peu probable avec notre implémentation)
                          return (
                            <div key={`day-${day}`}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href="/culte/calendrier">
                                      {dayElement}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" align="start" className="max-w-[250px]">
                                    <div className="space-y-1">
                                      {juinEvents[day].map((event, eventIndex) => (
                                        <div 
                                          key={eventIndex} 
                                          className={eventIndex > 0 ? "pt-1 border-t border-border/30 mt-1" : ""}
                                        >
                                          <div className="font-semibold text-sm">{event.titre}</div>
                                          <div className="text-xs">{event.heure}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          );
                        } else if (isCurrentDay) {
                          // Jour actuel sans événement
                          return (
                            <div key={`day-${day}`}>
                              <Link href="/culte/calendrier">
                                {dayElement}
                              </Link>
                            </div>
                          );
                        }
                        
                        return <div key={`day-${day}`}>{dayElement}</div>;
                      })}
                    </div>
                    <Button asChild>
                      <Link href="/culte/calendrier">Voir le calendrier complet</Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Vie communautaire */}
            <div id="vie-communautaire" className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Vie communautaire</h2>
              <p className="text-lg text-gray-700 mb-8">
                Au-delà du culte dominical, notre église propose diverses activités qui permettent de vivre la foi au
                quotidien et de développer des relations fraternelles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" /> Groupes de maison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Les groupes de maison se réunissent en semaine dans différents quartiers de Strasbourg et des
                      environs. Ces petits groupes de 8 à 12 personnes permettent de partager, prier et étudier la Bible
                      dans un cadre plus intime.
                    </p>
                    <p className="text-gray-600">
                      Fréquence : hebdomadaire ou bimensuelle selon les groupes
                      <br />
                      Durée : environ 2h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" /> Études bibliques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Des études bibliques thématiques ou suivant un livre de la Bible sont proposées régulièrement.
                      Elles permettent d&apos;approfondir la connaissance des Écritures et d&apos;échanger sur leur
                      application dans notre vie quotidienne.
                    </p>
                    <p className="text-gray-600">
                      Fréquence : tous les mardis
                      <br />
                      Horaire : 20h-21h30
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <Music className="h-5 w-5 mr-2 text-primary" /> Groupe de louange
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Le groupe de louange se réunit pour répéter les chants qui seront interprétés lors du culte
                      dominical. Si vous jouez d&apos;un instrument ou aimez chanter, vous êtes les bienvenus pour
                      rejoindre cette équipe.
                    </p>
                    <p className="text-gray-600">
                      Répétitions : le vendredi soir à 19h30
                      <br />
                      Contact : louange@epls.fr
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-primary" /> Actions solidaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Notre église s&apos;engage dans diverses actions solidaires : distribution de repas aux personnes
                      sans-abri, collecte de vêtements, soutien scolaire, visites aux personnes âgées ou isolées...
                    </p>
                    <p className="text-gray-600">
                      Pour participer ou en savoir plus, contactez l&apos;équipe diaconie :
                      <br />
                      diaconie@epls.fr
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
} 