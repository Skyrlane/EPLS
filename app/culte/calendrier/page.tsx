"use client"

import Link from "next/link"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, MapPin, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
import { importantNotices } from "@/lib/data/notices"
import { Badge } from "@/components/ui/badge"
import { SectionContainer } from "@/components/ui/section-container"

// Ajout des événements spéciaux correspondant aux annonces importantes
const specialEvents = [
  {
    id: "assemblee-generale-2025",
    title: "Assemblée Générale ordinaire",
    date: "2025-03-16", // au format YYYY-MM-DD pour la cohérence
    time: "16:00",
    location: "Temple de l'EPLS",
    description: "Tous les membres sont invités à participer à notre Assemblée Générale annuelle pour faire le point sur la vie de l'église.",
    type: "reunion"
  },
  {
    id: "formation-evangelisation",
    title: "Formation au partage de la foi",
    date: "2025-04-05",
    time: "14:30 - 17:00",
    location: "Salle paroissiale",
    description: "Session de formation pratique pour apprendre à partager sa foi au quotidien.",
    type: "formation"
  },
  {
    id: "collecte-alimentaire",
    title: "Collecte alimentaire pour les étudiants",
    date: "2025-04-01", // Premier jour du mois pour représenter "tout le mois"
    time: "Tout le mois",
    location: "Temple de l'EPLS",
    description: "Apportez des denrées non périssables pour aider les étudiants en difficulté.",
    type: "solidarite"
  }
]

const events = [
  {
    id: 1,
    title: "Culte dominical",
    date: "2023-06-04",
    time: "10:30",
    location: "Temple de l'EPLS",
    description: "Culte dominical avec Sainte Cène",
    type: "culte"
  },
  {
    id: 2,
    title: "Étude biblique",
    date: "2023-06-07",
    time: "19:00",
    location: "Salle paroissiale",
    description: "Étude du livre des Actes, chapitre 4",
    type: "etude"
  },
  {
    id: 3,
    title: "Catéchisme",
    date: "2023-06-10",
    time: "14:00",
    location: "Salle paroissiale",
    description: "Leçon sur les Sacrements",
    type: "jeunesse"
  },
  {
    id: 4,
    title: "Culte dominical",
    date: "2023-06-11",
    time: "10:30",
    location: "Temple de l'EPLS",
    description: "Culte dominical avec baptême",
    type: "culte"
  },
  {
    id: 5,
    title: "Conseil presbytéral",
    date: "2023-06-13",
    time: "19:30",
    location: "Bureau pastoral",
    description: "Réunion mensuelle du conseil",
    type: "reunion"
  },
  {
    id: 6,
    title: "Groupe de prière",
    date: "2023-06-14",
    time: "18:30",
    location: "Chapelle",
    description: "Intercession pour les besoins de l'église et du monde",
    type: "priere"
  },
  {
    id: 7,
    title: "Culte dominical",
    date: "2023-06-18",
    time: "10:30",
    location: "Temple de l'EPLS",
    description: "Culte dominical avec Sainte Cène",
    type: "culte"
  },
  {
    id: 8,
    title: "Formation des anciens",
    date: "2023-06-21",
    time: "19:00",
    location: "Salle paroissiale",
    description: "Formation sur le leadership serviteur",
    type: "formation"
  },
  {
    id: 9,
    title: "Culte dominical",
    date: "2023-06-25",
    time: "10:30",
    location: "Temple de l'EPLS",
    description: "Culte dominical festif de fin d'année scolaire",
    type: "culte"
  },
  {
    id: 10,
    title: "Repas communautaire",
    date: "2023-06-25",
    time: "12:30",
    location: "Jardin de l'église",
    description: "Repas partagé et temps de communion fraternelle",
    type: "communaute"
  }
]

// Composant pour afficher les détails d'un événement dans une bulle
const EventPreview = ({ event }: { event: typeof events[0] }) => {
  return (
    <div className="space-y-1 max-w-[250px]">
      <div className="font-semibold">{event.title}</div>
      <div className="text-xs flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {event.time}
      </div>
      <div className="text-xs text-muted-foreground flex items-center">
        <MapPin className="h-3 w-3 mr-1" />
        {event.location}
      </div>
    </div>
  );
};

// Cette fonction va chercher un événement par son id
function getEventById(id: number) {
  return events.find(event => event.id === id)
}

// Fonction pour filtrer les événements par mois et année
function getEventsForMonth(year: number, month: number) {
  return events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getFullYear() === year && eventDate.getMonth() === month
  })
}

