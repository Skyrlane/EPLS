import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon } from "lucide-react";
import { ImageBlock } from "@/components/ui/image-block";

// Définition du type Echo pour ce composant spécifique
interface EchoProps {
  id: string;
  title: string;
  date: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
}

interface EchoCardProps {
  echo: EchoProps;
}

export function EchoCard({ echo }: EchoCardProps) {
  return (
    <div className="shadow-lg overflow-hidden">
      <Link href={echo.pdfUrl} className="relative block">
        <div className="aspect-video w-full overflow-hidden">
          <ImageBlock
            src={echo.coverImage}
            alt={`Image de l'Echo: ${echo.title}`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-card/20 backdrop-blur-sm p-4 hover:bg-card/30 transition-all transform hover:scale-110">
              <FileTextIcon className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4 bg-card">
        <div className="mb-2">
          <Badge variant="outline">Mensuel</Badge>
          <time className="ml-2 text-sm text-muted-foreground">{echo.date}</time>
        </div>
        <Link href={echo.pdfUrl} className="hover:text-primary">
          <h3 className="mb-2 line-clamp-1 text-xl font-semibold">{echo.title}</h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-muted-foreground">{echo.description}</p>
        <Button variant="outline" size="sm" asChild>
          <Link href={echo.pdfUrl} className="flex items-center gap-1">
            <FileTextIcon className="h-4 w-4" />
            Lire l'Echo
          </Link>
        </Button>
      </div>
    </div>
  );
} 