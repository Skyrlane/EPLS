"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format-date";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ArticleLinkClient } from "@/components/blog/article-link-client";

interface RelatedArticle {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category: string;
}

interface Article {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: {
    name: string;
    image: string;
  };
  category: string;
}

interface ArticlePageClientProps {
  article: Article;
  relatedArticles: RelatedArticle[];
}

export function ArticlePageClient({
  article,
  relatedArticles,
}: ArticlePageClientProps) {
  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-8">
        {/* En-tête d'article */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{article.category}</Badge>
            <span className="text-muted-foreground">
              {formatDate(article.date)}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
          <div className="flex items-center gap-3">
            <Image
              src={article.author.image}
              alt={article.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium leading-none">{article.author.name}</p>
              <p className="text-sm text-muted-foreground">Auteur</p>
            </div>
          </div>
        </div>

        {/* Image principale */}
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Contenu de l'article */}
        <div 
          className="prose prose-stone mx-auto dark:prose-invert lg:prose-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Options de partage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Partager:</span>
            <ShareButtons title={article.title} url={`/articles/${article.slug}`} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Catégorie:</span>
            <Badge variant="outline">{article.category}</Badge>
          </div>
        </div>

        {/* Articles connexes */}
        {relatedArticles.length > 0 && (
          <div className="space-y-6 pt-6">
            <Separator />
            <h2 className="text-2xl font-bold">Articles similaires</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <div key={related.slug} className="group space-y-3">
                  <div
                    className={cn(
                      "relative aspect-video overflow-hidden rounded-lg"
                    )}
                  >
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover transition-all group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold leading-tight">{related.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {related.excerpt}
                    </p>
                  </div>
                  <ArticleLinkClient slug={related.slug} variant="text" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 