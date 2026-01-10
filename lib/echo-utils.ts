/**
 * Utilitaires pour la gestion des Échos
 */

/**
 * Formate la taille d'un fichier en bytes vers une chaîne lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Retourne le nom du mois en français
 */
export function getMonthName(month: number, locale: string = 'fr'): string {
  const months = {
    fr: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  };
  
  const monthList = locale === 'fr' ? months.fr : months.en;
  return monthList[month - 1] || '';
}

/**
 * Vérifie si un mois/année correspond au mois en cours
 */
export function isCurrentMonth(month: number, year: number): boolean {
  const now = new Date();
  return now.getMonth() + 1 === month && now.getFullYear() === year;
}

/**
 * Génère le titre d'un écho à partir du mois et de l'année
 */
export function generateEchoTitle(month: number, year: number): string {
  return `L'Écho - ${getMonthName(month)} ${year}`;
}

/**
 * Génère la description par défaut d'un écho à partir du mois
 */
export function generateEchoDescription(month: number): string {
  return `Édition de ${getMonthName(month)} avec les dernières nouvelles de l'église.`;
}

/**
 * Génère le nom de fichier pour un PDF d'écho
 */
export function generateEchoPdfFileName(month: number, year: number): string {
  const monthStr = month.toString().padStart(2, '0');
  return `echo-${year}-${monthStr}.pdf`;
}

/**
 * Génère le chemin de stockage pour un écho
 */
export function generateEchoStoragePath(year: number, month: number, fileName: string): string {
  const monthStr = month.toString().padStart(2, '0');
  return `echos/${year}/${monthStr}/${fileName}`;
}

/**
 * Valide qu'un fichier est un PDF
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Valide qu'un fichier est une image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Valide la taille d'un fichier
 */
export function validateFileSize(file: File, maxSizeInMB: number): { valid: boolean; error?: string } {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille maximale : ${maxSizeInMB} MB`
    };
  }
  
  return { valid: true };
}

/**
 * Retourne la liste des années disponibles pour les échos
 */
export function getAvailableYears(startYear: number = 2020): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
}
