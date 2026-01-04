import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileTextIcon, ArrowRightIcon } from "lucide-react";

interface EchoProps {
  title: string;
  edition: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
}

export function LatestEchoSection({ echo }: { echo: EchoProps }) {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">L'Echo mensuel</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Consultez notre bulletin mensuel avec les dernières nouvelles de l'église
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image à gauche */}
              <div className="md:w-1/3">
                <img
                  src={echo.coverUrl || "/placeholder.svg"}
                  alt={echo.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Contenu à droite */}
              <div className="md:w-2/3 p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{echo.title}</h3>
                <p className="text-muted-foreground mb-4">Édition {echo.edition}</p>
                <p className="text-foreground mb-8">{echo.description}</p>

                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href={echo.pdfUrl} className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Télécharger le PDF
                    </Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href="/echo" className="flex items-center gap-2">
                      <ArrowRightIcon className="h-4 w-4" />
                      Archives
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 