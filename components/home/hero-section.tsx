import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
}

export function HeroSection({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] flex items-center justify-center bg-slate-800 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-primary text-white shadow-md hover:bg-primary/90 hover:text-white">
            <Link href={primaryButtonLink}>{primaryButtonText}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white bg-white/10 hover:bg-white/20"
          >
            <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 