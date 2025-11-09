import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionContainer } from "@/components/ui/section-container";

interface CallToActionBlockProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  background?: "white" | "light" | "primary" | "dark";
  withContainer?: boolean;
  className?: string;
}

export function CallToActionBlock({
  title,
  description,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  background = "primary",
  withContainer = true,
  className
}: CallToActionBlockProps) {
  
  const bgStyles = {
    white: "bg-white text-slate-900",
    light: "bg-slate-50 text-slate-900",
    primary: "bg-primary text-white",
    dark: "bg-slate-900 text-white"
  };
  
  const content = (
    <div className={cn("text-center py-16", className)}>
      <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          asChild
          size="lg"
          className={cn(
            background === "primary" || background === "dark" 
              ? "bg-white text-primary hover:bg-white/90" 
              : "bg-primary text-white hover:bg-primary/90",
            "shadow-md"
          )}
        >
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
        
        {secondaryButtonText && secondaryButtonLink && (
          <Button
            asChild
            size="lg"
            variant="outline"
            className={cn(
              background === "primary" || background === "dark"
                ? "border-2 border-white text-white bg-white/10 hover:bg-white/20"
                : "border-2 border-primary text-primary hover:bg-primary/10"
            )}
          >
            <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
  
  if (withContainer) {
    return (
      <SectionContainer background={background}>
        {content}
      </SectionContainer>
    );
  }
  
  return (
    <div className={cn(
      "px-4",
      bgStyles[background]
    )}>
      <div className="container mx-auto">
        {content}
      </div>
    </div>
  );
} 