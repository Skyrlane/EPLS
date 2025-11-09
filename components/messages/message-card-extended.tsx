import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Play, Download, Share2 } from 'lucide-react';

interface MessageCardExtendedProps {
  id: string;
  title: string;
  date: string;
  category: string;
  passage?: string;
  description: string;
  preacher: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  downloadUrl?: string;
}

export function MessageCardExtended({
  id,
  title,
  date,
  category,
  passage,
  description,
  preacher,
  imageUrl,
  videoUrl,
  audioUrl,
  downloadUrl
}: MessageCardExtendedProps) {
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Message "${title}" par ${preacher}`,
        url: window.location.origin + `/messages/${id}`
      }).catch(err => {
        console.error('Erreur lors du partage:', err);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.origin + `/messages/${id}`)
        .then(() => alert('Lien copié dans le presse-papier!'))
        .catch(err => console.error('Erreur lors de la copie:', err));
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-100 h-48 md:h-auto relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <Play className="h-16 w-16 text-primary" />
            </div>
          )}
          
          {videoUrl && (
            <Link 
              href={videoUrl}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-primary rounded-full p-4 transform group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white" fill="white" />
              </div>
            </Link>
          )}
        </div>
        
        <div className="p-6 md:w-2/3">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {category}
            </Badge>
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          
          {passage && (
            <p className="text-primary text-sm font-medium mb-2">{passage}</p>
          )}
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>
          
          <div className="flex flex-wrap justify-between items-center">
            <span className="text-gray-700 font-medium">{preacher}</span>
            
            <div className="flex space-x-2 mt-2 md:mt-0">
              {audioUrl && (
                <Button size="sm" variant="outline" asChild className="gap-1">
                  <Link href={audioUrl}>
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">Écouter</span>
                  </Link>
                </Button>
              )}
              
              {videoUrl && (
                <Button size="sm" asChild className="gap-1">
                  <Link href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">Regarder</span>
                  </Link>
                </Button>
              )}
              
              {downloadUrl && (
                <Button size="sm" variant="outline" asChild className="gap-1">
                  <Link href={downloadUrl} download>
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </Link>
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleShare}
                className="gap-1"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Partager</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 