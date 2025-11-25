/**
 * Utilitaires pour le traitement d'images côté client
 * Redimensionnement, compression, conversion WebP
 */

export interface ImageDimensions {
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export interface ResizedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

/**
 * Charge une image depuis un File et retourne un HTMLImageElement
 */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      console.log('  ✅ Image chargée:', `${img.width}x${img.height}`);
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (error) => {
      console.error('  ❌ Échec chargement image:', error);
      URL.revokeObjectURL(url);
      reject(new Error(`Impossible de charger l'image (format corrompu ?)`));
    };

    img.src = url;
  });
}

/**
 * Détermine l'orientation d'une image
 */
export function getOrientation(width: number, height: number): 'landscape' | 'portrait' | 'square' {
  const ratio = width / height;
  
  if (Math.abs(ratio - 1) < 0.1) {
    return 'square';
  }
  
  return ratio > 1 ? 'landscape' : 'portrait';
}

/**
 * Calcule les nouvelles dimensions en respectant le ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight?: number
): { width: number; height: number } {
  const ratio = originalWidth / originalHeight;
  
  let width = originalWidth;
  let height = originalHeight;
  
  // Redimensionner si > maxWidth
  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }
  
  // Redimensionner si > maxHeight (optionnel)
  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height)
  };
}

/**
 * Redimensionne une image et la convertit en WebP
 */
export async function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight?: number,
  quality: number = 0.85
): Promise<ResizedImage> {
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    maxWidth,
    maxHeight
  );

  // Créer un canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('  ❌ Échec création contexte Canvas 2D');
    throw new Error('Impossible de créer le contexte canvas (problème navigateur ?)');
  }

  // Dessiner l'image redimensionnée
  ctx.drawImage(img, 0, 0, width, height);

  // Convertir en WebP
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log(`  ✅ Blob WebP créé: ${(blob.size / 1024).toFixed(0)} KB`);
          resolve(blob);
        } else {
          console.error('  ❌ Échec création blob WebP');
          reject(new Error('Impossible de créer le blob WebP (navigateur non compatible ?)'));
        }
      },
      'image/webp',
      quality
    );
  });

  const url = URL.createObjectURL(blob);

  return { blob, url, width, height };
}

/**
 * Génère les 3 versions d'une image (original, medium, thumbnail)
 */
export async function generateImageVersions(file: File): Promise<{
  original: ResizedImage;
  medium: ResizedImage;
  thumbnail: ResizedImage;
  originalDimensions: ImageDimensions;
}> {
  console.log('🖼️ Génération des versions d\'image pour:', file.name);

  // Charger l'image
  const img = await loadImage(file);
  
  const originalDimensions: ImageDimensions = {
    width: img.width,
    height: img.height,
    orientation: getOrientation(img.width, img.height)
  };

  console.log('📐 Dimensions originales:', originalDimensions);

  // Générer les 3 versions
  const [original, medium, thumbnail] = await Promise.all([
    // Version originale (max 1920px)
    resizeImage(img, 1920, undefined, 0.90),
    
    // Version moyenne (max 800px)
    resizeImage(img, 800, undefined, 0.85),
    
    // Miniature (max 300px)
    resizeImage(img, 300, undefined, 0.80)
  ]);

  console.log('✅ Versions générées:');
  console.log('  - Original:', `${original.width}x${original.height}`, `${(original.blob.size / 1024).toFixed(0)} KB`);
  console.log('  - Medium:', `${medium.width}x${medium.height}`, `${(medium.blob.size / 1024).toFixed(0)} KB`);
  console.log('  - Thumbnail:', `${thumbnail.width}x${thumbnail.height}`, `${(thumbnail.blob.size / 1024).toFixed(0)} KB`);

  return {
    original,
    medium,
    thumbnail,
    originalDimensions
  };
}

/**
 * Valide qu'un fichier est une image acceptée
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type MIME
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WebP.'
    };
  }

  // Vérifier la taille (max 10 MB)
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Fichier trop volumineux. Taille maximum : 10 MB.'
    };
  }

  return { valid: true };
}

/**
 * Nettoie les URL d'objets créés
 */
export function revokeObjectURLs(...urls: string[]) {
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}
