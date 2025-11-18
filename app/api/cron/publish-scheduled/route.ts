/**
 * Route API Cron pour publier automatiquement les articles programmés
 * À appeler toutes les heures via Vercel Cron ou un service externe
 */

import { NextRequest, NextResponse } from 'next/server';

// Marquer comme route dynamique (pas de pre-rendering statique)
export const dynamic = 'force-dynamic';
import { collection, getDocs, query, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { createPublishedArticle } from '@/lib/airtable-client';
import { Article } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Vérifier le token de sécurité
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer les articles programmés dont la date est passée
    const now = Timestamp.now();
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'scheduled'),
      where('scheduledFor', '<=', now)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'Aucun article à publier',
        count: 0,
      });
    }

    const publishedArticles: string[] = [];

    // Publier chaque article
    for (const docSnap of snapshot.docs) {
      const articleId = docSnap.id;
      const articleData = docSnap.data();

      try {
        // 1. Mettre à jour le statut dans Firestore
        const articleRef = doc(firestore, 'articles', articleId);
        await updateDoc(articleRef, {
          status: 'published',
          publishedAt: Timestamp.now(),
          scheduledFor: null,
          updatedAt: Timestamp.now(),
        });

        // 2. Pusher vers Airtable "Articles Publiés"
        const article: Article = {
          id: articleId,
          ...articleData,
          status: 'published',
          publishedAt: new Date(),
        } as Article;

        await pushToAirtable(articleId, article);

        publishedArticles.push(articleData.title || articleId);
      } catch (error) {
        console.error(`Erreur lors de la publication de ${articleId}:`, error);
        // Continuer avec les autres articles même en cas d'erreur
      }
    }

    return NextResponse.json({
      success: true,
      message: `${publishedArticles.length} article(s) publié(s)`,
      count: publishedArticles.length,
      articles: publishedArticles,
    });
  } catch (error) {
    console.error('Erreur dans le cron:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Helper pour pusher vers Airtable
async function pushToAirtable(articleId: string, article: Article): Promise<void> {
  try {
    // Si déjà synchronisé, pas besoin de recréer
    if (article.syncedToAirtable && article.airtablePublishedId) {
      return;
    }

    // Créer le record dans Airtable
    const recordId = await createPublishedArticle(article);

    // Mettre à jour Firestore avec l'ID Airtable
    const articleRef = doc(firestore, 'articles', articleId);
    await updateDoc(articleRef, {
      airtablePublishedId: recordId,
      syncedToAirtable: true,
      lastSyncedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Erreur push Airtable:', error);
    // Ne pas throw pour ne pas bloquer la publication
  }
}
