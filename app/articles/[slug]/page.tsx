import { notFound } from "next/navigation";
import { ArticlePageClient } from "@/components/blog/article-page-client";
import { articles, Article } from "@/lib/blog-data";

// Fonction pour récupérer un article par son slug
function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

// Fonction pour récupérer les articles liés (de même catégorie)
function getRelatedArticles(currentArticle: Article, limit = 3) {
  return articles
    .filter(
      (article) => article.category === currentArticle.category && article.id !== currentArticle.id
    )
    .slice(0, limit);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: "Article non trouvé - Église Protestante Libre de Strasbourg",
      description: "L'article que vous recherchez n'existe pas ou a été déplacé.",
    };
  }
  
  return {
    title: `${article.title} - Articles EPLS`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  // Si l'article n'existe pas, renvoyer vers la page 404
  if (!article) {
    notFound();
  }
  
  // Articles liés
  const relatedArticles = getRelatedArticles(article);

  return <ArticlePageClient article={article} relatedArticles={relatedArticles} />;
} 