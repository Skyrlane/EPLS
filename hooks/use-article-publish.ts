/**
 * Hook pour publier un article et le synchroniser avec Airtable
 */

import { useState } from 'react';
import { Article } from '@/types';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { createPublishedArticle, updatePublishedArticle } from '@/lib/airtable-client';

export function useArticlePublish() {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Publie un article et le synchronise avec Airtable
   */
  const publishArticle = async (
    articleId: string, 
    article: Article,
    scheduledFor?: Date
  ): Promise<void> => {
    try {
      setPublishing(true);
      setError(null);

      const articleRef = doc(firestore, 'articles', articleId);

      // 1. Mettre à jour le statut dans Firestore
      const updateData: any = {
        status: scheduledFor ? 'scheduled' : 'published',
        updatedAt: Timestamp.now(),
      };

      if (scheduledFor) {
        updateData.scheduledFor = Timestamp.fromDate(scheduledFor);
      } else {
        updateData.publishedAt = article.publishedAt || Timestamp.now();
        updateData.scheduledFor = null; // Clear scheduled date if publishing now
      }

      await updateDoc(articleRef, updateData);

      // 2. Si publié maintenant (pas programmé), push vers Airtable
      if (!scheduledFor) {
        await pushToAirtablePublished(articleId, article);
      }
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
      setError(err as Error);
      throw err;
    } finally {
      setPublishing(false);
    }
  };

  /**
   * Dépublie un article (remet en brouillon)
   */
  const unpublishArticle = async (articleId: string): Promise<void> => {
    try {
      setPublishing(true);
      setError(null);

      const articleRef = doc(firestore, 'articles', articleId);

      await updateDoc(articleRef, {
        status: 'draft',
        publishedAt: null,
        scheduledFor: null,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Erreur lors de la dépublication:', err);
      setError(err as Error);
      throw err;
    } finally {
      setPublishing(false);
    }
  };

  /**
   * Met à jour les stats d'un article (vues) dans Airtable
   */
  const syncArticleStats = async (articleId: string, article: Article): Promise<void> => {
    if (!article.airtablePublishedId) return;

    try {
      await updatePublishedArticle(article.airtablePublishedId, {
        views: article.views,
      });
    } catch (err) {
      console.error('Erreur lors de la synchro stats:', err);
      // Ne pas throw, c'est juste une synchro en arrière-plan
    }
  };

  return {
    publishArticle,
    unpublishArticle,
    syncArticleStats,
    publishing,
    error,
  };
}

/**
 * Pousse un article vers la table Airtable "Articles Publiés"
 */
async function pushToAirtablePublished(articleId: string, article: Article): Promise<void> {
  try {
    // Si déjà synchronisé, mettre à jour
    if (article.syncedToAirtable && article.airtablePublishedId) {
      await updatePublishedArticle(article.airtablePublishedId, article);
    } else {
      // Sinon, créer un nouveau record
      const recordId = await createPublishedArticle(article);

      // Mettre à jour Firestore avec l'ID Airtable
      const articleRef = doc(firestore, 'articles', articleId);
      await updateDoc(articleRef, {
        airtablePublishedId: recordId,
        syncedToAirtable: true,
        lastSyncedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Erreur lors du push vers Airtable:', error);
    // Ne pas throw pour ne pas bloquer la publication
    // L'article sera publié même si Airtable échoue
  }
}
