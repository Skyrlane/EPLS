import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Music, 
  Users, 
  Heart, 
  Presentation, 
  Coffee 
} from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

interface ServicesSectionProps {
  title?: string;
  description?: string;
}

export function ServicesSection({ 
  title = "Nos activités",
  description = "Découvrez les différentes activités et services que nous proposons"
}: ServicesSectionProps) {

  const services: Service[] = [
    {
      title: "Culte dominical",
      description: "Nos cultes ont lieu chaque dimanche à 10h30, avec louange, prière et enseignement biblique.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      link: "/culte"
    },
    {
      title: "Groupe de louange",
      description: "Notre équipe de louange se réunit régulièrement pour préparer les temps de louange.",
      icon: <Music className="h-8 w-8 text-primary" />,
      link: "/louange"
    },
    {
      title: "Études bibliques",
      description: "Des groupes d'étude biblique se réunissent en semaine dans différents quartiers.",
      icon: <Presentation className="h-8 w-8 text-primary" />,
      link: "/etudes-bibliques"
    },
    {
      title: "Jeunesse",
      description: "Des activités spécifiques pour les enfants et les adolescents sont organisées régulièrement.",
      icon: <Users className="h-8 w-8 text-primary" />,
      link: "/jeunesse"
    },
    {
      title: "Œuvres sociales",
      description: "Nos actions caritatives soutiennent les personnes dans le besoin localement et à l'international.",
      icon: <Heart className="h-8 w-8 text-primary" />,
      link: "/oeuvres-sociales"
    },
    {
      title: "Repas communautaires",
      description: "Nous organisons régulièrement des repas pour favoriser la communion fraternelle.",
      icon: <Coffee className="h-8 w-8 text-primary" />,
      link: "/communaute"
    }
  ];

  return (
    <SectionContainer background="primary">
      <SectionHeader 
        title={title} 
        description={description}
        className="text-white"
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {services.map((service, index) => (
          <div 
            key={index}
            className={cn(
              "bg-white/10 backdrop-blur-sm p-6 rounded-lg",
              "hover:bg-white/20 transition-colors",
              "flex flex-col h-full"
            )}
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
            <p className="text-white/80 mb-4 flex-grow">{service.description}</p>
            
            {service.link && (
              <Link 
                href={service.link}
                className="text-white hover:text-white/90 font-medium inline-flex items-center mt-auto"
              >
                En savoir plus
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
} 