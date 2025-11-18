'use client';

/**
 * Header pour page article de blog
 */

import { Article } from '@/types';
import Image from 'next/image';
import { formatDate, formatReadingTime, getTagColor } from '@/lib/blog-utils';
import { Clock, Calendar, Share2, Facebook, Twitter, Mail, Link2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BlogArticleHeaderProps {
  article: Article;
}

export function BlogArticleHeader({ article }: BlogArticleHeaderProps) {
  const tagColor = getTagColor(article.tag);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const articleUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : '';

  const handleShare = async (platform: 'facebook' | 'twitter' | 'email' | 'copy') => {
    const title = encodeURIComponent(article.title);
    const url = encodeURIComponent(articleUrl);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${title}&body=${url}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(articleUrl);
          setCopied(true);
          toast({
            title: 'Lien copié',
            description: 'Le lien a été copié dans le presse-papier',
          });
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast({
            title: 'Erreur',
            description: 'Impossible de copier le lien',
            variant: 'destructive',
          });
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Image de couverture */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageDesktop || article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">Pas d&apos;image</span>
          </div>
        )}
      </div>

      {/* Métadonnées */}
      <div className="space-y-4">
        {/* Badge tag */}
        <div>
          <Badge 
            style={{ 
              backgroundColor: tagColor,
              color: 'white',
              borderColor: tagColor
            }}
            className="text-sm"
          >
            {article.tag}
          </Badge>
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {article.title}
        </h1>

        {/* Passage biblique */}
        {article.biblicalReference && (
          <p className="text-primary text-lg font-medium italic">
            📖 {article.biblicalReference}
          </p>
        )}

        {/* Infos + Partage */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
          {/* Auteur */}
          <div className="font-medium text-foreground text-base">
            Par {article.author}
          </div>

          {/* Date */}
          {article.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          )}

          {/* Temps de lecture */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatReadingTime(article.readingTime)}</span>
          </div>

          <div className="flex-1" />

          {/* Boutons de partage */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              Partager :
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="h-8 w-8 p-0"
              title="Partager sur Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="h-8 w-8 p-0"
              title="Partager sur Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('email')}
              className="h-8 w-8 p-0"
              title="Partager par email"
            >
              <Mail className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('copy')}
              className="h-8 w-8 p-0"
              title="Copier le lien"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
