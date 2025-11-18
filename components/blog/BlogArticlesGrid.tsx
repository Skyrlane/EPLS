'use client';

/**
 * Grid d'articles avec filtres côté client
 */

import { useState } from 'react';
import { Article } from '@/types';
import { BlogArticleCard } from './BlogArticleCard';
import { Button } from '@/components/ui/button';
import { BLOG_TAGS } from '@/lib/blog-utils';
import { Badge } from '@/components/ui/badge';

interface BlogArticlesGridProps {
  articles: any[]; // Articles sérialisés depuis le serveur
}

export function BlogArticlesGrid({ articles }: BlogArticlesGridProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Convertir les dates ISO string en Date objects
  const parsedArticles: Article[] = articles.map(article => ({
    ...article,
    createdAt: article.createdAt ? new Date(article.createdAt) : new Date(),
    updatedAt: article.updatedAt ? new Date(article.updatedAt) : new Date(),
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
    scheduledFor: article.scheduledFor ? new Date(article.scheduledFor) : undefined,
  }));

  // Filtrer par tag
  const filteredArticles = selectedTag === 'all'
    ? parsedArticles
    : parsedArticles.filter(article => article.tag === selectedTag);

  return (
    <div className="space-y-8">
      {/* Filtres par tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedTag === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTag('all')}
          className="rounded-full"
        >
          Tous
        </Button>

        {BLOG_TAGS.map((tag) => (
          <Button
            key={tag.label}
            variant={selectedTag === tag.label ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(tag.label)}
            className="rounded-full"
            style={
              selectedTag === tag.label
                ? {
                    backgroundColor: tag.color,
                    borderColor: tag.color,
                    color: 'white',
                  }
                : {}
            }
          >
            {tag.label}
          </Button>
        ))}
      </div>

      {/* Grid d'articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {selectedTag === 'all' 
              ? 'Aucun article publié pour le moment.' 
              : `Aucun article dans la catégorie "${selectedTag}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <BlogArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
