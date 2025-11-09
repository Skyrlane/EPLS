import Link from "next/link";
import { Metadata } from "next";
import { CalendarDays, Clock, Video } from "lucide-react";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageFilter } from "@/components/messages/message-filter";
import { ImageBlock } from "@/components/ui/image-block";

export const metadata: Metadata = {
  title: "Messages - Église Protestante Libre de Saint-Maur",
  description: "Retrouvez tous les messages prêchés à l'église",
};

// Types
type Theme = "Foi" | "Grâce" | "Évangile" | "Espérance" | "Adoration" | "Famille" | "Vie Chrétienne" | "Série d'été";
type Predicateur = "Pasteur A. Martin" | "Pasteur B. Dubois" | "Pasteur C. Lambert" | "Ancien D. Petit" | "Invité E. Richard" | "Pasteur Robert";

interface Message {
  id: string;
  titre: string;
  description: string;
  date: string;
  predicateur: Predicateur;
  theme: Theme;
  duree: string;
  vues: number;
  lien: string;
  image: string;
  unsplashId: string;
}

// Couleurs des thèmes
function getThemeColor(theme: Theme): string {
  const isLightMode = typeof document !== 'undefined' && !document.documentElement.classList.contains('dark');
  
  const lightColors: Record<Theme, string> = {
    "Foi": "bg-blue-100 text-blue-800",
    "Grâce": "bg-purple-100 text-purple-800",
    "Évangile": "bg-red-100 text-red-800",
    "Espérance": "bg-green-100 text-green-900 font-semibold",
    "Adoration": "bg-yellow-100 text-yellow-800",
    "Famille": "bg-pink-100 text-pink-800",
    "Vie Chrétienne": "bg-indigo-100 text-indigo-800",
    "Série d'été": "bg-teal-100 text-teal-800"
  };
  
  const darkColors: Record<Theme, string> = {
    "Foi": "bg-blue-900 text-blue-100",
    "Grâce": "bg-purple-900 text-purple-100",
    "Évangile": "bg-red-900 text-red-100",
    "Espérance": "bg-green-950 text-green-100 font-semibold border border-green-500",
    "Adoration": "bg-yellow-900 text-yellow-100",
    "Famille": "bg-pink-900 text-pink-100",
    "Vie Chrétienne": "bg-indigo-900 text-indigo-100",
    "Série d'été": "bg-teal-900 text-teal-100"
  };
  
  return `dark:${darkColors[theme]} ${lightColors[theme]}`;
}

// Data simulée
const messages: Message[] = [
  {
    id: "latest-message",
    titre: "Le message de la semaine dernière",
    description: "Un message inspirant sur l'amour du prochain et la grâce divine.",
    date: "2024-07-14",
    predicateur: "Pasteur Robert",
    theme: "Série d'été",
    duree: "45:20",
    vues: 186,
    lien: "/messages/latest-message",
    image: "/images/messages/grace.jpg",
    unsplashId: ""
  },
  {
    id: "msg-001",
    titre: "La foi qui déplace les montagnes",
    description: "Une exploration de Matthieu 17:20 et comment la foi peut transformer notre vie quotidienne face aux défis.",
    date: "2023-11-26",
    predicateur: "Pasteur A. Martin",
    theme: "Foi",
    duree: "38:24",
    vues: 142,
    lien: "#",
    image: "/images/messages/foi.jpg",
    unsplashId: "uSzwsZH7-O0"
  },
  {
    id: "msg-002",
    titre: "Vivre par la grâce",
    description: "Comment comprendre et appliquer le concept biblique de la grâce dans notre vie de tous les jours.",
    date: "2023-11-19",
    predicateur: "Pasteur B. Dubois",
    theme: "Grâce",
    duree: "42:18",
    vues: 156,
    lien: "#",
    image: "/images/messages/grace.jpg",
    unsplashId: "32J_OhfG1yE"
  },
  {
    id: "msg-003",
    titre: "L'Évangile pour tous",
    description: "Un message sur l'importance de l'évangélisation et comment partager efficacement notre foi.",
    date: "2023-11-12",
    predicateur: "Ancien D. Petit",
    theme: "Évangile",
    duree: "35:42",
    vues: 128,
    lien: "#",
    image: "/images/messages/evangile.jpg",
    unsplashId: "RVX2HqNHLik"
  },
  {
    id: "msg-004",
    titre: "L'espérance chrétienne",
    description: "Comment l'espérance chrétienne transforme notre vision de l'avenir et influence nos actions présentes.",
    date: "2023-11-05",
    predicateur: "Pasteur C. Lambert",
    theme: "Espérance",
    duree: "40:56",
    vues: 134,
    lien: "#",
    image: "/images/messages/esperance.jpg",
    unsplashId: "xCKS6dAZ0lk"
  },
];

