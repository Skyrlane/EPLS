'use client';

/**
 * Card pour afficher un article de blog (système Firestore)
 */

import { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, formatReadingTime, getTagColor } from '@/lib/blog-utils';
import { Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function BlogArticleCard({ article, featured = false }: BlogArticleCardProps) {
  const tagColor = getTagColor(article.tag);

  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Image de couverture */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageMobile || article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes={featured ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground text-sm">Pas d&apos;image</span>
            </div>
          )}

          {/* Badge tag */}
          <div className="absolute top-3 left-3">
            <Badge 
              style={{ 
                backgroundColor: tagColor,
                color: 'white',
                borderColor: tagColor
              }}
              className="shadow-md"
            >
              {article.tag}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-2">
          {/* Titre */}
          <h3 className={`font-bold leading-tight line-clamp-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Extrait */}
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.excerpt}
          </p>

          {/* Passage biblique (si présent) */}
          {article.biblicalReference && (
            <p className="text-primary text-sm font-medium italic">
              📖 {article.biblicalReference}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
          {/* Auteur */}
          <div className="font-medium text-foreground">
            {article.author}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatReadingTime(article.readingTime)}</span>
          </div>

          {article.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
