import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionContainer } from "@/components/ui/section-container";
import { ImageBlock } from "@/components/ui/image-block";

// Simuler une fonction qui récupère le message par son slug
function getMessageBySlug(slug: string) {
  // Messages simulés
  const messages = [
    {
      id: "grace-suffisante",
      slug: "grace-suffisante",
      title: "La grâce suffisante",
      date: "14 avril 2024",
      description: "Dans ce message, nous explorons comment la grâce de Dieu se manifeste pleinement dans nos faiblesses et comment elle est suffisante pour toutes les circonstances de notre vie.",
      content: "Lorsque nous parlons de la grâce de Dieu, nous faisons référence à Son amour et Sa faveur imméritée. La Bible nous enseigne dans 2 Corinthiens 12:9 : \"Ma grâce te suffit, car ma puissance s'accomplit dans la faiblesse.\" Dans ce message, nous explorons la profondeur de cette promesse et comment elle s'applique à nos vies quotidiennes, nos défis et nos luttes. La grâce de Dieu n'est pas seulement un concept théologique abstrait, mais une réalité tangible qui nous soutient dans toutes les circonstances de la vie.",
      image: "/images/messages/grace.jpg",
      series: "Grâce",
      speaker: {
        name: "Pasteur Jean Dupont",
        image: "/images/team/pasteur.webp"
      },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // URL vidéo de démonstration
    },
    {
      id: "latest-message",
      slug: "latest-message",
      title: "Le message de la semaine dernière",
      date: "14 juillet 2024",
      description: "Un message inspirant sur l'amour du prochain et la grâce divine.",
      content: "Contenu complet du message...",
      image: "/images/messages/grace.jpg",
      series: "Série d'été",
      speaker: {
        name: "Pasteur Robert",
        image: "/images/team/pasteur.webp"
      },
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // URL vidéo de démonstration
    },
    // Autres messages...
  ];

  return messages.find((message) => message.slug === slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const message = getMessageBySlug(params.slug);
  
  if (!message) {
    return {
      title: "Message non trouvé",
    };
  }
  
  return {
    title: `${message.title} - Messages EPLS`,
    description: message.description,
  };
}

export default function MessagePage({ params }: { params: { slug: string } }) {
  const message = getMessageBySlug(params.slug);
  
  if (!message) {
    notFound();
  }
  
  return (
    <div className="py-8">
      <SectionContainer>
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/messages" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux messages
            </Link>
          </Button>
          
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-100 text-blue-800">{message.series}</Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{message.date}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{message.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarFallback>{message.speaker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{message.speaker.name}</span>
            </div>
          </div>
        </div>
        
        {/* Image principale et vidéo */}
        <div className="mb-8">
          <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md mb-4">
            {message.videoUrl ? (
              <iframe 
                src={message.videoUrl} 
                title={message.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <ImageBlock
                src={message.image}
                alt={message.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        
        {/* Contenu du message */}
        <div className="prose max-w-none">
          <p className="text-lg mb-4">{message.description}</p>
          <p>{message.content}</p>
        </div>
      </SectionContainer>
    </div>
  );
} 