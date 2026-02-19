'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

/**
 * Supprime un message et force le rafraîchissement des pages concernées.
 * Utilise Firebase Admin SDK pour contourner les règles Firestore côté serveur.
 *
 * @param messageId - ID du message à supprimer
 * @returns Résultat de la suppression
 */
export async function deleteMessage(messageId: string) {
  // Guard: Admin SDK must be configured
  if (!adminDb || !adminAuth) {
    return { success: false, error: 'Firebase Admin non configuré' };
  }

  // Step 1: Get auth token from cookie
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) {
    return { success: false, error: 'Non authentifié' };
  }

  // Step 2: Verify token (handles expiry gracefully)
  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return { success: false, error: 'Session expirée, veuillez vous reconnecter' };
  }

  // Step 3: Verify caller is admin (uses unified role field from Plan 01-01)
  const userSnap = await adminDb.collection('users').doc(uid).get();
  if (userSnap.data()?.role !== 'admin') {
    return { success: false, error: 'Permission refusée' };
  }

  // Step 4: Delete message
  try {
    await adminDb.collection('messages').doc(messageId).delete();
    revalidatePath('/messages');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
