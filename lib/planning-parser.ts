/**
 * Parser pour le planning HTML des cultes
 */

export interface PlanningRow {
  date: string;
  presidence: string;
  musique: string;
  predicateur: string;
  groupeEDD: string;
  accueil: string;
  projection: string;
  zoom: string;
  menage: string;
  observations: string;
}

export interface ParsedPlanning {
  title: string;      // "Novembre 2025"
  month: number;      // 11
  year: number;       // 2025
  rows: PlanningRow[];
}

const MONTHS: Record<string, number> = {
  'janvier': 1,
  'février': 2,
  'fevrier': 2,
  'mars': 3,
  'avril': 4,
  'mai': 5,
  'juin': 6,
  'juillet': 7,
  'août': 8,
  'aout': 8,
  'septembre': 9,
  'octobre': 10,
  'novembre': 11,
  'décembre': 12,
  'decembre': 12
};

/**
 * Parse un HTML de planning et extrait les données structurées
 */
export function parseHTMLPlanning(html: string): ParsedPlanning {
  if (typeof window === 'undefined') {
    throw new Error('Cette fonction doit être exécutée côté client');
  }

  // 1. Parser le HTML avec DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // 2. Extraire le titre (mois + année)
  const h1 = doc.querySelector('h1');
  const title = h1?.textContent?.trim() || '';
  
  // Parser "Novembre 2025" → month: 11, year: 2025
  const titleParts = title.split(' ').filter(p => p.trim());
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  
  if (titleParts.length >= 2) {
    const monthName = titleParts[0].toLowerCase().trim();
    const yearStr = titleParts[1].trim();
    
    month = MONTHS[monthName] || month;
    year = parseInt(yearStr) || year;
  }
  
  // 3. Parser le tableau
  const tbody = doc.querySelector('tbody');
  const rows: PlanningRow[] = [];
  
  if (tbody) {
    tbody.querySelectorAll('tr').forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 10) {
        rows.push({
          date: cells[0]?.textContent?.trim() || '',
          presidence: cells[1]?.textContent?.trim() || '',
          musique: cells[2]?.textContent?.trim() || '',
          predicateur: cells[3]?.textContent?.trim() || '',
          groupeEDD: cells[4]?.textContent?.trim() || '',
          accueil: cells[5]?.textContent?.trim() || '',
          projection: cells[6]?.textContent?.trim() || '',
          zoom: cells[7]?.textContent?.trim() || '',
          menage: cells[8]?.textContent?.trim() || '',
          observations: cells[9]?.textContent?.trim() || ''
        });
      }
    });
  }
  
  return { title, month, year, rows };
}

/**
 * Valide un planning parsé
 */
export function validatePlanning(planning: ParsedPlanning): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!planning.title) {
    errors.push('Le titre est manquant');
  }
  
  if (planning.month < 1 || planning.month > 12) {
    errors.push('Le mois est invalide (doit être entre 1 et 12)');
  }
  
  if (planning.year < 2020 || planning.year > 2100) {
    errors.push('L\'année est invalide');
  }
  
  if (planning.rows.length === 0) {
    errors.push('Aucune ligne trouvée dans le planning');
  }
  
  if (planning.rows.length > 31) {
    errors.push('Trop de lignes (maximum 31)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Retourne le nom du mois en français
 */
export function getMonthName(month: number): string {
  const names = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return names[month - 1] || '';
}
