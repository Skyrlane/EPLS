import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { collection, query, where, getDocs, limit, doc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Article } from '@/types';
import { markdownToHtml } from '@/lib/markdown-processor';
import { BlogArticleHeader } from '@/components/blog/BlogArticleHeader';
import Link from 'next/link';

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache 5 minutes

interface PageProps {
  params: { slug: string };
}

// Fonction séparée pour incrémenter les vues
async function incrementViews(articleId: string) {
  try {
    const docRef = doc(firestore, 'articles', articleId);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Erreur increment views:', error);
  }
}

// Metadata pour SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('slug', '==', params.slug),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        title: 'Article non trouvé - EPLS',
        description: "L'article que vous recherchez n'existe pas ou a été déplacé.",
      };
    }

    const article = snapshot.docs[0].data() as Article;

    return {
      title: `${article.title} - Blog EPLS`,
      description: article.metaDescription || article.excerpt,
      openGraph: {
        title: article.title,
        description: article.metaDescription || article.excerpt,
        type: 'article',
        images: article.coverImageUrl ? [article.coverImageUrl] : [],
        publishedTime: article.publishedAt?.toISOString(),
        authors: [article.author],
        tags: [article.tag],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.metaDescription || article.excerpt,
        images: article.coverImageUrl ? [article.coverImageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Erreur generateMetadata:', error);
    return {
      title: 'Article - EPLS'
    };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  try {
    console.log('Loading article with slug:', params.slug);

    // Récupérer l'article
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('slug', '==', params.slug),
      where('status', '==', 'published'),
      where('isActive', '==', true),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('Article not found:', params.slug);
      notFound();
    }

    const docData = snapshot.docs[0];
    const data = docData.data();
    const article: Article = {
      id: docData.id,
      title: data.title || '',
      slug: data.slug || '',
      content: data.content || '',
      excerpt: data.excerpt || '',
      metaDescription: data.metaDescription || '',
      coverImageUrl: data.coverImageUrl || '',
      coverImageMobile: data.coverImageMobile,
      coverImageDesktop: data.coverImageDesktop,
      author: data.author || '',
      tag: data.tag || '',
      biblicalReference: data.biblicalReference,
      readingTime: data.readingTime || 0,
      status: data.status || 'draft',
      scheduledFor: data.scheduledFor?.toDate(),
      publishedAt: data.publishedAt?.toDate(),
      isActive: data.isActive ?? true,
      airtableSourceId: data.airtableSourceId,
      airtablePublishedId: data.airtablePublishedId,
      syncedToAirtable: data.syncedToAirtable ?? false,
      lastSyncedAt: data.lastSyncedAt?.toDate(),
      views: data.views || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };

    console.log('Article loaded:', article.title);

    // CRITIQUE : Vérifications des champs requis
    if (!article.content) {
      console.error('Article sans contenu:', article.id);
      throw new Error('Article sans contenu');
    }

    // Parser Markdown avec gestion d'erreur
    let htmlContent = '';
    try {
      console.log('Parsing Markdown...');
      htmlContent = markdownToHtml(article.content);
      console.log('Markdown parsed successfully');
    } catch (error) {
      console.error('Erreur parsing Markdown:', error);
      // Fallback : afficher le contenu brut avec retours à la ligne
      htmlContent = `<div class="whitespace-pre-wrap">${article.content}</div>`;
    }

    // Incrémenter les vues (async, non bloquant)
    incrementViews(article.id).catch(err => {
      console.error('Erreur incrémentation vues:', err);
    });

    return (
      <article className="min-h-screen">
        {/* Header avec image, titre, etc. */}
        <BlogArticleHeader article={article} />

        {/* Contenu de l'article */}
        <div className="container mx-auto px-4 py-12">
          <div
            className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Bouton retour */}
          <div className="max-w-4xl mx-auto mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Retour au blog
            </Link>
          </div>
        </div>
      </article>
    );

  } catch (error) {
    console.error('Erreur critique page article:', error);

    // Page d'erreur user-friendly
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Erreur de chargement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Impossible de charger cet article. Il est peut-être en cours de modification.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Retour au blog
          </Link>
        </div>
      </div>
    );
  }
}
