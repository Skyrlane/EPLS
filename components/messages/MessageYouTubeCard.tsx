'use client';

import Link from 'next/link';
// Image standard pour miniatures YouTube (bypass Next.js optimization)
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, UserIcon, PlayCircleIcon, ClockIcon } from 'lucide-react';
import type { MessageItem } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { timestampToDate } from '@/lib/date-helpers';

interface MessageYouTubeCardProps {
  message: MessageItem;
  className?: string;
}

/**
 * Carte pour afficher un message/prédication YouTube
 * Avec thumbnail, durée, tag coloré, pasteur et date
 */
export function MessageYouTubeCard({ message, className }: MessageYouTubeCardProps) {
  const messageDate = timestampToDate(message.date);
  const formattedDate = format(messageDate, 'd MMMM yyyy', { locale: fr });

  // Utiliser coverImageUrl si disponible, sinon thumbnailUrl YouTube
  const thumbnailSrc = message.coverImageUrl || message.thumbnailUrl;

  // Tronquer la description à 2 lignes (environ 120 caractères)
  const truncatedDescription = message.description.length > 120
    ? `${message.description.substring(0, 120)}...`
    : message.description;

  return (
    <Card className={cn(
      'overflow-hidden transition-all hover:shadow-lg group',
      className
    )}>
      <CardContent className="p-0">
        {/* Thumbnail avec overlay durée */}
        <Link href={`/messages/${message.id}`} className="relative block aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnailSrc}
            alt={message.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay play icon */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircleIcon className="h-16 w-16 text-white drop-shadow-lg" />
          </div>

          {/* Badge durée en bas à droite */}
          {message.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {message.duration}
            </div>
          )}
        </Link>

        {/* Contenu de la carte */}
        <div className="p-4 space-y-3">
          {/* Tag */}
          <div>
            <Badge
              style={{
                backgroundColor: message.tagColor,
                color: '#ffffff'
              }}
              className="text-xs font-medium"
            >
              {message.tag}
            </Badge>
          </div>

          {/* Titre */}
          <Link href={`/messages/${message.id}`}>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {message.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncatedDescription}
          </p>

          {/* Métadonnées */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{message.pastor}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Bouton voir */}
          <Link href={`/messages/${message.id}`} className="block">
            <Button variant="outline" className="w-full" size="sm">
              <PlayCircleIcon className="h-4 w-4 mr-2" />
              Voir le message
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
