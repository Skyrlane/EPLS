import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WelcomeSectionProps {
  title?: string;
  description?: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
}

export function WelcomeSection({
  title = "Bienvenue à l'Église Protestante Libre de Saint-Maur",
  description = "Un lieu de vie, de foi et de communauté",
  content,
  ctaText = "En savoir plus sur nous",
  ctaLink = "/a-propos",
}: WelcomeSectionProps) {
  return (
    <SectionContainer background="light">
      <div className="max-w-3xl mx-auto">
        <SectionHeader 
          title={title}
          description={description}
        />
        
        <div className="prose prose-slate mx-auto mb-8">
          <p className="text-lg leading-relaxed">{content}</p>
        </div>
        
        {ctaText && ctaLink && (
          <div className="text-center mt-8">
            <Link 
              href={ctaLink}
              className={cn(
                "inline-flex items-center justify-center px-6 py-3 border border-transparent",
                "text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90",
                "transition-colors shadow-sm"
              )}
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </SectionContainer>
  );
} 