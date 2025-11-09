"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ArticleLinkClient } from "@/components/blog/article-link-client";
import { Article } from "@/lib/blog-data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface ArticlePageClientProps {
  article: Article;
  relatedArticles: Article[];
}

export function ArticlePageClient({ article, relatedArticles }: ArticlePageClientProps) {
  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: "Blog", href: "/blog" },
              { label: article.title, href: `/blog/${article.slug}`, isCurrent: true }
            ]} 
          />
          
          <h1 className="text-4xl font-bold mb-4 mt-4">{article.title}</h1>
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              {article.category}
            </Badge>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                {article.authorImage && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={article.authorImage}
                      alt={article.author}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <span>{article.author}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{article.date}</span>
              <span className="text-gray-400">•</span>
              <span>{article.readTime || "5 min"} de lecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>

            {/* Article Text */}
            <div 
              className="prose prose-lg max-w-none" 
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share and Tags */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-sm text-gray-500 mr-3">Partager :</span>
                  <ShareButtons 
                    title={article.title} 
                    url={`/blog/${article.slug}`} 
                  />
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    {article.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Articles similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <Badge variant="outline" className="self-start mb-3">
                        {relatedArticle.category}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2">{relatedArticle.title}</h3>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="mt-auto">
                        <ArticleLinkClient slug={relatedArticle.slug} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
} 