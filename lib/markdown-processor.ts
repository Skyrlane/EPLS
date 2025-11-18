/**
 * Traitement du Markdown vers HTML sécurisé
 */

import { marked } from 'marked';

// Import conditionnel de DOMPurify pour éviter les problèmes ESM
let DOMPurify: any;
if (typeof window !== 'undefined') {
  // Côté client
  DOMPurify = require('dompurify');
} else {
  // Côté serveur - utiliser une version simple sans jsdom
  const createDOMPurify = require('dompurify');
  const { JSDOM } = require('jsdom');
  const window = new JSDOM('').window;
  DOMPurify = createDOMPurify(window);
}

/**
 * Configure marked avec des options personnalisées
 */
marked.setOptions({
  breaks: true, // Convertit les sauts de ligne en <br>
  gfm: true, // GitHub Flavored Markdown
  headerIds: true, // Ajoute des IDs aux titres
  mangle: false, // Ne modifie pas les adresses email
});

/**
 * Convertit du Markdown en HTML sécurisé
 */
export function markdownToHtml(markdown: string): string {
  // Validation de l'entrée
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Contenu Markdown invalide ou vide');
    return '<p>Contenu vide</p>';
  }
  
  try {
    // Convertir le Markdown en HTML
    const rawHtml = marked(markdown) as string;

    // Sanitize avec DOMPurify
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'del', 'ins', 'mark',
        'a', 'img',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'src', 'alt', 'width', 'height',
        'class', 'id',
        'start', 'type',
      ],
      ALLOW_DATA_ATTR: false,
    });

    return cleanHtml;
    
  } catch (error) {
    console.error('Erreur markdownToHtml:', error);
    // Fallback : retourner le texte avec des <p>
    const fallback = markdown
      .split('\n')
      .map(line => `<p>${line}</p>`)
      .join('');
    return fallback;
  }
}

/**
 * Extrait un extrait de texte brut depuis du Markdown (sans HTML)
 */
export function extractPlainText(markdown: string, maxLength: number = 160): string {
  if (!markdown) return '';

  // Supprimer les titres
  let text = markdown.replace(/^#+\s+/gm, '');
  
  // Supprimer les liens mais garder le texte
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Supprimer les images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  
  // Supprimer le formatage (gras, italique)
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // Supprimer les listes
  text = text.replace(/^[\*\-\+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');
  
  // Supprimer les quotes
  text = text.replace(/^>\s+/gm, '');
  
  // Supprimer le code inline
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Supprimer les blocs de code
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // Supprimer les sauts de ligne multiples
  text = text.replace(/\n\s*\n/g, '\n');
  
  // Trim
  text = text.trim();
  
  // Tronquer si nécessaire
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }
  
  return text;
}

/**
 * Compte le nombre de mots dans du Markdown
 */
export function countWords(markdown: string): number {
  const plainText = extractPlainText(markdown, Infinity);
  const words = plainText.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

/**
 * Ajoute des classes CSS personnalisées au HTML généré
 */
export function addProseStyling(html: string): string {
  // Ajouter la classe 'prose' de Tailwind Typography
  // et personnaliser certains éléments
  
  let styledHtml = html;
  
  // Ajouter target="_blank" et rel="noopener noreferrer" aux liens externes
  styledHtml = styledHtml.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );
  
  // Ajouter loading="lazy" aux images
  styledHtml = styledHtml.replace(
    /<img /g,
    '<img loading="lazy" '
  );
  
  return styledHtml;
}

/**
 * Pipeline complet : Markdown → HTML sécurisé et stylisé
 */
export function processMarkdown(markdown: string): string {
  const html = markdownToHtml(markdown);
  const styledHtml = addProseStyling(html);
  return styledHtml;
}
