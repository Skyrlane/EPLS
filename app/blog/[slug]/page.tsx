import { notFound } from "next/navigation";

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache 5 minutes
import { Metadata } from 'next';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Article } from '@/types';
import { BlogArticleHeader } from '@/components/blog/BlogArticleHeader';
import { BlogArticleCard } from '@/components/blog/BlogArticleCard';
import { processMarkdown } from '@/lib/markdown-processor';

interface PageProps {
  params: { slug: string };
}

// Générer les metadata dynamiques
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const articleDoc = await getArticleBySlug(params.slug);
  
  if (!articleDoc) {
    return {
      title: "Article non trouvé - EPLS",
      description: "L'article que vous recherchez n'existe pas ou a été déplacé.",
    };
  }

  const article = articleDoc as Article;
  
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
}

// Note: generateStaticParams désactivé car on utilise dynamic = 'force-dynamic'
// Les pages seront générées à la demande

export default async function ArticlePage({ params }: PageProps) {
  const articleDoc = await getArticleBySlug(params.slug);
  
  if (!articleDoc) {
    notFound();
  }

  const article = articleDoc as Article;

  // Incrémenter les vues (en arrière-plan, ne bloque pas le rendu)
  incrementViews(article.id).catch(console.error);

  // Récupérer les articles similaires (même tag)
  const relatedArticles = await getRelatedArticles(article.tag, article.id);

  // Convertir le Markdown en HTML
  const contentHtml = processMarkdown(article.content);

  return (
    <div className="min-h-screen">
      <article className="container py-12 max-w-4xl">
        {/* Header */}
        <BlogArticleHeader article={article} />

        {/* Contenu */}
        <div 
          className="prose prose-lg prose-slate dark:prose-invert max-w-none mt-12"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: article.title,
              description: article.metaDescription || article.excerpt,
              image: article.coverImageUrl,
              datePublished: article.publishedAt?.toISOString(),
              dateModified: article.updatedAt?.toISOString(),
              author: {
                '@type': 'Person',
                name: article.author,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Église Protestante Libre de Strasbourg',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://epls.fr/logo.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://epls.fr/blog/${article.slug}`,
              },
            }),
          }}
        />
      </article>

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container max-w-7xl">
            <h2 className="text-3xl font-bold mb-8">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <BlogArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Helper: Récupérer un article par slug
async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('slug', '==', slug),
      where('status', '==', 'published'),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publishedAt: data.publishedAt?.toDate(),
      scheduledFor: data.scheduledFor?.toDate(),
      lastSyncedAt: data.lastSyncedAt?.toDate(),
    } as Article;
  } catch (error) {
    console.error('Erreur getArticleBySlug:', error);
    return null;
  }
}

// Helper: Récupérer articles similaires
async function getRelatedArticles(tag: string, excludeId: string, limit: number = 3): Promise<Article[]> {
  try {
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('tag', '==', tag),
      where('status', '==', 'published'),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);

    const articles = snapshot.docs
      .filter(doc => doc.id !== excludeId)
      .slice(0, limit)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate(),
        } as Article;
      });

    return articles;
  } catch (error) {
    console.error('Erreur getRelatedArticles:', error);
    return [];
  }
}

// Helper: Incrémenter le compteur de vues
async function incrementViews(articleId: string): Promise<void> {
  try {
    const articleRef = doc(firestore, 'articles', articleId);
    await updateDoc(articleRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error('Erreur incrementViews:', error);
  }
} 