import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CallToActionBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage: string;
  overlayColor?: "dark" | "primary" | "none";
  imageOpacity?: number;
  fullHeight?: boolean;
}

export function CallToActionBanner({
  title,
  description,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
  overlayColor = "dark",
  imageOpacity = 0.6,
  fullHeight = false
}: CallToActionBannerProps) {
  
  const overlayStyles = {
    dark: "bg-slate-900",
    primary: "bg-primary",
    none: ""
  };
  
  return (
    <div className={cn(
      "relative",
      fullHeight ? "min-h-[70vh]" : "py-24"
    )}>
      {/* Image d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className={`object-cover`}
          style={{ opacity: imageOpacity }}
          priority
        />
        {overlayColor !== "none" && (
          <div className={cn(
            "absolute inset-0 opacity-70",
            overlayStyles[overlayColor]
          )} />
        )}
      </div>
      
      {/* Contenu */}
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center">
        <div className={cn(
          "text-center max-w-3xl text-white",
          fullHeight ? "min-h-[70vh] flex flex-col justify-center" : ""
        )}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-sm">{title}</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/90 shadow-md"
            >
              <Link href={buttonLink}>{buttonText}</Link>
            </Button>
            
            {secondaryButtonText && secondaryButtonLink && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm"
              >
                <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 