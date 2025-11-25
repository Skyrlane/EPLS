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
  console.log('🔍 === DÉBUT PARSING HTML ===');
  console.log('HTML length:', html.length);
  
  const announcements: ParsedAnnouncement[] = [];

  // NOUVELLE APPROCHE : Détecter toutes les annonces par leur pattern de date
  // Pattern : <span class="text-info"><strong>Date...</strong></span>
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

    console.log(`\n📝 Parsing annonce ${i + 1}/${dateMatches.length}`);
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

      // Extraire le titre (première balise <strong> après le tiret)
      const titleMatch = block.match(/-\s*<strong>([^<]+)<\/strong>/i);
      if (!titleMatch) {
        console.warn('⚠️ Titre non trouvé, ignoré');
        continue;
      }

      const title = titleMatch[1].trim();
      console.log('Titre:', title);

      // Extraire le texte après le titre
      const afterTitle = block.substring(block.indexOf(titleMatch[0]) + titleMatch[0].length);

      // Parser le lieu
      let locationName = '';
      let locationAddress = '';

      // Pattern 1: "au Lieu (Adresse)" ou "au Lieu, Adresse"
      const locationMatch1 = afterTitle.match(/\s+(?:au|à l'|à la|chez)\s+([^(<,]+)(?:\s*\(([^)]+)\)|,\s*([^<.]+))?/i);
      if (locationMatch1) {
        locationName = locationMatch1[1].trim();
        locationAddress = (locationMatch1[2] || locationMatch1[3] || '').trim();
      } else {
        // Pattern 2: "- Lieu, Adresse"
        const locationMatch2 = afterTitle.match(/-\s*([^,<]+),\s*([^<]+)/i);
        if (locationMatch2) {
          locationName = locationMatch2[1].trim();
          locationAddress = locationMatch2[2].trim();
        }
      }

      console.log('Lieu:', locationName, '|', locationAddress);

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

      console.log('Détails:', details);

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

      console.log('Type:', type, '| Tag:', typeConfig.tag);

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

      console.log('✅ Annonce ajoutée');
    } catch (error) {
      console.error('❌ Erreur lors du parsing du bloc:', error);
      continue;
    }
  }

  console.log(`\n🎉 === FIN PARSING : ${announcements.length} annonce(s) extraite(s) ===\n`);
  return announcements;
}
