'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Announcement } from '@/types';
import { EventPreviewCard } from './event-preview-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getUpcomingEvents, timestampToDate } from '@/lib/date-helpers';

interface UpcomingEventsSectionProps {
  maxEvents?: number;
}

/**
 * Section des prochains événements
 * Affiche un aperçu des événements à venir
 */
export function UpcomingEventsSection({ maxEvents = 3 }: UpcomingEventsSectionProps) {
  const [events, setEvents] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
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

        // Utiliser le helper pour récupérer les événements à venir
        const upcomingEvents = getUpcomingEvents(fetchedAnnouncements, maxEvents);
        setEvents(upcomingEvents);
        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement événements:', err);
        setLoading(false);
      }
    }

    fetchEvents();
  }, [maxEvents]);

  // Ne rien afficher pendant le chargement ou s'il n'y a pas d'événements
  if (loading || events.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(event => (
        <EventPreviewCard key={event.id} announcement={event} />
      ))}
    </div>
  );
}
