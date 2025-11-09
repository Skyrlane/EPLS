"use client"

import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ImageBlock } from '@/components/ui/image-block';

// Types pour les événements
interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  isRecurring?: boolean;
}

interface CalendarCombinedProps {
  events: Event[];
  title?: string;
  description?: string;
  showViewAll?: boolean;
}

export function CalendarCombined({
  events,
  title = "Calendrier des événements",
  description = "Retrouvez tous les événements à venir de notre église",
  showViewAll = true
}: CalendarCombinedProps) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow card-hover">
            {event.imageUrl && (
              <div className="aspect-video w-full">
                <ImageBlock
                  src={event.imageUrl}
                  alt={event.title}
                  type="card"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <CardDescription className="mt-3 line-clamp-2">
                  {event.description}
                </CardDescription>
              )}
              
              {event.isRecurring && (
                <div className="mt-3">
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    Événement récurrent
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showViewAll && (
        <div className="text-center mt-8">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/culte/calendrier">
              Voir tous les événements
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
} 