"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArticleLinkClient } from "@/components/blog/article-link-client";

interface ArticleCardProps {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  section?: "blog" | "articles";
}

export function ArticleCardClient({
  id,
  title,
  slug,
  excerpt,
  author,
  date,
  image,
  category,
  section = "blog"
}: ArticleCardProps) {
  return (
    <Card key={id}>
      <div className="relative h-48">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{category}</Badge>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="text-sm text-gray-500">
          <span>Par {author}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <ArticleLinkClient 
          slug={slug}
          section={section}
          className="px-0 font-semibold"
        />
      </CardFooter>
    </Card>
  );
} 