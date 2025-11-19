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

    const data = snapshot.docs[0].data();
    const article = {
      ...data,
      publishedAt: data.publishedAt?.toDate?.(),
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
      scheduledFor: data.scheduledFor?.toDate?.(),
    } as Article;

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
      <article className="min-h-screen bg-white dark:bg-gray-950">
        {/* Header */}
        <BlogArticleHeader article={article} />
        
        {/* Contenu principal */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Contenu de l'article */}
            <div 
              className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                         prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                         prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                         prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                         prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                         prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                         prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            
            {/* Séparateur */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              
              {/* Info auteur */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{article.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Publié le {article.publishedAt?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              {/* Bouton retour */}
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                ← Retour au blog
              </Link>
            </div>
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
