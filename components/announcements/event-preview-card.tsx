'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, Clock } from 'lucide-react';
import type { Announcement } from '@/types';
import { formatShortDate, timestampToDate, getRelativeDateLabel } from '@/lib/date-helpers';
import { cn } from '@/lib/utils';

interface EventPreviewCardProps {
  announcement: Announcement;
  className?: string;
}

/**
 * Carte simplifiée pour afficher un aperçu d'événement
 * Version compacte pour la section "Prochains événements"
 */
export function EventPreviewCard({ announcement, className }: EventPreviewCardProps) {
  // Convertir la date en Date JavaScript si nécessaire
  const eventDate = timestampToDate(announcement.date);

  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-all', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Tag + Date relative */}
          <div className="flex items-center justify-between">
            <Badge
              style={{
                backgroundColor: announcement.tagColor,
                color: '#ffffff'
              }}
              className="text-xs font-medium px-2 py-1"
            >
              {announcement.tag}
            </Badge>

            <span className="text-xs font-medium text-primary">
              {getRelativeDateLabel(eventDate)}
            </span>
          </div>

          {/* Titre */}
          <h4 className="font-semibold text-base leading-tight line-clamp-2">
            {announcement.title}
          </h4>

          {/* Date et heure */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formatShortDate(eventDate)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{announcement.time}</span>
            </div>
          </div>

          {/* Lieu */}
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPinIcon className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{announcement.location.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
