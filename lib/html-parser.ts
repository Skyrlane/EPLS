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

  // Pattern pour les mots (avec accents français)
  const wordPattern = '[a-zA-Zà-ÿÀ-Ÿ]+';

  // Pattern 1 : "25 novembre 2025 à 20h15" OU "Mardi 25 novembre 2025 à 20h15"
  const pattern1 = new RegExp(`(?:${wordPattern}\\s+)?(\\d{1,2})\\s+(${wordPattern})\\s+(\\d{4})\\s+à\\s+(\\d{1,2})h(\\d{2})`, 'i');
  const match1 = dateString.match(pattern1);
  if (match1) {
    const [, day, month, year, hour, minute] = match1;
    const monthIndex = months[month.toLowerCase()];
    if (monthIndex !== undefined) {
      return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute));
    }
  }

  // Pattern 2 : "13 décembre 2025 de 11h00 à 18h00" OU "Samedi 13 décembre 2025 de 11h00 à 18h00"
  const pattern2 = new RegExp(`(?:${wordPattern}\\s+)?(\\d{1,2})\\s+(${wordPattern})\\s+(\\d{4})\\s+de\\s+(\\d{1,2})h(\\d{2})`, 'i');
  const match2 = dateString.match(pattern2);
  if (match2) {
    const [, day, month, year, hour, minute] = match2;
    const monthIndex = months[month.toLowerCase()];
    if (monthIndex !== undefined) {
      return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute));
    }
  }

  // Pattern 3 : "28 et Samedi 29 novembre 2025" (plage de dates, on prend la première date)
  const pattern3 = new RegExp(`(\\d{1,2})\\s+et\\s+(?:${wordPattern}\\s+)?(\\d{1,2})\\s+(${wordPattern})\\s+(\\d{4})`, 'i');
  const match3 = dateString.match(pattern3);
  if (match3) {
    const [, day1, day2, month, year] = match3;
    const monthIndex = months[month.toLowerCase()];
    if (monthIndex !== undefined) {
      // Utiliser la première date
      return new Date(parseInt(year), monthIndex, parseInt(day1), 0, 0);
    }
  }

  // Pattern 4 : "30 novembre 2025" OU "Dimanche 30 novembre 2025" (sans heure, par défaut 00h00)
  const pattern4 = new RegExp(`(?:${wordPattern}\\s+)?(\\d{1,2})\\s+(${wordPattern})\\s+(\\d{4})\\s*$`, 'i');
  const match4 = dateString.match(pattern4);
  if (match4) {
    const [, day, month, year] = match4;
    const monthIndex = months[month.toLowerCase()];
    if (monthIndex !== undefined) {
      return new Date(parseInt(year), monthIndex, parseInt(day), 0, 0);
    }
  }

  console.warn(`⚠️ Pattern de date non reconnu : "${dateString}"`);
  return null;
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
  console.log('🔍 === DÉBUT PARSING HTML ===');
  console.log('HTML length:', html.length);
  
  const announcements: ParsedAnnouncement[] = [];

  // Détecter toutes les annonces par leur pattern de date
  const datePattern = /<span[^>]*class="text-info"[^>]*>\s*<strong>([^<]+)<\/strong>\s*<\/span>/gi;
  
  // Trouver toutes les positions de dates
  const dateMatches: Array<{ index: number; dateString: string }> = [];
  let match;
  
  while ((match = datePattern.exec(html)) !== null) {
    dateMatches.push({
      index: match.index,
      dateString: match[1]
    });
  }

  console.log(`📅 ${dateMatches.length} pattern(s) de date détecté(s)`);

  if (dateMatches.length === 0) {
    console.warn('⚠️ Aucun pattern de date trouvé dans le HTML');
    return [];
  }

  // Découper le HTML en blocs basés sur les positions de dates
  for (let i = 0; i < dateMatches.length; i++) {
    const currentMatch = dateMatches[i];
    const nextMatch = dateMatches[i + 1];
    
    // Extraire le bloc entre cette date et la prochaine (ou fin du HTML)
    const startIndex = currentMatch.index;
    const endIndex = nextMatch ? nextMatch.index : html.length;
    const block = html.substring(startIndex, endIndex);

    console.log(`\n📝 Parsing bloc de date ${i + 1}/${dateMatches.length}`);
    console.log('Date string:', currentMatch.dateString);

    try {
      // Parser la date
      const date = parseDate(currentMatch.dateString);
      if (!date) {
        console.warn(`⚠️ Date non parsable : "${currentMatch.dateString}"`);
        continue;
      }

      const time = extractTime(currentMatch.dateString);
      console.log('Date parsée:', date.toLocaleDateString('fr-FR'), time);

      // NOUVEAU : Détecter TOUS les titres dans ce bloc (pour gérer plusieurs événements le même jour)
      const titleRegex = /-\s*<strong>([^<]+)<\/strong>/gi;
      const titleMatches: Array<{ title: string; startIndex: number }> = [];
      let titleMatch;
      
      while ((titleMatch = titleRegex.exec(block)) !== null) {
        titleMatches.push({
          title: titleMatch[1].trim(),
          startIndex: titleMatch.index
        });
      }

      if (titleMatches.length === 0) {
        console.warn('⚠️ Aucun titre trouvé, ignoré');
        continue;
      }

      console.log(`📌 ${titleMatches.length} événement(s) détecté(s) dans ce bloc`);

      // Parser chaque titre comme une annonce séparée
      for (let j = 0; j < titleMatches.length; j++) {
        const titleData = titleMatches[j];
        const title = titleData.title;
        
        console.log(`\n  📌 Événement ${j + 1}/${titleMatches.length}: "${title}"`);

        // Extraire le contexte de ce titre (du titre jusqu'au prochain titre ou fin du bloc)
        const titleStartIndex = titleData.startIndex;
        const nextTitleIndex = titleMatches[j + 1]?.startIndex || block.length;
        const titleContext = block.substring(titleStartIndex, nextTitleIndex);

        // Essayer d'extraire une heure spécifique dans le contexte du titre (ex: "à 10h00")
        const specificTimeMatch = titleContext.match(/à\s+(\d{1,2})h(\d{2})/i);
        let eventTime = time;
        let eventDate = new Date(date);
        
        if (specificTimeMatch) {
          const hour = parseInt(specificTimeMatch[1]);
          const minute = parseInt(specificTimeMatch[2]);
          eventDate.setHours(hour, minute);
          eventTime = `${specificTimeMatch[1]}h${specificTimeMatch[2]}`;
          console.log(`    ⏰ Heure spécifique: ${eventTime}`);
        }

        // Parser le lieu
        let locationName = '';
        let locationAddress = '';

        const locationMatch1 = titleContext.match(/\s+(?:au|à l'|à la|chez)\s+([^(<,]+)(?:\s*\(([^)]+)\)|,\s*([^<.]+))?/i);
        if (locationMatch1) {
          locationName = locationMatch1[1].trim();
          locationAddress = (locationMatch1[2] || locationMatch1[3] || '').trim();
        }

        console.log('    📍 Lieu:', locationName || '(non spécifié)', '|', locationAddress || '(pas d\'adresse)');

        // Extraire les items de la liste <ul> dans le contexte de ce titre
        const ulMatch = titleContext.match(/<ul>[\s\S]*?<\/ul>/i);
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

        console.log('    📋 Détails:', details.length > 0 ? details : '(aucun)');

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

        console.log('    🏷️ Type:', type, '| Tag:', typeConfig.tag);

        announcements.push({
          title,
          date: eventDate,
          time: eventTime,
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

        console.log('    ✅ Annonce ajoutée');
      }
    } catch (error) {
      console.error('❌ Erreur lors du parsing du bloc:', error);
      continue;
    }
  }

  console.log(`\n🎉 === FIN PARSING : ${announcements.length} annonce(s) extraite(s) ===\n`);
  return announcements;
}
