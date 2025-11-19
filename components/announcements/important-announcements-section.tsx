'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs, orderBy as firestoreOrderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Announcement } from '@/types';
import { AnnouncementCard } from './announcement-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BellIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { timestampToDate } from '@/lib/date-helpers';

interface ImportantAnnouncementsSectionProps {
  className?: string;
  maxAnnouncements?: number;
}

/**
 * Section des annonces importantes récupérées depuis Firebase
 * Affiche les annonces actives et publiées, triées par priorité et date
 */
export function ImportantAnnouncementsSection({
  className,
  maxAnnouncements = 3
}: ImportantAnnouncementsSectionProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        if (!firestore) {
          throw new Error('Firebase non configuré');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const announcementsRef = collection(firestore, 'announcements');
        const q = query(
          announcementsRef,
          where('status', '==', 'published'),
          where('isActive', '==', true)
        );

        const snapshot = await getDocs(q);

        const fetchedAnnouncements = snapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Convertir les Timestamps Firebase en Date
              date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
              expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : data.expiresAt ? new Date(data.expiresAt) : undefined,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
            } as Announcement;
          })
          // Filtrer les événements non expirés
          .filter(announcement => {
            const eventDate = timestampToDate(announcement.date);
            const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
            return eventDay >= today; // Garder seulement aujourd'hui et futures
          })
          // Trier par priorité puis par date
          .sort((a, b) => {
            // D'abord par isPinned (épinglés en premier)
            if (a.isPinned !== b.isPinned) {
              return a.isPinned ? -1 : 1;
            }

            // Puis par priorité (plus petit = plus haut)
            if (a.priority !== b.priority) {
              return a.priority - b.priority;
            }

            // Enfin par date (plus proche en premier)
            const dateA = timestampToDate(a.date);
            const dateB = timestampToDate(b.date);
            return dateA.getTime() - dateB.getTime();
          });

        setAnnouncements(fetchedAnnouncements.slice(0, maxAnnouncements));
        setLoading(false);
      } catch (err: any) {
        console.error('Erreur chargement annonces:', err);
        setError(err?.message || 'Erreur inconnue');
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, [maxAnnouncements]);

  // Loading
  if (loading) {
    return (
      <div className={cn('w-full rounded-lg bg-muted/30 dark:bg-muted/10 backdrop-blur-sm p-6', className)}>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <BellIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Annonces importantes</h2>
            <p className="text-sm text-muted-foreground mt-1">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Erreur ou pas d'annonces
  if (error || announcements.length === 0) {
    // Ne rien afficher en cas d'erreur ou si pas d'annonces
    return null;
  }

  return (
    <div className={cn('w-full rounded-lg bg-muted/30 dark:bg-muted/10 backdrop-blur-sm p-6', className)}>
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
          <BellIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Annonces importantes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Restez informé des actualités et événements clés de notre église
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map(announcement => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
        <Button variant="outline" asChild className="group">
          <Link href="/culte/calendrier" className="flex items-center">
            <span>Voir tous les événements</span>
            <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
