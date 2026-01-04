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
    light: "bg-muted text-foreground",
    dark: "bg-card text-card-foreground",
    primary: "bg-primary text-primary-foreground"
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
                background === "primary"
                  ? "bg-background text-foreground hover:bg-background/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-md"
              )}
            >
              <Link href={primaryButtonLink}>{primaryButtonText}</Link>
            </Button>

            {secondaryButtonText && secondaryButtonLink && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn(
                  background === "primary" && "border-2 border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
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
