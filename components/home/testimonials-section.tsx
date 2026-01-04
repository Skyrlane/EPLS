import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface Testimonial {
  content: string;
  author: string;
  role?: string;
}

interface TestimonialsSectionProps {
  title?: string;
  description?: string;
  testimonials?: Testimonial[];
}

export function TestimonialsSection({
  title = "Témoignages",
  description = "Ce que notre communauté partage sur son expérience",
  testimonials = defaultTestimonials,
}: TestimonialsSectionProps) {
  return (
    <SectionContainer background="light">
      <SectionHeader 
        title={title} 
        description={description}
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className={cn(
              "bg-card p-6 rounded-lg shadow-md",
              "flex flex-col h-full relative"
            )}
          >
            <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
            
            <p className="italic text-slate-600 mb-6 relative z-10">
              "{testimonial.content}"
            </p>
            
            <div className="mt-auto">
              <p className="font-semibold">{testimonial.author}</p>
              {testimonial.role && (
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

const defaultTestimonials: Testimonial[] = [
  {
    content: "Cette église est devenue ma seconde famille. J'y ai trouvé un lieu d'accueil, d'écoute et de croissance spirituelle. Les messages sont profonds et pertinents pour notre vie quotidienne.",
    author: "Marie L.",
    role: "Membre depuis 2018"
  },
  {
    content: "Grâce aux études bibliques et au mentorat, j'ai pu approfondir ma foi et comprendre comment l'appliquer concrètement dans ma vie professionnelle et familiale.",
    author: "Thomas D.",
    role: "Membre depuis 2015"
  },
  {
    content: "Nos enfants adorent les activités pour la jeunesse. Les moniteurs sont passionnés et transmettent les valeurs chrétiennes de manière ludique et adaptée à leur âge.",
    author: "Sophie et Pierre B.",
    role: "Parents de trois enfants"
  },
  {
    content: "Après avoir déménagé dans la région, j'ai été chaleureusement accueilli dans cette communauté. J'ai rapidement pu m'intégrer et participer aux différentes activités.",
    author: "Jean-Marc T.",
    role: "Nouveau membre"
  },
  {
    content: "L'engagement social de l'église m'a particulièrement touché. Pouvoir servir les autres tout en vivant sa foi donne un sens profond à mon engagement chrétien.",
    author: "Lucie F.",
    role: "Bénévole aux œuvres sociales"
  },
  {
    content: "La louange authentique et les moments de prière communautaire sont des temps forts qui nourrissent ma relation avec Dieu semaine après semaine.",
    author: "Paul R.",
    role: "Membre de l'équipe de louange"
  }
]; 