/**
 * Utilitaires pour vérifier le contraste selon les standards WCAG
 * 
 * Les normes WCAG exigent:
 * - Ratio de 4.5:1 minimum pour le texte normal (WCAG AA)
 * - Ratio de 3:1 minimum pour les grands textes et composants d'interface (WCAG AA)
 * - Ratio de 7:1 minimum pour le texte normal (WCAG AAA)
 * - Ratio de 4.5:1 minimum pour les grands textes (WCAG AAA)
 */

/**
 * Convertit une couleur hexadécimale en valeurs RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Supprime le # si présent
  hex = hex.replace(/^#/, '');
  
  // Gère les formats raccourcis (par exemple #FFF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Convertit hex en RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Calcule la luminance relative d'une couleur RGB
 * selon la formule du WCAG
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  // Normalise les valeurs RGB (0-255) en valeurs entre 0 et 1
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Applique la correction gamma
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calcule la luminance selon les coefficients WCAG
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calcule le ratio de contraste entre deux couleurs
 * selon la formule du WCAG
 */
export function calculateContrastRatio(
  foreground: string, 
  background: string
): number {
  // Convertit les couleurs hex en RGB
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  // Calcule les luminances
  const fgLuminance = calculateLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = calculateLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // Détermine la luminance la plus claire et la plus sombre
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  // Calcule le ratio de contraste
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Évalue si un ratio de contraste respecte les standards WCAG
 */
export function evaluateContrast(
  ratio: number, 
  isLargeText: boolean = false
): {
  aa: boolean;
  aaa: boolean;
  level: 'fail' | 'AA' | 'AAA';
} {
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;
  
  const aa = ratio >= aaThreshold;
  const aaa = ratio >= aaaThreshold;
  
  let level: 'fail' | 'AA' | 'AAA' = 'fail';
  if (aaa) level = 'AAA';
  else if (aa) level = 'AA';
  
  return { aa, aaa, level };
}

/**
 * Vérifie le contraste entre deux couleurs et retourne un résultat formaté
 */
export function checkContrast(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): {
  ratio: number;
  passes: {
    aa: boolean;
    aaa: boolean;
  };
  level: 'fail' | 'AA' | 'AAA';
  formattedRatio: string;
} {
  const ratio = calculateContrastRatio(foreground, background);
  const { aa, aaa, level } = evaluateContrast(ratio, isLargeText);
  
  return {
    ratio,
    passes: { aa, aaa },
    level,
    formattedRatio: ratio.toFixed(2) + ':1'
  };
}

/**
 * Exemples d'utilisation:
 * 
 * // Vérifier le contraste pour du texte normal
 * const result = checkContrast('#FFFFFF', '#121212');
 * console.log(`Ratio: ${result.formattedRatio}, Niveau WCAG: ${result.level}`);
 * 
 * // Vérifier le contraste pour du grand texte
 * const largeTextResult = checkContrast('#FFFFFF', '#767676', true);
 * console.log(`Grand texte - Ratio: ${largeTextResult.formattedRatio}, Niveau WCAG: ${largeTextResult.level}`);
 */ 