/**
 * 🔄 Parser HTML → Annonces
 *
 * Convertit le HTML des annonces EPLS en objets structurés
 * Basé sur html-to-firestore-v2.ts
 */

export interface ParsedAnnouncement {
  title: string;
  date: Date;
  time: string;
  location: {
    name: string;
    address: string;
  };
  details?: string[];
  pricing?: {
    free?: string;
    child?: string;
    student?: string;
    adult?: string;
  };
  type: 'concert' | 'culte' | 'spectacle' | 'reunion' | 'formation' | 'autre';
  tag: string;
  tagColor: string;
}

const EVENT_TYPES = {
  concert: { tag: 'Concert', color: '#10B981' },
  culte: { tag: 'Culte', color: '#3B82F6' },
  spectacle: { tag: 'Spectacle', color: '#8B5CF6' },
  reunion: { tag: 'Réunion', color: '#F59E0B' },
  formation: { tag: 'Formation', color: '#6366F1' },
  autre: { tag: 'Événement', color: '#6B7280' }
} as const;

/**
 * Parse une date au format "15 novembre 2025 à 20h00"
 */
function parseDate(dateString: string): Date | null {
  const months: { [key: string]: number } = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
    'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7,
    'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
  };

  const regex = /(\d{1,2})\s+(\w+)\s+(\d{4})\s+à\s+(\d{1,2})h(\d{2})/i;
  const match = dateString.match(regex);

  if (!match) {
    console.warn(`⚠️ Pattern de date non reconnu : "${dateString}"`);
    return null;
  }

  const [, day, month, year, hour, minute] = match;
  const monthIndex = months[month.toLowerCase()];

  if (monthIndex === undefined) {
    console.warn(`⚠️ Mois non reconnu : "${month}"`);
    return null;
  }

  return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute));
}

/**
 * Extrait l'heure au format "20h00"
 */
function extractTime(dateString: string): string {
  const match = dateString.match(/(\d{1,2})h(\d{2})/);
  return match ? `${match[1]}h${match[2]}` : '';
}

/**
 * Détecte automatiquement le type d'événement depuis le titre
 */
function detectEventType(title: string): keyof typeof EVENT_TYPES {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('concert')) return 'concert';
  if (titleLower.includes('culte')) return 'culte';
  if (titleLower.includes('spectacle') || titleLower.includes('théâtre') || titleLower.includes('idégé')) return 'spectacle';
  if (titleLower.includes('réunion') || titleLower.includes('assemblée')) return 'reunion';
  if (titleLower.includes('formation') || titleLower.includes('étude')) return 'formation';

  return 'autre';
}

/**
 * Parse le HTML et retourne un tableau d'annonces structurées
 *
 * Format attendu :
 * ```html
 * <p>
 *   <span class="text-info"><strong>Date à HHhMM</strong></span><br />
 *   - <strong>Titre</strong> au Lieu (Adresse)
 *   <ul>
 *     <li>Détail 1</li>
 *     <li>Détail 2</li>
 *   </ul>
 * </p>
 * <hr />
 * ```
 */
export function parseAnnouncementsHTML(html: string): ParsedAnnouncement[] {
  const announcements: ParsedAnnouncement[] = [];

  // Séparer par <hr /> ou par paragraphes
  const blocks = html.split(/<hr\s*\/?>/i);

  for (const block of blocks) {
    if (!block.trim()) continue;

    try {
      // Extraire la date (entre <strong> dans <span class="text-info">)
      const dateMatch = block.match(/<span[^>]*class="text-info"[^>]*><strong>([^<]+)<\/strong><\/span>/i);
      if (!dateMatch) {
        console.warn('⚠️ Bloc sans date détectée, ignoré');
        continue;
      }

      const dateString = dateMatch[1];
      const date = parseDate(dateString);
      if (!date) continue;

      const time = extractTime(dateString);

      // Extraire le titre (première balise <strong> après le tiret)
      const titleMatch = block.match(/-\s*<strong>([^<]+)<\/strong>/i);
      if (!titleMatch) {
        console.warn('⚠️ Bloc sans titre détecté, ignoré');
        continue;
      }

      const title = titleMatch[1].trim();

      // Extraire le texte après le titre
      const afterTitle = block.substring(block.indexOf(titleMatch[0]) + titleMatch[0].length);

      // Parser le lieu
      let locationName = '';
      let locationAddress = '';

      // Pattern 1: "au Lieu (Adresse)"
      const locationMatch1 = afterTitle.match(/\s+au\s+([^(]+)\s*\(([^)]+)\)/i);
      if (locationMatch1) {
        locationName = locationMatch1[1].trim();
        locationAddress = locationMatch1[2].trim();
      } else {
        // Pattern 2: "- Lieu, Adresse"
        const locationMatch2 = afterTitle.match(/-\s*([^,<]+),\s*([^<]+)/i);
        if (locationMatch2) {
          locationName = locationMatch2[1].trim();
          locationAddress = locationMatch2[2].trim();
        }
      }

      // Extraire les items de la liste <ul>
      const ulMatch = block.match(/<ul>[\s\S]*?<\/ul>/i);
      const details: string[] = [];

      if (ulMatch) {
        const ulContent = ulMatch[0];
        const liRegex = /<li[^>]*>([^<]+)<\/li>/gi;
        let liMatch;
        while ((liMatch = liRegex.exec(ulContent)) !== null) {
          const text = liMatch[1].trim();
          if (text && !text.toLowerCase().includes('billetterie') && text !== ':') {
            details.push(text);
          }
        }
      }

      // Parser la tarification
      const pricing: ParsedAnnouncement['pricing'] = {};
      let hasPricing = false;
      const filteredDetails: string[] = [];

      for (const detail of details) {
        const detailLower = detail.toLowerCase();

        if (detailLower.includes('gratuit jusqu') || detailLower.includes('entrée libre')) {
          pricing.free = detail;
          hasPricing = true;
        } else if (detailLower.match(/^\d+-\d+\s*ans/)) {
          pricing.child = detail;
          hasPricing = true;
        } else if (detailLower.includes('étudiant')) {
          pricing.student = detail;
          hasPricing = true;
        } else if (detailLower.includes('adulte')) {
          pricing.adult = detail;
          hasPricing = true;
        } else {
          filteredDetails.push(detail);
        }
      }

      // Détecter le type
      const type = detectEventType(title);
      const typeConfig = EVENT_TYPES[type];

      announcements.push({
        title,
        date,
        time,
        location: {
          name: locationName || 'À définir',
          address: locationAddress || ''
        },
        details: filteredDetails.length > 0 ? filteredDetails : undefined,
        pricing: hasPricing ? pricing : undefined,
        type,
        tag: typeConfig.tag,
        tagColor: typeConfig.color
      });
    } catch (error) {
      console.error('❌ Erreur lors du parsing d\'un bloc:', error);
      continue;
    }
  }

  return announcements;
}
