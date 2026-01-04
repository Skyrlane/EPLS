import Link from "next/link";
import Image from "next/image";
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block";
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
import { CalendarMiniWithEvents } from "@/components/calendar/calendar-mini-with-events";

export const metadata = {
  title: "Culte & Vie communautaire - Église Protestante Libre de Strasbourg",
  description: "Découvrez la vie communautaire et les cultes de l'Église Protestante Libre de Strasbourg. Un temps pour adorer Dieu et grandir ensemble dans la foi.",
};

// Prochain culte - Calculé automatiquement pour le dimanche suivant
function getNextSunday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  return nextSunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const prochainCulte = {
  date: getNextSunday(),
  theme: "Culte dominical",
  predicateur: "Pasteur de l'EPLS",
  special: "",
  description: "Rejoignez-nous pour un temps de louange, de prière et d'enseignement biblique."
};

// Les événements sont maintenant récupérés dynamiquement depuis Firestore
// via le composant CalendarMiniWithEvents

export default function Culte() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
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
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Culte & Vie</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Sommaire et Prochain Culte */}
      <div className="bg-card py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sommaire */}
              <div className="lg:col-span-1">
                <div className="bg-muted/50 p-6 rounded-lg shadow-sm">
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
                      <p className="font-bold text-lg">{prochainCulte.date} à 10h00</p>
                      <p className="font-medium">"{prochainCulte.theme}" - {prochainCulte.predicateur}</p>
                      {prochainCulte.special && (
                        <p className="text-primary font-medium mt-1">{prochainCulte.special}</p>
                      )}
                      <p className="mt-2 text-muted-foreground">{prochainCulte.description}</p>
                      
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
              <DynamicImageBlock
                zone="cultes-hero"
                fallbackSrc="/placeholder.svg?height=384&width=896"
                alt="Culte à l'EPLS"
                type="hero"
                className="object-cover"
              />
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
                Chaque dimanche à 10h00, nous nous réunissons pour un temps de culte communautaire. Ce moment central
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
                Pendant le culte, nous proposons une garderie pour les petits ainsi qu&apos;une école du dimanche pour les ados.
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
                  <p className="font-medium">Dimanche à 10h00</p>
                  <p className="text-muted-foreground text-sm mt-1">Durée : environ 1h30</p>
                  <p className="text-muted-foreground text-sm mt-1">Suivi d&apos;un temps convivial</p>
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
                  <p className="text-muted-foreground text-sm mt-1">67380 Lingolsheim</p>
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
            <div className="mb-12 bg-muted/50 rounded-xl p-6">
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
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Dimanche {prochainCulte.date}</h3>
                            <p className="text-muted-foreground">{prochainCulte.theme} - {prochainCulte.predicateur}</p>
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
                    <CalendarMiniWithEvents />
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
              <p className="text-lg text-muted-foreground mb-8">
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
                    <p className="text-muted-foreground mb-4">
                      Les groupes de maison se réunissent en semaine dans différents quartiers de Strasbourg et des
                      environs. Ces petits groupes de 8 à 12 personnes permettent de partager, prier et étudier la Bible
                      dans un cadre plus intime.
                    </p>
                    <p className="text-muted-foreground">
                      Fréquence : mardi soir à 20h00
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
                    <p className="text-muted-foreground mb-4">
                      Des études bibliques thématiques ou suivant un livre de la Bible sont proposées régulièrement.
                      Elles permettent d&apos;approfondir la connaissance des Écritures et d&apos;échanger sur leur
                      application dans notre vie quotidienne.
                    </p>
                    <p className="text-muted-foreground">
                      Fréquence : 1er et 3ème mardi du mois
                      <br />
                      Horaire : 20h15
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
                    <p className="text-muted-foreground mb-4">
                      Le groupe de louange se réunit pour répéter les chants qui seront interprétés lors du culte
                      dominical. Si vous jouez d&apos;un instrument ou aimez chanter, vous êtes les bienvenus pour
                      rejoindre cette équipe.
                    </p>
                    <p className="text-muted-foreground">
                      Répétitions : le vendredi soir à 19h30
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
                    <p className="text-muted-foreground mb-4">
                      Notre église s&apos;engage dans diverses actions solidaires : distribution de repas aux personnes
                      sans-abri, collecte de vêtements, soutien scolaire, visites aux personnes âgées ou isolées...
                    </p>
                    <p className="text-muted-foreground">
                      Pour participer ou en savoir plus, utilisez notre{" "}
                      <a href="/contact" className="text-primary hover:underline">formulaire de contact</a>.
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