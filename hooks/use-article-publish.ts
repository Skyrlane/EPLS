/**
 * Hook pour publier un article et le synchroniser avec Airtable
 */

import { useState } from 'react';
import { Article } from '@/types';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
// Note: updatePublishedArticle importé dynamiquement dans syncArticleStats si besoin

export function useArticlePublish() {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Publie un article et le synchronise avec Airtable via Server Action
   */
  const publishArticle = async (
    articleId: string, 
    article: Article,
    scheduledFor?: Date
  ): Promise<boolean> => {
    console.log('📝 Publication de l\'article...');
    console.log('Article ID:', articleId);
    console.log('Titre:', article.title);
    
    try {
      setPublishing(true);
      setError(null);

      const articleRef = doc(firestore, 'articles', articleId);

      // 1. Mettre à jour Firestore (côté client avec auth utilisateur)
      console.log('📝 Mise à jour Firestore (client)...');
      
      if (scheduledFor) {
        // Si planifié, juste mettre à jour le statut
        await updateDoc(articleRef, {
          status: 'scheduled',
          scheduledFor: Timestamp.fromDate(scheduledFor),
          updatedAt: Timestamp.now(),
        });
        console.log('✅ Article planifié pour', scheduledFor);
        return true;
      }

      // Publication immédiate
      await updateDoc(articleRef, {
        status: 'published',
        isActive: true,
        publishedAt: article.publishedAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      console.log('✅ Article publié dans Firestore');

      // 2. Synchroniser avec Airtable via Server Action
      console.log('🚀 Appel Server Action pour Airtable...');
      
      const { publishArticleAction } = await import('@/app/actions/publish-article');
      
      const result = await publishArticleAction({
        articleId,
        title: article.title,
        author: article.author,
        readingTime: article.readingTime,
        slug: article.slug,
        content: article.content,
        tag: article.tag,
        biblicalReference: article.biblicalReference,
        airtablePublishedId: article.airtablePublishedId // Passer l'ID existant s'il y en a un
      });

      // 3. Mettre à jour Firestore avec l'ID Airtable si succès
      if (result.success && result.airtableRecordId) {
        console.log('✅ Airtable synchronisé, mise à jour Firestore avec ID...');
        await updateDoc(articleRef, {
          airtablePublishedId: result.airtableRecordId,
          syncedToAirtable: true,
          lastSyncedAt: Timestamp.now(),
        });
        console.log('✅ Tout est terminé avec succès !');
        return true;
      } else if (result.success) {
        // Succès mais pas d'ID (ne devrait pas arriver)
        console.log('✅ Publié mais pas d\'ID Airtable');
        return true;
      } else {
        // Erreur Airtable mais article publié quand même
        console.warn('⚠️ Article publié mais erreur Airtable:', result.error);
        return true; // Article publié quand même
      }
    } catch (err) {
      console.error('❌ Erreur lors de la publication:', err);
      setError(err as Error);
      return false;
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
      const { updatePublishedArticle } = await import('@/lib/airtable-client');
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


