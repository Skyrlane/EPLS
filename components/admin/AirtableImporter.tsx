'use client';

/**
 * Interface d'import des articles depuis Airtable
 */

import { useState, useEffect } from 'react';
import { AirtableArticle } from '@/types';
import { getUnimportedArticles } from '@/lib/airtable-client';
import { generateSlug, calculateReadingTime, downloadImage, uploadBlogImage, BLOG_TAGS } from '@/lib/blog-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

interface ArticleToImport extends AirtableArticle {
  selected: boolean;
  alreadyExists: boolean;
  author: string;
  tag: string;
}

export function AirtableImporter() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [articles, setArticles] = useState<ArticleToImport[]>([]);
  const [progress, setProgress] = useState(0);

  const loadArticles = async () => {
    try {
      setLoading(true);

      // Charger les articles depuis Airtable
      const airtableArticles = await getUnimportedArticles();

      // Vérifier lesquels existent déjà dans Firestore (par titre)
      const articlesRef = collection(firestore, 'articles');
      const snapshot = await getDocs(articlesRef);
      const existingTitles = snapshot.docs.map(doc => doc.data().title.toLowerCase());

      // Mapper avec état de sélection
      const mappedArticles: ArticleToImport[] = airtableArticles.map(article => ({
        ...article,
        selected: false,
        alreadyExists: existingTitles.includes(article.titre.toLowerCase()),
        author: '',
        tag: '',
      }));

      setArticles(mappedArticles);

      toast({
        title: 'Articles chargés',
        description: `${mappedArticles.length} articles trouvés dans Airtable`,
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les articles Airtable',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = (id: string, field: keyof ArticleToImport, value: any) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === id ? { ...article, [field]: value } : article
      )
    );
  };

  const handleImport = async () => {
    const selectedArticles = articles.filter(a => a.selected && !a.alreadyExists && a.author && a.tag);

    if (selectedArticles.length === 0) {
      toast({
        title: 'Aucun article sélectionné',
        description: 'Sélectionnez au moins un article avec auteur et tag remplis',
        variant: 'destructive',
      });
      return;
    }

    try {
      setImporting(true);
      setProgress(0);

      for (let i = 0; i < selectedArticles.length; i++) {
        const article = selectedArticles[i];

        // 1. Télécharger l'image
        let imageUrls: { url: string; mobileUrl: string; desktopUrl: string } | undefined;
        if (article.imageUrl) {
          try {
            const imageBlob = await downloadImage(article.imageUrl);
            imageUrls = await uploadBlogImage(imageBlob, `airtable-${article.id}.jpg`);
          } catch (err) {
            console.error('Erreur upload image:', err);
          }
        }

        // 2. Créer le document Firestore
        await addDoc(collection(firestore, 'articles'), {
          title: article.titre,
          slug: generateSlug(article.titre),
          content: article.contenu,
          excerpt: article.resume,
          metaDescription: article.resume.substring(0, 160),
          coverImageUrl: imageUrls?.url || '',
          coverImageMobile: imageUrls?.mobileUrl || '',
          coverImageDesktop: imageUrls?.desktopUrl || '',
          author: article.author,
          tag: article.tag,
          biblicalReference: article.biblicalReference || '',
          readingTime: calculateReadingTime(article.contenu),
          status: 'draft',
          isActive: true,
          
          // Tracking Airtable
          airtableSourceId: article.id,
          syncedToAirtable: false,
          
          // Stats
          views: 0,
          
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Mettre à jour la progression
        setProgress(Math.round(((i + 1) / selectedArticles.length) * 100));
      }

      toast({
        title: 'Import réussi',
        description: `${selectedArticles.length} article(s) importé(s) en brouillon`,
      });

      // Recharger
      await loadArticles();
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'importer les articles',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const selectedCount = articles.filter(a => a.selected && !a.alreadyExists).length;
  const readyCount = articles.filter(a => a.selected && !a.alreadyExists && a.author && a.tag).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Importer depuis Airtable</h2>
          <p className="text-muted-foreground mt-1">
            Importez des articles depuis la table &quot;Articles Rédigés&quot;
          </p>
        </div>

        <Button onClick={loadArticles} disabled={loading || importing}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Download className="mr-2 h-4 w-4" />
          Charger les articles
        </Button>
      </div>

      {/* Progress bar */}
      {importing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Import en cours...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des articles */}
      {articles.length > 0 && (
        <>
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{selectedCount}</span> sélectionné(s) •{' '}
              <span className="font-medium text-green-600">{readyCount}</span> prêt(s) à importer
            </div>

            {readyCount > 0 && (
              <Button onClick={handleImport} disabled={importing} className="ml-auto">
                {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Importer {readyCount} article(s)
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className={article.alreadyExists ? 'opacity-50' : ''}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={article.selected}
                      onCheckedChange={(checked) =>
                        updateArticle(article.id, 'selected', checked)
                      }
                      disabled={article.alreadyExists || importing}
                      className="mt-1"
                    />

                    {/* Image preview */}
                    {article.imageUrl && (
                      <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={article.imageUrl}
                          alt={article.titre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Infos */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <CardTitle className="text-lg">{article.titre}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {article.resume}
                        </p>
                      </div>

                      {/* Status */}
                      {article.alreadyExists ? (
                        <Badge variant="secondary" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Déjà importé
                        </Badge>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {/* Auteur */}
                          <div className="space-y-1">
                            <Label htmlFor={`author-${article.id}`} className="text-xs">
                              Auteur *
                            </Label>
                            <Input
                              id={`author-${article.id}`}
                              value={article.author}
                              onChange={(e) =>
                                updateArticle(article.id, 'author', e.target.value)
                              }
                              placeholder="Nom de l'auteur"
                              disabled={importing}
                              className="h-8"
                            />
                          </div>

                          {/* Tag */}
                          <div className="space-y-1">
                            <Label className="text-xs">Tag *</Label>
                            <Select
                              value={article.tag}
                              onValueChange={(value) =>
                                updateArticle(article.id, 'tag', value)
                              }
                              disabled={importing}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Tag" />
                              </SelectTrigger>
                              <SelectContent>
                                {BLOG_TAGS.map((tag) => (
                                  <SelectItem key={tag.label} value={tag.label}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                      />
                                      {tag.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Message si vide */}
      {articles.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Download className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Cliquez sur &quot;Charger les articles&quot; pour récupérer les articles depuis Airtable
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
