'use client';

import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon, EyeIcon } from 'lucide-react';
import type { MessageItem } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { timestampToDate } from '@/lib/date-helpers';

interface MessageYouTubePlayerProps {
  message: MessageItem;
  className?: string;
}

/**
 * Lecteur YouTube responsive avec métadonnées du message
 * Ratio 16:9 maintenu sur tous les écrans
 */
export function MessageYouTubePlayer({ message, className }: MessageYouTubePlayerProps) {
  const messageDate = timestampToDate(message.date);
  const formattedDate = format(messageDate, 'd MMMM yyyy', { locale: fr });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Lecteur YouTube responsive 16:9 */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shadow-lg">
        <iframe
          src={message.embedUrl}
          title={message.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Métadonnées du message */}
      <div className="space-y-4">
        {/* Tag */}
        <div>
          <Badge
            style={{
              backgroundColor: message.tagColor,
              color: '#ffffff'
            }}
            className="text-sm font-medium"
          >
            {message.tag}
          </Badge>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold leading-tight">
          {message.title}
        </h1>

        {/* Infos ligne */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="font-medium">{message.pastor}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          {message.views !== undefined && (
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              <span>{message.views.toLocaleString('fr-FR')} vues</span>
            </div>
          )}
        </div>

        {/* Description complète */}
        {message.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-line">
              {message.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
