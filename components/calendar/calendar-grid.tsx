"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  addDays,
  isToday
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Event = {
  id?: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
};

type MarkedDay = {
  date: Date;
  hasEvent: boolean;
  events?: Event[];
};

export interface CalendarGridProps {
  currentMonth: Date;
  onChangeMonth: (date: Date) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markedDays?: MarkedDay[];
  events: Event[];
}

export function CalendarGrid({
  currentMonth,
  onChangeMonth,
  selectedDate,
  onSelectDate,
  markedDays = [],
  events = []
}: CalendarGridProps) {
  // Jours de la semaine en français
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  // État pour l'affichage du popover sur mobile
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChangeMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy", { locale: fr }).replace(/^\w/, c => c.toUpperCase())}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChangeMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour obtenir les événements d'un jour spécifique
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  // Composant pour afficher les événements dans le tooltip
  const EventPreview = ({ events }: { events: Event[] }) => {
    if (events.length === 0) return null;
    
    return (
      <div className="space-y-2 max-w-[250px]">
        {events.map((event, index) => (
          <div key={event.id || index} className={cn("text-left", index > 0 && "pt-2 border-t")}>
            <div className="font-semibold">{event.title}</div>
            {event.time && <div className="text-xs">{event.time}</div>}
            {event.location && <div className="text-xs text-muted-foreground">{event.location}</div>}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelectedDay = isSameDay(day, selectedDate);
        const isCurrentDay = isToday(day);
        const eventsForDay = getEventsForDay(day);
        const hasEvent = eventsForDay.length > 0;
        const dayId = format(day, "yyyy-MM-dd");

        // Détermine si le jour est marqué comme ayant un événement
        const isMarkedDay = markedDays.some(markedDay => 
          isSameDay(markedDay.date, day) && markedDay.hasEvent
        );

        const dayContent = (
          <Button
            variant="ghost"
            className={cn(
              "h-10 w-full rounded-md p-0 font-normal relative",
              !isCurrentMonth && "text-muted-foreground opacity-50",
              isSelectedDay && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isCurrentDay && !isSelectedDay && "border border-primary text-primary",
              (hasEvent || isMarkedDay) && !isSelectedDay && "ring-1 ring-blue-400 dark:ring-blue-600",
              (hasEvent || isMarkedDay) && "hover:bg-blue-50 dark:hover:bg-blue-900/50"
            )}
            onClick={() => {
              onSelectDate(day);
              setOpenPopover(null);
            }}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{formattedDate}</time>
            {(hasEvent || isMarkedDay) && (
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2" />
            )}
          </Button>
        );

        // Utiliser Tooltip pour desktop et Popover pour mobile
        if (hasEvent) {
          days.push(
            <div key={dayId} className="relative">
              {/* Tooltip pour écrans plus grands */}
              <div className="hidden sm:block">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {dayContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-50 max-w-xs">
                      <EventPreview events={eventsForDay} />
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
                    <div className="font-medium text-sm mb-1.5">
                      {format(day, "d MMMM yyyy", { locale: fr })}
                    </div>
                    <EventPreview events={eventsForDay} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          );
        } else {
          days.push(
            <div key={dayId}>
              {dayContent}
            </div>
          );
        }
        
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
} 