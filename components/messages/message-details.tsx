import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Download, Share2, Book, Calendar, User, Clock } from 'lucide-react';

interface MessageDetailsProps {
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
  contentHtml?: string;
  duration?: string;
  relatedMessages?: {
    id: string;
    title: string;
    date: string;
    preacher: string;
  }[];
}

export function MessageDetails({
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
  downloadUrl,
  contentHtml,
  duration,
  relatedMessages = []
}: MessageDetailsProps) {
  
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
    <div className="space-y-8">
      {/* En-tête du message */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-12">
        <div className="md:col-span-2 space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {category}
          </Badge>
          
          <h1 className="text-3xl font-bold">{title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{preacher}</span>
            </div>
            
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            )}
            
            {passage && (
              <div className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                <span>{passage}</span>
              </div>
            )}
          </div>
          
          <p className="text-lg text-gray-700">{description}</p>
          
          <div className="flex flex-wrap gap-2">
            {videoUrl && (
              <Button asChild className="gap-1">
                <Link href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4" />
                  Regarder
                </Link>
              </Button>
            )}
            
            {audioUrl && (
              <Button variant="outline" asChild className="gap-1">
                <Link href={audioUrl}>
                  <Play className="h-4 w-4" />
                  Écouter
                </Link>
              </Button>
            )}
            
            {downloadUrl && (
              <Button variant="outline" asChild className="gap-1">
                <Link href={downloadUrl} download>
                  <Download className="h-4 w-4" />
                  Télécharger
                </Link>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={handleShare}
              className="gap-1"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>
        
        <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          ) : videoUrl ? (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <Link 
                href={videoUrl}
                className="bg-primary rounded-full p-6 hover:bg-primary/90 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="h-12 w-12 text-white" fill="white" />
              </Link>
            </div>
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <Book className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      {/* Contenu du message */}
      {(contentHtml || relatedMessages.length > 0) && (
        <Tabs defaultValue="contenu" className="mt-8">
          <TabsList>
            {contentHtml && <TabsTrigger value="contenu">Contenu</TabsTrigger>}
            {relatedMessages.length > 0 && <TabsTrigger value="connexes">Messages connexes</TabsTrigger>}
          </TabsList>
          
          {contentHtml && (
            <TabsContent value="contenu" className="mt-4">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </TabsContent>
          )}
          
          {relatedMessages.length > 0 && (
            <TabsContent value="connexes" className="mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                {relatedMessages.map((message) => (
                  <Link
                    key={message.id}
                    href={`/messages/${message.id}`}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium">{message.title}</h3>
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>{message.preacher}</span>
                      <span>{message.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
} 