import type { Announcement } from '@/types';

/**
 * Formate une date d'événement en français
 * @param date - Date à formater
 * @param includeTime - Inclure l'heure dans le format (optionnel)
 * @returns Date formatée (ex: "samedi 15 novembre 2025 à 20h00")
 */
export function formatEventDate(date: Date, time?: string): string {
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (time) {
    return `${formattedDate} à ${time}`;
  }

  return formattedDate;
}

/**
 * Vérifie si un événement est expiré
 * @param date - Date de l'événement
 * @returns true si l'événement est passé
 */
export function isEventExpired(date: Date): boolean {
  const now = new Date();
  // Considère qu'un événement est expiré s'il est passé de plus de 24h
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return date < oneDayAgo;
}

/**
 * Récupère les événements à venir
 * @param announcements - Liste des annonces
 * @param limit - Nombre d'événements à retourner
 * @returns Liste des prochains événements, triés par date
 */
export function getUpcomingEvents(
  announcements: Announcement[],
  limit: number = 3
): Announcement[] {
  const now = new Date();

  return announcements
    .filter(announcement => {
      // Filtrer les annonces actives et publiées
      if (!announcement.isActive || announcement.status !== 'published') {
        return false;
      }

      // Filtrer les événements futurs (ou dans les 24h passées)
      const eventDate = announcement.date instanceof Date
        ? announcement.date
        : new Date(announcement.date);

      return !isEventExpired(eventDate);
    })
    .sort((a, b) => {
      // Trier par priorité (asc) puis par date (asc)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, limit);
}

/**
 * Formate une date courte (ex: "15 nov. 2025")
 * @param date - Date à formater
 * @returns Date formatée courte
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formate uniquement le jour et le mois (ex: "15 novembre")
 * @param date - Date à formater
 * @returns Jour et mois formatés
 */
export function formatDayMonth(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  });
}

/**
 * Vérifie si une date est aujourd'hui
 * @param date - Date à vérifier
 * @returns true si c'est aujourd'hui
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Vérifie si une date est demain
 * @param date - Date à vérifier
 * @returns true si c'est demain
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Récupère un label relatif pour une date (ex: "Aujourd'hui", "Demain", ou la date formatée)
 * @param date - Date à formatter
 * @returns Label relatif ou date formatée
 */
export function getRelativeDateLabel(date: Date): string {
  if (isToday(date)) {
    return 'Aujourd\'hui';
  }
  if (isTomorrow(date)) {
    return 'Demain';
  }
  return formatDayMonth(date);
}

/**
 * Convertit un Timestamp Firestore en Date JavaScript
 * @param timestamp - Timestamp Firestore
 * @returns Date JavaScript
 */
export function timestampToDate(timestamp: any): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Si c'est un Timestamp Firestore
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }

  // Si c'est un objet avec seconds et nanoseconds
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }

  // Sinon, essayer de parser comme string
  return new Date(timestamp);
}
