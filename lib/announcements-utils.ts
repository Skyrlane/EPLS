/**
 * 🛠️ Utilitaires pour les annonces
 *
 * Fonctions helper pour la gestion des annonces :
 * - Détection de doublons
 * - Vérification d'expiration
 * - Comparaison de dates
 */

import type { Announcement } from '@/types';
import type { ParsedAnnouncement } from './html-parser';

/**
 * Vérifie si une annonce est expirée
 * Une annonce est expirée si sa date est strictement passée (avant aujourd'hui à minuit)
 * 
 * Règle : Une annonce reste visible le jour même de l'événement,
 * et disparaît à partir du lendemain (J+1)
 */
export function isExpired(date: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Aujourd'hui à 00:00:00

  const eventDate = new Date(date);
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()); // Jour de l'événement à 00:00:00

  // L'annonce est expirée si le jour de l'événement est strictement avant aujourd'hui
  return eventDay < today;
}

/**
 * Vérifie si deux annonces sont des doublons
 *
 * Critères de doublon :
 * - Même titre (insensible à la casse, ignorant les espaces multiples)
 * - Dates à ±1 jour près
 */
export function isDuplicate(
  announcement1: { title: string; date: Date },
  announcement2: { title: string; date: Date }
): boolean {
  // Normaliser les titres (minuscules, espaces normalisés)
  const normalizeTitle = (title: string) =>
    title.toLowerCase().trim().replace(/\s+/g, ' ');

  const title1 = normalizeTitle(announcement1.title);
  const title2 = normalizeTitle(announcement2.title);

  // Titres différents = pas un doublon
  if (title1 !== title2) return false;

  // Comparer les dates (±1 jour)
  const date1 = new Date(announcement1.date);
  const date2 = new Date(announcement2.date);

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= 1;
}

/**
 * Catégorise les nouvelles annonces par rapport aux existantes
 *
 * @returns {
 *   toAdd: Annonces complètement nouvelles
 *   duplicates: Annonces en doublon avec une existante
 *   toUpdate: Annonces à mettre à jour (même titre/date mais contenu différent)
 * }
 */
export function categorizeAnnouncements(
  newAnnouncements: ParsedAnnouncement[],
  existingAnnouncements: Announcement[]
): {
  toAdd: ParsedAnnouncement[];
  duplicates: Array<{ new: ParsedAnnouncement; existing: Announcement }>;
  toUpdate: Array<{ new: ParsedAnnouncement; existing: Announcement }>;
} {
  const toAdd: ParsedAnnouncement[] = [];
  const duplicates: Array<{ new: ParsedAnnouncement; existing: Announcement }> = [];
  const toUpdate: Array<{ new: ParsedAnnouncement; existing: Announcement }> = [];

  for (const newAnnouncement of newAnnouncements) {
    // Chercher un doublon dans les annonces existantes
    const existingDuplicate = existingAnnouncements.find(existing =>
      isDuplicate(newAnnouncement, existing)
    );

    if (existingDuplicate) {
      // Vérifier si le contenu est différent (nécessite mise à jour)
      const contentChanged = hasContentChanged(newAnnouncement, existingDuplicate);

      if (contentChanged) {
        toUpdate.push({ new: newAnnouncement, existing: existingDuplicate });
      } else {
        duplicates.push({ new: newAnnouncement, existing: existingDuplicate });
      }
    } else {
      toAdd.push(newAnnouncement);
    }
  }

  return { toAdd, duplicates, toUpdate };
}

/**
 * Vérifie si le contenu d'une annonce a changé
 */
function hasContentChanged(
  newAnnouncement: ParsedAnnouncement,
  existingAnnouncement: Announcement
): boolean {
  // Comparer les champs clés
  if (newAnnouncement.time !== existingAnnouncement.time) return true;
  if (newAnnouncement.location.name !== existingAnnouncement.location.name) return true;
  if (newAnnouncement.location.address !== existingAnnouncement.location.address) return true;
  if (newAnnouncement.type !== existingAnnouncement.type) return true;

  // Comparer les détails
  const newDetails = newAnnouncement.details || [];
  const existingDetails = existingAnnouncement.details || [];

  if (newDetails.length !== existingDetails.length) return true;
  if (JSON.stringify(newDetails.sort()) !== JSON.stringify(existingDetails.sort())) return true;

  // Comparer les tarifs
  const newPricing = JSON.stringify(newAnnouncement.pricing || {});
  const existingPricing = JSON.stringify(existingAnnouncement.pricing || {});

  if (newPricing !== existingPricing) return true;

  return false;
}

/**
 * Convertit une ParsedAnnouncement en objet prêt pour Firestore
 */
export function convertToFirestoreAnnouncement(
  parsed: ParsedAnnouncement,
  priority: number = 100
): Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'> {
  // Créer l'objet de base avec les champs requis
  const result: any = {
    title: parsed.title,
    date: parsed.date,
    time: parsed.time,
    location: parsed.location,
    type: parsed.type,
    tag: parsed.tag,
    tagColor: parsed.tagColor,
    isPinned: false,
    priority,
    isActive: true,
    status: 'published'
  };

  // Ajouter les champs optionnels seulement s'ils existent et ne sont pas undefined
  if (parsed.content !== undefined) {
    result.content = parsed.content;
  }
  
  if (parsed.details !== undefined && parsed.details !== null) {
    result.details = parsed.details;
  }
  
  if (parsed.pricing !== undefined && parsed.pricing !== null) {
    result.pricing = parsed.pricing;
  }
  
  if (parsed.expiresAt !== undefined) {
    result.expiresAt = parsed.expiresAt;
  }

  return result;
}

/**
 * Filtre les annonces actives (non expirées, isActive = true)
 */
export function filterActiveAnnouncements(announcements: Announcement[]): Announcement[] {
  return announcements.filter(
    announcement => announcement.isActive && !isExpired(announcement.date)
  );
}

/**
 * Filtre les annonces expirées
 */
export function filterExpiredAnnouncements(announcements: Announcement[]): Announcement[] {
  return announcements.filter(announcement => isExpired(announcement.date));
}

/**
 * Trie les annonces par priorité puis par date
 */
export function sortAnnouncements(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort((a, b) => {
    // D'abord par épinglé
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    // Puis par priorité (plus petit = plus haut)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    // Enfin par date (plus proche en premier)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Formatte une date au format "Samedi 15 novembre 2025"
 */
export function formatAnnouncementDate(date: Date): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const d = new Date(date);
  const dayName = days[d.getDay()];
  const day = d.getDate();
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName} ${day} ${monthName} ${year}`;
}
