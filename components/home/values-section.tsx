import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { Heart, Book, Users, Globe, PenTool, Smile } from "lucide-react";

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ValuesSectionProps {
  title?: string;
  description?: string;
  values?: Value[];
  missionStatement?: string;
  background?: "white" | "light" | "primary" | "dark";
}

export function ValuesSection({
  title = "Nos valeurs",
  description = "Les principes qui guident notre communauté",
  values = defaultValues,
  missionStatement = "Notre mission est de faire connaître Jésus-Christ, de former des disciples et de servir notre prochain avec amour et compassion.",
  background = "white"
}: ValuesSectionProps) {
  const isLight = background === "white" || background === "light";
  
  return (
    <SectionContainer background={background}>
      <SectionHeader 
        title={title} 
        description={description}
        className={!isLight ? "text-white" : ""}
      />
      
      {missionStatement && (
        <div className={cn(
          "max-w-3xl mx-auto mb-12 p-6 rounded-lg text-center",
          isLight ? "bg-primary/10" : "bg-white/10"
        )}>
          <h3 className={cn(
            "text-xl font-semibold mb-3",
            isLight ? "text-primary" : "text-white"
          )}>
            Notre mission
          </h3>
          <p className={cn(
            "text-lg italic",
            isLight ? "text-slate-700" : "text-white/90"
          )}>
            "{missionStatement}"
          </p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {values.map((value, index) => (
          <div 
            key={index}
            className={cn(
              "flex flex-col items-center text-center p-6 rounded-lg",
              isLight ? "bg-white shadow-sm border border-border" : "bg-white/10"
            )}
          >
            <div className={cn(
              "mb-4 p-3 rounded-full",
              isLight ? "bg-primary/10" : "bg-white/20"
            )}>
              {value.icon}
            </div>
            
            <h3 className={cn(
              "text-xl font-semibold mb-3",
              isLight ? "text-slate-900" : "text-white"
            )}>
              {value.title}
            </h3>
            
            <p className={isLight ? "text-slate-600" : "text-white/80"}>
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

const defaultValues: Value[] = [
  {
    title: "Amour",
    description: "Nous croyons en l'amour inconditionnel de Dieu et cherchons à le refléter dans nos relations avec Dieu, les uns avec les autres, et avec notre prochain.",
    icon: <Heart className="h-6 w-6 text-primary" />
  },
  {
    title: "Vérité biblique",
    description: "Nous sommes engagés à enseigner et à vivre selon les vérités de la Bible, qui est notre autorité finale en matière de foi et de pratique.",
    icon: <Book className="h-6 w-6 text-primary" />
  },
  {
    title: "Communauté",
    description: "Nous valorisons la vie communautaire authentique où chacun peut grandir spirituellement, être soutenu et développer des relations significatives.",
    icon: <Users className="h-6 w-6 text-primary" />
  },
  {
    title: "Mission",
    description: "Nous sommes appelés à partager la Bonne Nouvelle de Jésus-Christ localement et globalement, en paroles et en actes.",
    icon: <Globe className="h-6 w-6 text-primary" />
  },
  {
    title: "Excellence",
    description: "Nous nous efforçons de servir Dieu et les autres avec excellence, intégrité et fidélité dans tout ce que nous entreprenons.",
    icon: <PenTool className="h-6 w-6 text-primary" />
  },
  {
    title: "Joie",
    description: "Nous célébrons la joie qui vient de notre relation avec Dieu et nous cherchons à la partager dans toutes nos activités.",
    icon: <Smile className="h-6 w-6 text-primary" />
  }
]; 