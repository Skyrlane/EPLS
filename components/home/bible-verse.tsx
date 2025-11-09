import { SectionContainer } from "@/components/ui/section-container";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface BibleVerseProps {
  verse: string;
  reference: string;
  bgImage?: string;
}

export function BibleVerse({ 
  verse, 
  reference, 
  bgImage = "/images/bible-bg.jpg" 
}: BibleVerseProps) {
  return (
    <div className="relative bg-slate-900 text-white py-20">
      {/* Overlay d'image avec opacité réduite */}
      {bgImage && (
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-6 opacity-70" />
          
          <p className={cn(
            "text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed mb-6",
            "italic"
          )}>
            "{verse}"
          </p>
          
          <p className="text-lg font-medium text-white/80">
            {reference}
          </p>
        </div>
      </div>
    </div>
  );
} 