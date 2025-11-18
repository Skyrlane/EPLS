/**
 * Utilitaires pour le blog
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Génère un slug URL-friendly depuis un titre
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/--+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

/**
 * Calcule le temps de lecture en minutes (200 mots/minute)
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

/**
 * Télécharge une image depuis une URL et retourne un Blob
 */
export async function downloadImage(url: string): Promise<Blob> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    throw error;
  }
}

/**
 * Optimise une image (redimensionne et convertit en WebP)
 */
export async function optimizeImage(blob: Blob, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      // Calculer les nouvelles dimensions
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Créer un canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Impossible de créer le context 2d'));
        return;
      }

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en WebP
      canvas.toBlob(
        (optimizedBlob) => {
          URL.revokeObjectURL(objectUrl);
          if (optimizedBlob) {
            resolve(optimizedBlob);
          } else {
            reject(new Error('Erreur lors de l\'optimisation'));
          }
        },
        'image/webp',
        0.85 // Qualité 85%
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Erreur lors du chargement de l\'image'));
    };

    img.src = objectUrl;
  });
}

/**
 * Upload une image vers Firebase Storage et retourne les URLs (3 formats)
 */
export async function uploadBlogImage(
  file: Blob,
  fileName: string
): Promise<{
  url: string;
  mobileUrl: string;
  desktopUrl: string;
}> {
  try {
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const baseName = fileName.replace(/\.[^/.]+$/, ''); // Enlève l'extension
    
    // Créer 3 versions de l'image
    const originalBlob = file;
    const mobileBlob = await optimizeImage(file, 800);
    const desktopBlob = await optimizeImage(file, 1200);

    // Upload vers Firebase Storage
    const originalRef = ref(storage, `blog/${baseName}-${timestamp}-original.webp`);
    const mobileRef = ref(storage, `blog/${baseName}-${timestamp}-mobile.webp`);
    const desktopRef = ref(storage, `blog/${baseName}-${timestamp}-desktop.webp`);

    await Promise.all([
      uploadBytes(originalRef, originalBlob),
      uploadBytes(mobileRef, mobileBlob),
      uploadBytes(desktopRef, desktopBlob),
    ]);

    // Récupérer les URLs
    const [url, mobileUrl, desktopUrl] = await Promise.all([
      getDownloadURL(originalRef),
      getDownloadURL(mobileRef),
      getDownloadURL(desktopRef),
    ]);

    return { url, mobileUrl, desktopUrl };
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
}

/**
 * Formatte une date en format français
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate le temps de lecture
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min de lecture';
  return `${minutes} min de lecture`;
}

/**
 * Tags de blog prédéfinis
 */
export const BLOG_TAGS = [
  { label: "À la une", color: "#06B6D4" },
  { label: "Témoignages", color: "#10B981" },
  { label: "Foi", color: "#3B82F6" },
  { label: "Grâce", color: "#A855F7" },
  { label: "Évangile", color: "#EF4444" },
  { label: "Prière", color: "#F59E0B" },
  { label: "Étude biblique", color: "#8B5CF6" },
  { label: "Vie d'Église", color: "#EC4899" },
  { label: "Famille", color: "#14B8A6" },
  { label: "Jeunesse", color: "#F97316" },
  { label: "Louange", color: "#84CC16" },
  { label: "Mission", color: "#0EA5E9" },
  { label: "Spiritualité", color: "#6366F1" },
  { label: "Espérance", color: "#22C55E" },
  { label: "Amour", color: "#EF4444" },
  { label: "Réflexion", color: "#64748B" }
];

/**
 * Récupère la couleur d'un tag
 */
export function getTagColor(tagLabel: string): string {
  const tag = BLOG_TAGS.find(t => t.label === tagLabel);
  return tag?.color || '#64748B';
}
