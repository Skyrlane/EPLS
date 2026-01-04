'use client';

/**
 * Header pour page article de blog
 */

import { Article } from '@/types';
import Image from 'next/image';
import { Clock, Calendar, Share2, Facebook, Twitter, Mail, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BlogArticleHeaderProps {
  article: Article;
}

export function BlogArticleHeader({ article }: BlogArticleHeaderProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : '';
  
  const handleShare = (platform: string) => {
    const title = article.title;
    const url = shareUrl;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: 'Lien copié !',
          description: 'Le lien a été copié dans le presse-papier',
        });
        setShowShareMenu(false);
        break;
    }
  };
  
  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const getTagColor = (tag: string) => {
    return tag === 'À la une' ? '#06B6D4' : '#3B82F6';
  };
  
  return (
    <header className="relative">
      {/* Image de couverture - Hero responsive */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-muted">
        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
        )}
        
        {/* Overlay gradient pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Contenu header - Centré et superposé */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Badge tag */}
          <div className="mb-4 flex justify-center">
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-lg"
              style={{ backgroundColor: getTagColor(article.tag) }}
            >
              {article.tag}
            </span>
          </div>
          
          {/* Titre - Centré sur fond blanc/noir semi-transparent */}
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-6 leading-tight">
              {article.title}
            </h1>
            
            {/* Métadonnées - Centrées */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium">{article.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time>{formatDate(article.publishedAt)}</time>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readingTime} min de lecture</span>
              </div>
            </div>
            
            {/* Passage biblique si présent */}
            {article.biblicalReference && (
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                  📖 {article.biblicalReference}
                </span>
              </div>
            )}
            
            {/* Résumé/Extrait si présent */}
            {article.excerpt && (
              <p className="text-lg text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                {article.excerpt}
              </p>
            )}
            
            {/* Boutons de partage */}
            <div className="flex justify-center gap-3 pt-6 border-t border-border relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Partager</span>
              </button>
              
              {/* Menu de partage */}
              {showShareMenu && (
                <div className="absolute top-full mt-2 bg-card rounded-lg shadow-xl border border-border p-2 flex gap-2 z-20">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Partager sur Facebook"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Partager sur Twitter"
                  >
                    <Twitter className="w-5 h-5 text-sky-500" />
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Partager par email"
                  >
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copier le lien"
                  >
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}