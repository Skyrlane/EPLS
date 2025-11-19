/**
 * Client Airtable pour la gestion des articles de blog
 */

import type { AirtableArticle, Article } from '@/types';

const AIRTABLE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY || '',
  baseId: "appSR5QciyUJsgoht",
  tables: {
    source: {
      id: "tblBuFhvKR0W9D27R",
      name: "Articles Rédigés",
      columns: {
        titre: "Titre",
        contenu: "Contenu (Markdown)",
        resume: "Résumé/Extrait",
        imageUrl: "URL Image Générée",
        dateRedaction: "Date de Rédaction",
        passageBiblique: "Passage Biblique"
      }
    },
    published: {
      id: "tbl5gJPpg0Z6s6By0",
      name: "Articles Publiés",
      columns: {
        titre: "Titre",
        url: "URL",
        contenu: "Contenu Complet",
        theme: "Thème Théologique",
        passage: "Passage Biblique",
        datePublication: "Date de Publication",
        idFirestore: "ID Firestore",
        auteur: "Auteur",
        tempsLecture: "Temps de Lecture"
      }
    }
  }
};

/**
 * Récupère les articles non importés depuis Airtable "Articles Rédigés"
 */
export async function getUnimportedArticles(): Promise<AirtableArticle[]> {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables.source.id}`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.statusText}`);
    }

    const data = await response.json();

    // Transformer les records Airtable en AirtableArticle
    const articles: AirtableArticle[] = data.records.map((record: any) => ({
      id: record.id,
      titre: record.fields[AIRTABLE_CONFIG.tables.source.columns.titre] || '',
      contenu: record.fields[AIRTABLE_CONFIG.tables.source.columns.contenu] || '',
      resume: record.fields[AIRTABLE_CONFIG.tables.source.columns.resume] || '',
      imageUrl: record.fields[AIRTABLE_CONFIG.tables.source.columns.imageUrl] || '',
      dateRedaction: record.fields[AIRTABLE_CONFIG.tables.source.columns.dateRedaction] || new Date().toISOString(),
      biblicalReference: record.fields[AIRTABLE_CONFIG.tables.source.columns.passageBiblique] || '',
    }));

    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles Airtable:', error);
    throw error;
  }
}

/**
 * Crée un record dans Airtable "Articles Publiés"
 */
export async function createPublishedArticle(article: Article): Promise<string> {
  try {
    const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://epls.fr'}/blog/${article.slug}`;

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables.published.id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            [AIRTABLE_CONFIG.tables.published.columns.titre]: article.title,
            [AIRTABLE_CONFIG.tables.published.columns.url]: articleUrl,
            [AIRTABLE_CONFIG.tables.published.columns.contenu]: article.content,
            [AIRTABLE_CONFIG.tables.published.columns.theme]: article.tag,
            [AIRTABLE_CONFIG.tables.published.columns.passage]: article.biblicalReference || '',
            [AIRTABLE_CONFIG.tables.published.columns.datePublication]: article.publishedAt?.toISOString() || new Date().toISOString(),
            [AIRTABLE_CONFIG.tables.published.columns.idFirestore]: article.id,
            [AIRTABLE_CONFIG.tables.published.columns.auteur]: article.author,
            [AIRTABLE_CONFIG.tables.published.columns.tempsLecture]: article.readingTime,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id; // Retourne l'ID du record créé
  } catch (error) {
    console.error('Erreur lors de la création du record Airtable:', error);
    throw error;
  }
}

/**
 * Met à jour un record dans Airtable "Articles Publiés"
 */
export async function updatePublishedArticle(recordId: string, updates: Partial<Article>): Promise<void> {
  try {
    const fields: any = {};

    if (updates.title) fields[AIRTABLE_CONFIG.tables.published.columns.titre] = updates.title;
    if (updates.slug) {
      const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://epls.fr'}/blog/${updates.slug}`;
      fields[AIRTABLE_CONFIG.tables.published.columns.url] = articleUrl;
    }
    if (updates.content) fields[AIRTABLE_CONFIG.tables.published.columns.contenu] = updates.content;
    if (updates.tag) fields[AIRTABLE_CONFIG.tables.published.columns.theme] = updates.tag;
    if (updates.biblicalReference !== undefined) fields[AIRTABLE_CONFIG.tables.published.columns.passage] = updates.biblicalReference;
    if (updates.publishedAt) fields[AIRTABLE_CONFIG.tables.published.columns.datePublication] = updates.publishedAt.toISOString();
    if (updates.author) fields[AIRTABLE_CONFIG.tables.published.columns.auteur] = updates.author;
    if (updates.readingTime !== undefined) fields[AIRTABLE_CONFIG.tables.published.columns.tempsLecture] = updates.readingTime;

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables.published.id}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du record Airtable:', error);
    throw error;
  }
}

/**
 * Supprime un record dans Airtable "Articles Publiés"
 */
export async function deletePublishedArticle(recordId: string): Promise<void> {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tables.published.id}/${recordId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du record Airtable:', error);
    throw error;
  }
}

/**
 * Interface pour les données d'article à publier vers Airtable
 */
// Note: pushArticleToAirtable supprimé - maintenant géré par Server Action dans app/actions/publish-article.ts
