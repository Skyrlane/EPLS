import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CallToActionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  background?: "light" | "dark" | "primary";
}

export function CallToAction({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  background = "primary"
}: CallToActionProps) {
  
  const bgStyles = {
    light: "bg-slate-50 text-slate-900",
    dark: "bg-slate-900 text-white",
    primary: "bg-primary text-white"
  };
  
  return (
    <section className={cn(
      "py-16",
      bgStyles[background]
    )}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">{description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className={cn(
                background === "primary" ? "bg-white text-primary hover:bg-white/90 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:border-slate-700" : 
                "bg-primary text-white hover:bg-primary/90",
                "shadow-md"
              )}
            >
              <Link href={primaryButtonLink}>{primaryButtonText}</Link>
            </Button>
            
            {secondaryButtonText && secondaryButtonLink && (
              <Button 
                asChild 
                size="lg" 
                variant={background === "primary" ? "outline" : "secondary"}
                className={cn(
                  background === "primary" && "border-2 border-white text-white bg-transparent hover:bg-white/10 dark:border-white dark:text-white"
                )}
              >
                <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 