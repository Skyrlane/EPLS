'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Announcement } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, MapPin, Euro } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { timestampToDate, formatEventDate } from '@/lib/date-helpers';

interface CalendarMiniWithEventsProps {
  currentMonth?: Date;
}

/**
 * Mini calendrier avec indicateurs visuels pour les jours avec événements
 * Récupère les annonces depuis Firestore et affiche des dots sur les jours concernés
 */
export function CalendarMiniWithEvents({ currentMonth = new Date() }: CalendarMiniWithEventsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Announcement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        if (!firestore) {
          setLoading(false);
          return;
        }

        // Récupérer toutes les annonces actives
        const announcementsRef = collection(firestore, 'announcements');
        const q = query(
          announcementsRef,
          where('status', '==', 'published'),
          where('isActive', '==', true)
        );

        const snapshot = await getDocs(q);
        const fetchedAnnouncements = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
            expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : data.expiresAt ? new Date(data.expiresAt) : undefined,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as Announcement;
        });

        setAnnouncements(fetchedAnnouncements);
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement annonces calendrier:', err);
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  // Calculer les jours du mois
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Trouver les jours avec événements
  const daysWithEvents = new Map<number, Announcement[]>();
  announcements.forEach(announcement => {
    const eventDate = timestampToDate(announcement.date);
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const day = eventDate.getDate();
      if (!daysWithEvents.has(day)) {
        daysWithEvents.set(day, []);
      }
      daysWithEvents.get(day)!.push(announcement);
    }
  });

  // Vérifier si c'est aujourd'hui
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <div>
      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
          <div key={day} className="text-center font-medium py-2 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1">
        {/* Jours vides avant le début du mois */}
        {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, (_, i) => (
          <div key={`empty-${i}`} className="h-9 p-1"></div>
        ))}

        {/* Jours du mois */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasEvents = daysWithEvents.has(day);
          const dayEvents = daysWithEvents.get(day) || [];
          const isCurrentDay = isToday(day);

          const dayElement = (
            <div
              className={`h-9 p-1 border rounded-md flex items-center justify-center relative ${
                isCurrentDay
                  ? "border-primary/70 ring-1 ring-primary bg-primary/5"
                  : hasEvents
                  ? "border-blue-300 text-blue-600 font-medium cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  : "border-gray-200"
              }`}
            >
              <span className={`text-sm ${isCurrentDay ? "font-bold" : ""}`}>
                {day}
              </span>
              {hasEvents && (
                <span
                  className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: dayEvents[0].tagColor }}
                ></span>
              )}
              {isCurrentDay && (
                <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
              )}
            </div>
          );

          // Si le jour a des événements, ajouter un tooltip
          if (hasEvents && dayEvents.length > 0) {
            return (
              <div key={`day-${day}`}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setSelectedDayEvents(dayEvents);
                          setDialogOpen(true);
                        }}
                        className="w-full"
                      >
                        {dayElement}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start" className="max-w-[250px]">
                      <div className="space-y-2">
                        {dayEvents.map((event, idx) => (
                          <div
                            key={event.id}
                            className={idx > 0 ? "pt-2 border-t border-border/30" : ""}
                          >
                            <div className="font-semibold text-sm">{event.title}</div>
                            <div className="text-xs text-muted-foreground">{event.time} - {event.location.name}</div>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          }

          return <div key={`day-${day}`}>{dayElement}</div>;
        })}
      </div>

      {loading && (
        <div className="text-center text-xs text-muted-foreground mt-2">
          Chargement des événements...
        </div>
      )}

      {/* Dialog pour afficher les événements du jour */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDayEvents.length > 0 &&
                formatEventDate(selectedDayEvents[0].date, selectedDayEvents[0].time).split(' at ')[0]
              }
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedDayEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 space-y-3">
                {/* En-tête avec badge */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-semibold flex-1">{event.title}</h3>
                  <Badge
                    style={{ backgroundColor: event.tagColor }}
                    className="text-white"
                  >
                    {event.tag}
                  </Badge>
                </div>

                {/* Date et heure */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>

                {/* Lieu */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{event.location.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{event.location.address}</p>
                </div>

                {/* Description */}
                {event.content && (
                  <p className="text-sm leading-relaxed">{event.content}</p>
                )}

                {/* Détails */}
                {event.details && event.details.length > 0 && (
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    {event.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}

                {/* Tarifs */}
                {event.pricing && (
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Euro className="h-4 w-4" />
                      <span>Tarifs</span>
                    </div>
                    {event.pricing.free && <p className="text-sm ml-6">• {event.pricing.free}</p>}
                    {event.pricing.child && <p className="text-sm ml-6">• {event.pricing.child}</p>}
                    {event.pricing.student && <p className="text-sm ml-6">• {event.pricing.student}</p>}
                    {event.pricing.adult && <p className="text-sm ml-6">• {event.pricing.adult}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
