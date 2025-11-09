import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function CallToActionSimple({ title, description, buttonText, buttonLink }: CallToActionProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-2 border-white text-white bg-white/10 hover:bg-white/20"
      >
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  );
} 