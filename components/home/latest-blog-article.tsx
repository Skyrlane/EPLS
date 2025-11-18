'use client';

/**
 * Composant pour afficher le dernier article de blog sur la page d'accueil
 */

import { BlogArticleCard } from '@/components/blog/BlogArticleCard';
import { Article } from '@/types';

interface LatestBlogArticleProps {
  article: Article;
}

export function LatestBlogArticle({ article }: LatestBlogArticleProps) {
  return <BlogArticleCard article={article} featured />;
}
