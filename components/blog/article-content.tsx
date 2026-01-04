"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock } from 'lucide-react';
import type { Article } from "../../types";

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de l'article avec image */}
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image 
              src={article.image || "/placeholder.svg"} 
              alt={article.title} 
              fill 
              className="object-cover" 
              priority // Image prioritaire car visible immédiatement
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          {/* Métadonnées de l'article */}
          <div className="mb-8">
            <Badge className="mb-3">{article.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {article.date}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime} de lecture
              </span>
            </div>
          </div>

          {/* Contenu de l'article */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Biographie de l'auteur */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={article.authorImage || "/placeholder.svg"} alt={article.author} />
                <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold mb-2">À propos de {article.author}</h3>
                <p className="text-muted-foreground">
                  {article.author} est membre de l'Église Protestante Libre de Saint-Maur et partage
                  régulièrement ses réflexions et témoignages sur notre blog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 