import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/home/feature-card";
import { type LucideIcon, Book, Users, Heart, Music, Presentation, MessageCircle, Church, Coffee } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  content: string;
  linkText: string;
  linkHref: string;
}

interface FeaturesGridProps {
  title?: string;
  description?: string;
  features?: Feature[];
  background?: "white" | "light" | "primary" | "dark";
  columns?: 2 | 3 | 4;
}

export function FeaturesGrid({
  title = "Nos activités",
  description = "Découvrez les différentes activités et services que nous proposons",
  features = defaultFeatures,
  background = "white",
  columns = 3
}: FeaturesGridProps) {
  
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4"
  };
  
  return (
    <SectionContainer background={background}>
      <SectionHeader 
        title={title} 
        description={description}
        className={background === "primary" || background === "dark" ? "text-white" : ""}
      />
      
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 mt-10`}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            content={feature.content}
            linkText={feature.linkText}
            linkHref={feature.linkHref}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

const defaultFeatures: Feature[] = [
  {
    title: "Cultes dominicaux",
    description: "Notre célébration hebdomadaire",
    icon: Church,
    content: "Chaque dimanche, nous nous réunissons pour un temps de louange, de prière et d'enseignement biblique. Notre culte est accessible à tous, que vous soyez croyant de longue date ou simplement curieux.",
    linkText: "Horaires des cultes",
    linkHref: "/culte",
  },
  {
    title: "Étude biblique",
    description: "Approfondir la Parole de Dieu",
    icon: Book,
    content: "Nos études bibliques permettent d'explorer ensemble les Écritures, de poser des questions et de découvrir comment appliquer les enseignements bibliques à notre vie quotidienne.",
    linkText: "Programme des études",
    linkHref: "/etudes-bibliques",
  },
  {
    title: "Groupe de jeunes",
    description: "Un espace dédié aux adolescents et jeunes adultes",
    icon: Users,
    content: "Notre groupe de jeunes offre un lieu où les adolescents et jeunes adultes peuvent grandir ensemble dans la foi, partager leurs questions et développer des amitiés durables.",
    linkText: "Activités jeunesse",
    linkHref: "/jeunesse",
  },
  {
    title: "École du dimanche",
    description: "Pour les enfants de 3 à 12 ans",
    icon: Presentation,
    content: "Pendant le culte, nos moniteurs accueillent les enfants pour un temps d'enseignement adapté à leur âge, avec des chants, des histoires bibliques et des activités créatives.",
    linkText: "En savoir plus",
    linkHref: "/enfants",
  },
  {
    title: "Groupe de louange",
    description: "Adorer Dieu par la musique",
    icon: Music,
    content: "Notre équipe de louange se réunit régulièrement pour préparer les temps de culte et développer des talents musicaux au service de l'église et de Dieu.",
    linkText: "Rejoindre l'équipe",
    linkHref: "/louange",
  },
  {
    title: "Actions sociales",
    description: "Servir les plus démunis",
    icon: Heart,
    content: "Nous organisons régulièrement des actions caritatives pour venir en aide aux personnes dans le besoin, localement et internationalement, exprimant ainsi concrètement l'amour de Christ.",
    linkText: "Nos projets solidaires",
    linkHref: "/solidarite",
  },
  {
    title: "Groupes de maison",
    description: "Vivre la foi en communauté",
    icon: MessageCircle,
    content: "Nos groupes de maison se réunissent en semaine dans différents quartiers pour partager, prier et étudier la Bible dans un cadre plus intime et convivial.",
    linkText: "Trouver un groupe",
    linkHref: "/groupes",
  },
  {
    title: "Repas communautaires",
    description: "La communion fraternelle autour d'un repas",
    icon: Coffee,
    content: "Régulièrement, nous organisons des repas communautaires pour favoriser les liens entre les membres de l'église et accueillir les nouveaux venus dans une ambiance chaleureuse.",
    linkText: "Voir le calendrier",
    linkHref: "/culte/calendrier",
  },
]; 