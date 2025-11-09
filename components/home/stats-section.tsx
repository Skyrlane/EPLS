import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { Users, Book, Heart, Calendar } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface StatsSectionProps {
  title?: string;
  description?: string;
  stats?: Stat[];
}

export function StatsSection({
  title = "Notre église en chiffres",
  description = "Quelques données sur notre communauté et nos activités",
  stats = defaultStats,
}: StatsSectionProps) {
  return (
    <SectionContainer background="primary">
      <SectionHeader 
        title={title} 
        description={description}
        className="text-white"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={cn(
              "flex flex-col items-center text-center p-4",
              "bg-white/10 backdrop-blur-sm rounded-lg"
            )}
          >
            <div className="mb-3 p-3 bg-white/20 rounded-full">
              {stat.icon}
            </div>
            <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
            <p className="text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

const defaultStats: Stat[] = [
  {
    value: "150+",
    label: "Membres",
    icon: <Users className="h-6 w-6 text-white" />
  },
  {
    value: "65",
    label: "Années d'existence",
    icon: <Calendar className="h-6 w-6 text-white" />
  },
  {
    value: "5+",
    label: "Groupes de maison",
    icon: <Book className="h-6 w-6 text-white" />
  },
  {
    value: "20+",
    label: "Projets solidaires",
    icon: <Heart className="h-6 w-6 text-white" />
  }
]; 