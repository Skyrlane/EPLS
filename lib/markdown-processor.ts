/**
 * Traitement du Markdown vers HTML
 * Compatible Vercel serverless (sans jsdom)
 */

import { marked } from 'marked';

// Configuration de marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  pedantic: false,
  smartLists: true,
  smartypants: false
});

/**
 * Convertit du Markdown en HTML
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    console.warn('Contenu Markdown invalide ou vide');
    return '<p>Contenu vide</p>';
  }

  try {
    // Parser Markdown avec marked (pas de sanitization côté serveur)
    const html = marked.parse(markdown) as string;

    return html;

  } catch (error) {
    console.error('Erreur markdownToHtml:', error);

    // Fallback : retourner le texte avec des <br>
    const lines = markdown.split('\n');
    const paragraphs = lines
      .filter(line => line.trim().length > 0)
      .map(line => `<p>${escapeHtml(line)}</p>`)
      .join('');

    return paragraphs || '<p>Erreur de parsing</p>';
  }
}

// Helper pour échapper HTML (sécurité de base)
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
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
 * Pipeline complet : Markdown → HTML stylisé
 */
export function processMarkdown(markdown: string): string {
  const html = markdownToHtml(markdown);
  const styledHtml = addProseStyling(html);
  return styledHtml;
}
