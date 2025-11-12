'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, AlertCircle, EuroIcon } from 'lucide-react';
import type { Announcement } from '@/types';
import { formatEventDate, timestampToDate } from '@/lib/date-helpers';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
}

/**
 * Carte complète pour afficher une annonce importante
 * Avec tous les détails : date, lieu, tarification, etc.
 */
export function AnnouncementCard({ announcement, className }: AnnouncementCardProps) {
  // Convertir la date en Date JavaScript si nécessaire
  const eventDate = timestampToDate(announcement.date);

  return (
    <Card className={cn(
      'overflow-hidden transition-all hover:shadow-md',
      announcement.isPinned && 'border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10',
      className
    )}>
      <CardContent className="p-5 relative">
        <div className="space-y-4">
          {/* Tag du type d'événement */}
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

            {announcement.isPinned && (
              <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>Annonce importante</span>
              </div>
            )}
          </div>

          {/* Titre */}
          <div>
            <h3 className={cn(
              'font-bold text-lg leading-tight',
              announcement.isPinned && 'text-primary'
            )}>
              {announcement.title}
            </h3>
          </div>

          {/* Date et heure */}
          <div className="flex items-start text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{formatEventDate(eventDate, announcement.time)}</span>
          </div>

          {/* Lieu */}
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPinIcon className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-foreground">{announcement.location.name}</div>
              <div className="text-xs">{announcement.location.address}</div>
            </div>
          </div>

          {/* Content / Description */}
          {announcement.content && (
            <p className="text-sm text-muted-foreground">
              {announcement.content}
            </p>
          )}

          {/* Détails (liste à puces) */}
          {announcement.details && announcement.details.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Au programme :</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {announcement.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tarification */}
          {announcement.pricing && (
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <EuroIcon className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Tarifs :</p>
              </div>
              {announcement.pricing.free && (
                <p className="text-sm text-muted-foreground">• {announcement.pricing.free}</p>
              )}
              {announcement.pricing.child && (
                <p className="text-sm text-muted-foreground">• {announcement.pricing.child}</p>
              )}
              {announcement.pricing.student && (
                <p className="text-sm text-muted-foreground">• {announcement.pricing.student}</p>
              )}
              {announcement.pricing.adult && (
                <p className="text-sm text-muted-foreground">• {announcement.pricing.adult}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
