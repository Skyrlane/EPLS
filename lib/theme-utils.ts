/**
 * Utilitaires pour l'application de styles conditionnels selon le thème
 */

import { cn } from "@/lib/utils";

/**
 * Applique des classes différentes selon le thème (clair ou sombre)
 * 
 * @param baseClasses - Classes appliquées dans tous les cas
 * @param lightClasses - Classes appliquées uniquement en mode clair
 * @param darkClasses - Classes appliquées uniquement en mode sombre
 * @returns Une chaîne de caractères avec toutes les classes CSS
 * 
 * @example
 * // En JSX
 * <div className={themeClasses(
 *   "p-4 rounded", // Classes de base
 *   "bg-white text-black", // Classes en mode clair
 *   "bg-gray-900 text-white" // Classes en mode sombre
 * )}>
 *   Contenu adapté au thème
 * </div>
 */
export function themeClasses(
  baseClasses: string,
  lightClasses: string,
  darkClasses: string
): string {
  return cn(
    baseClasses,
    `${lightClasses} dark:${darkClasses}`
  );
}

/**
 * Applique des classes uniquement en mode sombre
 * 
 * @param lightClasses - Classes appliquées en mode clair
 * @param darkClasses - Classes appliquées en mode sombre
 * @returns Une chaîne de caractères avec les classes CSS
 * 
 * @example
 * // En JSX
 * <div className={darkMode("bg-white", "bg-gray-900")}>
 *   Contenu adapté au thème
 * </div>
 */
export function darkMode(lightClasses: string, darkClasses: string): string {
  return `${lightClasses} dark:${darkClasses}`;
} 