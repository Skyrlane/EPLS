"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { Announcement } from '@/types'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, MapPin, AlertCircle, Euro } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AnnouncementCard } from "@/components/announcements/announcement-card"
import { timestampToDate, formatEventDate } from '@/lib/date-helpers'

// Les événements sont maintenant récupérés depuis Firestore

// Composant pour afficher les détails d'un événement dans une bulle
const EventPreview = ({ event }: { event: Announcement }) => {
  return (
    <div className="space-y-1 max-w-[250px]">
      <div className="font-semibold">{event.title}</div>
      <div className="text-xs flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {event.time}
      </div>
      <div className="text-xs text-muted-foreground flex items-center">
        <MapPin className="h-3 w-3 mr-1" />
        {event.location.name}
      </div>
    </div>
  );
};

// Fonction pour vérifier si une date correspond à aujourd'hui
function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

export default function Calendrier() {
  // État pour suivre le mois et l'année actuels
  const [currentDate, setCurrentDate] = useState(() => {
    // Utiliser la date actuelle (aujourd'hui)
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  })

  // État pour les annonces Firestore
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // État pour l'affichage du popover sur mobile
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // État pour le Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Announcement[]>([]);

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Récupérer les annonces depuis Firestore
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        if (!firestore) {
          setLoading(false);
          return;
        }

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

        // Filtrer les événements non expirés et trier
        const today = new Date();
        const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        const filtered = fetchedAnnouncements
          .filter(a => timestampToDate(a.date) >= oneDayAgo)
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            if (a.priority !== b.priority) return a.priority - b.priority;
            return timestampToDate(a.date).getTime() - timestampToDate(b.date).getTime();
          });

        setAnnouncements(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement annonces calendrier:', err);
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  // Calculs pour le calendrier
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Dimanche, 1 = Lundi, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Formater le nom du mois
  const currentMonthName = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric"
  })

  // Événements du mois actuel
  const eventsThisMonth = announcements.filter(announcement => {
    const eventDate = timestampToDate(announcement.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });

  // Jours avec événements pour ce mois (Map pour grouper par jour)
  const eventsByDay = new Map<number, Announcement[]>();
  eventsThisMonth.forEach(event => {
    const day = timestampToDate(event.date).getDate();
    if (!eventsByDay.has(day)) {
      eventsByDay.set(day, []);
    }
    eventsByDay.get(day)!.push(event);
  });

  const daysWithEvents = Array.from(eventsByDay.keys())

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() + 1)
      return newDate
    })
  }

  // Fonction pour obtenir les événements d'un jour spécifique
  const getEventsForDay = (year: number, month: number, day: number): Announcement[] => {
    return eventsByDay.get(day) || [];
  };

  // Filtrer les annonces importantes (pinned ou haute priorité)
  const specialEvents = announcements.filter(a => a.isPinned || a.priority <= 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Calendrier des événements</h1>

      <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{currentMonthName}</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Mois précédent
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                Mois suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Calendrier */}
          <div className="mb-8">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Jours blancs avant le premier jour du mois */}
              {Array.from({ length: (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1) }).map((_, index) => (
                <div key={`empty-${index}`} className="h-12 sm:h-16 p-1"></div>
              ))}
              
              {/* Jours du mois */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const hasEvents = daysWithEvents.includes(day)
                const dayId = `${year}-${month+1}-${day}`
                const dayEvents = getEventsForDay(year, month, day)
                const isCurrentDay = isToday(year, month, day)
                
                const dayContent = (
                  <Button
                    variant={hasEvents ? "default" : "ghost"}
                    className={`h-12 sm:h-16 w-full rounded-md font-normal relative ${
                      hasEvents
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-200"
                        : ""
                    } ${
                      isCurrentDay
                        ? "ring-2 ring-primary dark:ring-primary/70"
                        : ""
                    }`}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedDayEvents(dayEvents);
                        setDialogOpen(true);
                      }
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm sm:text-base ${isCurrentDay ? "font-bold" : ""}`}>
                        {day}
                        {isCurrentDay && (
                          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full"></span>
                        )}
                      </span>
                      {hasEvents && (
                        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </Button>
                )
                
                if (hasEvents) {
                  return (
                    <div key={day} className="relative">
                      {/* Tooltip pour écrans plus grands */}
                      <div className="hidden sm:block">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild onClick={() => setOpenPopover(null)}>
                              {dayContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="z-50">
                              <div className="space-y-2">
                                {dayEvents.map((event) => (
                                  <EventPreview key={event.id} event={event} />
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      {/* Popover pour mobile */}
                      <div className="block sm:hidden">
                        <Popover open={openPopover === dayId} onOpenChange={(isOpen: boolean) => setOpenPopover(isOpen ? dayId : null)}>
                          <PopoverTrigger asChild>
                            {dayContent}
                          </PopoverTrigger>
                          <PopoverContent className="w-screen max-w-[95vw] sm:max-w-xs p-2 z-50" side="top">
                            <div className="font-medium text-sm mb-2">
                              {new Date(year, month, day).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                              })}
                            </div>
                            <div className="space-y-2">
                              {dayEvents.map((event) => (
                                <div key={event.id} className="border-b pb-2 last:border-0">
                                  <EventPreview event={event} />
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2 border-t text-center">
                              <Button
                                variant="link"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  setSelectedDayEvents(dayEvents);
                                  setDialogOpen(true);
                                  setOpenPopover(null);
                                }}
                              >
                                Voir détails
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )
                }
                
                return (
                  <div key={day}>
                    {dayContent}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Liste des événements du mois */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Événements importants & à venir</h2>

            <div className="space-y-4">
              {/* Afficher les annonces importantes en premier avec un titre de section */}
              {specialEvents.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mt-2 mb-4 text-primary flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Annonces importantes
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {specialEvents.map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                  </div>
                </>
              )}
              
              {/* Événements réguliers du mois avec un titre de section */}
              {eventsThisMonth.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mt-6 mb-2">Événements de {currentMonthName}</h3>
                  {eventsThisMonth.map((event) => (
                    <Card
                      key={event.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedDayEvents([event]);
                        setDialogOpen(true);
                      }}
                    >
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                          })}{" "}
                          à {event.time}
                        </div>

                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location.name}
                        </div>
                      </div>

                      {event.content && (
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm">{event.content}</p>

                          <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {event.type}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </>
              )}
              
              {eventsThisMonth.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 py-4 mt-6">
                  Aucun événement prévu pour ce mois.
                </p>
              )}
            </div>
          </div>

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
        </>
    </div>
  )
} 