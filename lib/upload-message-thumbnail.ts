/**
 * Fonction d'upload de miniature personnalisée pour les messages
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Upload une miniature personnalisée pour un message
 * @param messageId - ID du message
 * @param file - Fichier image à uploader
 * @returns URL de téléchargement de l'image uploadée
 */
export async function uploadMessageThumbnail(
  messageId: string,
  file: File
): Promise<string> {
  console.log('📤 Upload miniature personnalisée:', file.name);

  // Validation du type de fichier
  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image');
  }

  // Validation de la taille (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('L\'image est trop grande (max 5MB)');
  }

  // Créer une référence unique dans Firebase Storage
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const storagePath = `messages/thumbnails/${messageId}-${timestamp}.${fileExtension}`;
  const storageRef = ref(storage, storagePath);

  try {
    // Upload du fichier
    console.log('⏳ Upload en cours vers:', storagePath);
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        messageId: messageId,
        uploadedAt: new Date().toISOString(),
      }
    });

    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Miniature uploadée avec succès:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    throw new Error('Erreur lors de l\'upload de la miniature');
  }
}

/**
 * Supprime une miniature personnalisée
 * @param imageUrl - URL complète de l'image à supprimer
 */
export async function deleteMessageThumbnail(imageUrl: string): Promise<void> {
  try {
    // Extraire le chemin depuis l'URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
    
    console.log('🗑️ Suppression de la miniature:', path);
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
    console.log('✅ Miniature supprimée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    // Ne pas lancer d'erreur, car la suppression peut échouer si le fichier n'existe pas
  }
}

/**
 * Compresse une image avant l'upload (optionnel, pour optimiser la taille)
 * @param file - Fichier image original
 * @param maxWidth - Largeur maximale
 * @param maxHeight - Hauteur maximale
 * @param quality - Qualité de compression (0-1)
 * @returns Nouveau fichier compressé
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1280,
  maxHeight: number = 720,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Créer un canvas pour la compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erreur lors de la compression'));
              return;
            }
            
            // Créer un nouveau fichier
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            console.log(`📊 Image compressée: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
}