// Fonction pour obtenir les événements pour un jour donné
function getEventsForDay(year: number, month: number, day: number) {
  return events.filter(event => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === year && 
      eventDate.getMonth() === month && 
      eventDate.getDate() === day
    )
  })
}

// Fonction pour vérifier si une date correspond à aujourd'hui
function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

export default function Calendrier({ searchParams }: { searchParams: { eventId?: string } }) {
  // État pour suivre le mois et l'année actuels
  const [currentDate, setCurrentDate] = useState(() => {
    // Commencer avec le mois de juin 2023 pour correspondre aux données d'exemple
    return new Date(2023, 5, 1) // JavaScript utilise 0-11 pour les mois
  })
  
  // État pour l'affichage du popover sur mobile
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Calculs pour le calendrier
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Dimanche, 1 = Lundi, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  // Formater le nom du mois
  const currentMonthName = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric"
  })
  
  // Événements du mois actuel
  const eventsThisMonth = getEventsForMonth(year, month)
  
  // Jours avec événements pour ce mois
  const daysWithEvents = eventsThisMonth.reduce((acc, event) => {
    const day = new Date(event.date).getDate()
    if (!acc.includes(day)) {
      acc.push(day)
    }
    return acc
  }, [] as number[])

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

  // Vérifier si nous avons un événement spécial sélectionné
  const specialEventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : undefined;
  const selectedSpecialEvent = specialEventId ? 
    specialEvents.find(event => event.id === specialEventId) : 
    null;
  
  // Si un ID d'événement est fourni dans l'URL, trouver cet événement
  const selectedEvent = searchParams.eventId ? 
    (
      // Essayer de convertir en nombre pour les événements réguliers
      !isNaN(Number(searchParams.eventId)) ? 
        getEventById(Number(searchParams.eventId)) : 
        null
    ) : 
    null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Calendrier des événements</h1>
      
      {/* Détails d'un événement spécial sélectionné */}
      {selectedSpecialEvent && (
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{selectedSpecialEvent.title}</h2>
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(selectedSpecialEvent.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}{" "}
                à {selectedSpecialEvent.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedSpecialEvent.location}
              </div>
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/culte/calendrier">
                Retour au calendrier
              </Link>
            </Button>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Description</h3>
            <p>{selectedSpecialEvent.description}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Type d'événement</h3>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {selectedSpecialEvent.type.charAt(0).toUpperCase() + selectedSpecialEvent.type.slice(1)}
            </div>
          </div>
        </Card>
      )}
      
      {/* Détails d'un événement régulier sélectionné */}
      {selectedEvent && (
        <Card className="p-4 mb-8 border-blue-500">
          <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/culte/calendrier">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour au calendrier
              </Link>
            </Button>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
            <div className="flex items-center mb-1">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(selectedEvent.date).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
              à {selectedEvent.time}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {selectedEvent.location}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Description</h3>
            <p>{selectedEvent.description}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Type d'événement</h3>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
            </div>
          </div>
        </Card>
      )}

      {!selectedEvent && !selectedSpecialEvent && (
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
                    asChild
                  >
                    <Link href={hasEvents ? `/culte/calendrier?eventId=${eventsThisMonth.find(e => new Date(e.date).getDate() === day)?.id}` : "#"}>
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
                    </Link>
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
                              <Button variant="link" size="sm" asChild className="text-xs">
                                <Link href={`/culte/calendrier?eventId=${dayEvents[0]?.id}`}>
                                  Voir détails
                                </Link>
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
                  <h3 className="text-lg font-medium mt-6 mb-2 text-primary">Annonces importantes</h3>
                  {specialEvents.map((event) => (
                    <Card key={event.id} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-primary">
                      <Link href={`/culte/calendrier?eventId=${event.id}`} className="block">
                        <div className="flex items-center gap-1.5 text-primary text-sm font-medium mb-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>Annonce importante</span>
                        </div>
                        
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors text-primary">
                          {event.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                            {new Date(event.date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}{" "}
                            {event.time !== "Tout le mois" ? `à ${event.time}` : "- " + event.time}
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            {event.location}
                          </div>
                        </div>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm">{event.description}</p>
                          
                          <Badge variant="default" className="px-2 py-1 rounded-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </>
              )}
              
              {/* Événements réguliers du mois avec un titre de section */}
              {eventsThisMonth.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mt-6 mb-2">Événements de {currentMonthName}</h3>
                  {eventsThisMonth.map((event) => (
                    <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                      <Link href={`/culte/calendrier?eventId=${event.id}`} className="block">
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
                            {event.location}
                          </div>
                        </div>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm">{event.description}</p>
                          
                          <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {event.type}
                          </div>
                        </div>
                      </Link>
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
        </>
      )}
    </div>
  )
} 