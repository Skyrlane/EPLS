"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArticleLinkClient } from "@/components/blog/article-link-client";

interface FeaturedArticleProps {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  section?: "blog" | "articles";
}

export function FeaturedArticleClient({
  title,
  slug,
  excerpt,
  author,
  date,
  image,
  category,
  section = "blog"
}: FeaturedArticleProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-64 lg:h-auto">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">À la une</Badge>
            <Badge variant="outline">{category}</Badge>
          </div>
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600 mb-4">{excerpt}</p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span>Par {author}</span>
              <span className="mx-2">•</span>
              <span>{date}</span>
            </div>
            <ArticleLinkClient 
              slug={slug}
              section={section}
              variant="default"
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 