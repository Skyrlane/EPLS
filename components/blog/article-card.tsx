"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from 'lucide-react';
import { ArticleLinkClient } from "@/components/blog/article-link-client";
import type { Article } from "../../types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{article.category}</Badge>
        </div>
        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {article.date}
          </span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {article.readTime} de lecture
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <ArticleLinkClient 
          slug={article.slug}
          section="blog"
          className="px-0 font-semibold"
        />
      </CardFooter>
    </Card>
  );
} 