// Filtres disponibles
const themes: Theme[] = ["Foi", "Grâce", "Évangile", "Espérance", "Adoration", "Famille", "Vie Chrétienne", "Série d'été"];
const predicateurs: Predicateur[] = ["Pasteur A. Martin", "Pasteur B. Dubois", "Pasteur C. Lambert", "Ancien D. Petit", "Invité E. Richard", "Pasteur Robert"];
const années = ["2024", "2023", "2022", "2021", "2020", "2019"];

// Breadcrumbs data
const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Messages",
    href: "/messages",
    isCurrent: true
  }
];

// Fonction pour filtrer les messages
function filterMessages(
  messagesData: Message[],
  theme?: string,
  predicateur?: string,
  année?: string,
  tri: string = "recent"
): Message[] {
  // Cloner les messages pour ne pas modifier l'original
  let filtered = [...messagesData];
  
  // Filtrer par thème
  if (theme && theme !== "all") {
    filtered = filtered.filter(msg => msg.theme === theme);
  }
  
  // Filtrer par prédicateur
  if (predicateur && predicateur !== "all") {
    filtered = filtered.filter(msg => msg.predicateur === predicateur);
  }
  
  // Filtrer par année
  if (année && année !== "all") {
    filtered = filtered.filter(msg => new Date(msg.date).getFullYear().toString() === année);
  }
  
  // Trier les messages
  switch (tri) {
    case "recent":
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case "oldest":
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case "views":
      filtered.sort((a, b) => b.vues - a.vues);
      break;
    case "title":
      filtered.sort((a, b) => a.titre.localeCompare(b.titre));
      break;
  }
  
  return filtered;
}

export default function MessagesPage({ searchParams }: { searchParams: { theme?: string; predicateur?: string; année?: string; tri?: string; } }) {
  // Récupérer les paramètres de recherche
  const { theme, predicateur, année, tri = "recent" } = searchParams;
  
  // Filtrer les messages en fonction des paramètres
  const filteredMessages = filterMessages(messages, theme, predicateur, année, tri);
  
  // Fonction pour obtenir les crédits photos en fonction du thème
  const getImageCredit = (theme: Theme): string => {
    const credits: Record<Theme, string> = {
      "Foi": "Ben White sur Unsplash",
      "Grâce": "Aaron Burden sur Unsplash",
      "Évangile": "Aaron Burden sur Unsplash",
      "Espérance": "Greg Rakozy sur Unsplash",
      "Adoration": "Ben White sur Unsplash",
      "Famille": "Nathan Dumlao sur Unsplash",
      "Vie Chrétienne": "Priscilla Du Preez sur Unsplash",
      "Série d'été": "EPLS"
    };
    return credits[theme] || "";
  };

  return (
    <>
      <PageHeader
        title="Messages"
        breadcrumbs={breadcrumbs}
      >
        <p className="text-lg text-gray-600 dark:text-gray-300">Retrouvez tous les messages prêchés à l'église</p>
      </PageHeader>

      {/* Filtres */}
      <div className="bg-white border-b dark:bg-slate-900 dark:border-slate-800">
        <SectionContainer className="py-4">
          <MessageFilter 
            themes={themes} 
            predicateurs={predicateurs} 
            années={années} 
          />
        </SectionContainer>
      </div>

      {/* Liste des messages */}
      <section className="py-16">
        <SectionContainer>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Aucun message trouvé</h3>
              <p className="text-gray-500 mb-4 dark:text-gray-300">Essayez de modifier vos critères de recherche</p>
              <Button asChild variant="outline">
                <Link href="/messages">Réinitialiser les filtres</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredMessages.map((message) => (
                <div key={message.id} className="overflow-hidden bg-white rounded-lg shadow transition-all hover:shadow-md dark:bg-slate-900 dark:border dark:border-slate-700">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <ImageBlock
                        src={message.image}
                        alt={message.titre}
                        type="card"
                        className="object-cover"
                        containerClassName="h-full"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center z-10">
                        <Clock className="h-3 w-3 mr-1" />
                        {message.duree}
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getThemeColor(message.theme)}`} data-theme={message.theme}>{message.theme}</Badge>
                        <span className="text-sm text-gray-500 flex items-center dark:text-gray-300">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {new Date(message.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{message.titre}</h3>
                      <p className="text-gray-600 text-sm mb-4 dark:text-gray-300">{message.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="/placeholder.svg" alt={message.predicateur} />
                            <AvatarFallback>{message.predicateur.split(' ').pop()?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700 dark:text-gray-200">{message.predicateur}</span>
                        </div>
                        <Link href={message.lien}>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionContainer>
      </section>
    </>
  );
} 