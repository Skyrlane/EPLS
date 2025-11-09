"use client";

import { ArticleCard } from "./article-card";
import type { Article } from "../../types";

interface ArticleGridProps {
  articles: Article[];
  limit?: number;
}

export function ArticleGrid({ articles, limit }: ArticleGridProps) {
  const displayedArticles = limit ? articles.slice(0, limit) : articles;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
} 