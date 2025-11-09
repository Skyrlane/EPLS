"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";

export interface Event {
  id?: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  description?: string;
  type?: string;
  category?: string;
}

interface EventListProps {
  events: Event[];
  title?: string;
  description?: string;
}

export function EventList({ events, title = "Événements à venir", description }: EventListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun événement prévu pour cette période.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {events.map((event) => (
          <div key={event.id || `${event.title}-${event.date.getTime()}`} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{format(event.date, "d MMMM yyyy", { locale: fr })}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="mr-1 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {event.description && (
                  <p className="mt-2 text-sm">{event.description}</p>
                )}
              </div>
              {(event.type || event.category) && (
                <Badge variant="outline" className="self-start">
                  {event.category || event.type}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 