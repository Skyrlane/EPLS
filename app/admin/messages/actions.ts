'use server';

import { revalidatePath } from 'next/cache';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

/**
 * Supprime un message et force le rafraîchissement des pages concernées
 * 
 * @param messageId - ID du message à supprimer
 * @returns Résultat de la suppression
 */
export async function deleteMessage(messageId: string) {
  try {
    // Supprimer le document Firestore
    await deleteDoc(doc(firestore, 'messages', messageId));
    
    // Forcer le rafraîchissement des pages qui affichent les messages
    revalidatePath('/messages');        // Page liste des messages
    revalidatePath('/');                 // Homepage qui affiche le dernier message
    
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression message:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}
