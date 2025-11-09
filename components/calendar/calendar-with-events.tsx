"use client";

import { useState } from "react";
import { CalendarGrid, Event as CalendarEvent } from "./calendar-grid";
import { EventList } from "./event-list";
import { isWithinInterval, format, startOfMonth, isSameDay, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarWithEventsProps {
  events: CalendarEvent[];
}

export function CalendarWithEvents({ events }: CalendarWithEventsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Transforme les événements en dates pour le calendrier
  const eventDates = events.map(event => ({
    date: event.date,
    hasEvent: true
  }));

  // Filtre les événements pour le mois sélectionné
  const eventsInMonth = events.filter(event => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    return isWithinInterval(event.date, {
      start: monthStart,
      end: monthEnd
    });
  });

  // Filtre les événements pour le jour sélectionné
  const eventsOnSelectedDay = events.filter(event => {
    return isSameDay(event.date, selectedDate);
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {format(currentMonth, "MMMM yyyy", { locale: fr }).replace(/^\w/, c => c.toUpperCase())}
        </h2>
        <CalendarGrid 
          currentMonth={currentMonth}
          onChangeMonth={setCurrentMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDays={eventDates}
          events={events}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          {eventsOnSelectedDay.length > 0 
            ? `Événements du ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`
            : `Événements pour ${format(currentMonth, "MMMM yyyy", { locale: fr }).replace(/^\w/, c => c.toUpperCase())}`}
        </h2>
        <EventList events={eventsOnSelectedDay.length > 0 ? eventsOnSelectedDay : eventsInMonth} />
      </div>
    </div>
  );
} 