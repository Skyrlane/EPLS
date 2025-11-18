'use client';

/**
 * Page admin pour gérer le blog
 */

import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { AirtableImporter } from '@/components/admin/AirtableImporter';
import { TagManager } from '@/components/admin/TagManager';
import { useToast } from '@/hooks/use-toast';
import { useArticlePublish } from '@/hooks/use-article-publish';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { formatDate, formatReadingTime, getTagColor, BLOG_TAGS } from '@/lib/blog-utils';

export default function AdminBlogPage() {
  const { toast } = useToast();
  const { publishArticle, unpublishArticle } = useArticlePublish();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Charger les articles
  useEffect(() => {
    if (activeTab === 'list') {
      loadArticles();
    }
  }, [activeTab]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const articlesRef = collection(firestore, 'articles');
      const q = query(articlesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const loadedArticles = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate(),
          scheduledFor: data.scheduledFor?.toDate(),
          lastSyncedAt: data.lastSyncedAt?.toDate(),
        } as Article;
      });

      setArticles(loadedArticles);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les articles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (data: Partial<Article>) => {
    try {
      await addDoc(collection(firestore, 'articles'), {
        ...data,
        views: 0,
        syncedToAirtable: false,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({
        title: 'Succès',
        description: 'Article créé',
      });

      setActiveTab('list');
      await loadArticles();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  };

  const handleUpdateArticle = async (data: Partial<Article>) => {
    if (!editingArticle) return;

    try {
      const articleRef = doc(firestore, 'articles', editingArticle.id);
      await updateDoc(articleRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: 'Succès',
        description: 'Article mis à jour',
      });

      setEditingArticle(null);
      setActiveTab('list');
      await loadArticles();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  const handleDeleteArticle = async (article: Article) => {
    if (!confirm(`Supprimer l'article "${article.title}" ?`)) {
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'articles', article.id));

      toast({
        title: 'Succès',
        description: 'Article supprimé',
      });

      await loadArticles();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = async (article: Article) => {
    try {
      await publishArticle(article.id, article);
      toast({
        title: 'Succès',
        description: 'Article publié',
      });
      await loadArticles();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de publier l\'article',
        variant: 'destructive',
      });
    }
  };

  const handleUnpublish = async (article: Article) => {
    try {
      await unpublishArticle(article.id);
      toast({
        title: 'Succès',
        description: 'Article dépublié',
      });
      await loadArticles();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de dépublier l\'article',
        variant: 'destructive',
      });
    }
  };

  // Filtrer les articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    const matchesTag = filterTag === 'all' || article.tag === filterTag;
    return matchesSearch && matchesStatus && matchesTag;
  });

  const getStatusBadge = (article: Article) => {
    switch (article.status) {
      case 'published':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Publié
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Clock className="h-3 w-3 mr-1" />
            Programmé
          </Badge>
        );
      case 'draft':
      default:
        return (
          <Badge variant="secondary">
            <FileText className="h-3 w-3 mr-1" />
            Brouillon
          </Badge>
        );
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion du Blog</h1>
        <p className="text-muted-foreground mt-2">
          Créez et gérez les articles de blog, importez depuis Airtable
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Liste des articles</TabsTrigger>
          <TabsTrigger value="create">Nouvel article</TabsTrigger>
          <TabsTrigger value="import">Importer d&apos;Airtable</TabsTrigger>
          <TabsTrigger value="tags">Gérer les tags</TabsTrigger>
        </TabsList>

        {/* Liste des articles */}
        <TabsContent value="list" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un article..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="scheduled">Programmé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les tags</SelectItem>
                    {BLOG_TAGS.map(tag => (
                      <SelectItem key={tag.label} value={tag.label}>
                        {tag.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {articles.length === 0 
                    ? 'Aucun article. Créez-en un ou importez depuis Airtable.' 
                    : 'Aucun article ne correspond aux filtres.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Image */}
                      {article.coverImageUrl && (
                        <div className="relative w-32 h-24 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={article.coverImageMobile || article.coverImageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Contenu */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold">{article.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {article.excerpt}
                            </p>
                          </div>
                          {getStatusBadge(article)}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <Badge 
                            variant="outline"
                            style={{ borderColor: getTagColor(article.tag) }}
                          >
                            {article.tag}
                          </Badge>
                          <span>Par {article.author}</span>
                          <span>• {formatReadingTime(article.readingTime)}</span>
                          {article.publishedAt && (
                            <span>• Publié le {formatDate(article.publishedAt)}</span>
                          )}
                          {article.scheduledFor && (
                            <span>• Programmé pour le {formatDate(article.scheduledFor)}</span>
                          )}
                          {article.views > 0 && (
                            <span>• {article.views} vue{article.views > 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingArticle(article);
                            setActiveTab('edit');
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/blog/${article.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Link>
                        </Button>

                        {article.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublish(article)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Publier
                          </Button>
                        )}

                        {article.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnpublish(article)}
                          >
                            Dépublier
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteArticle(article)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Créer un article */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Nouvel article</CardTitle>
            </CardHeader>
            <CardContent>
              <ArticleForm
                onSubmit={handleCreateArticle}
                onCancel={() => setActiveTab('list')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modifier un article */}
        <TabsContent value="edit">
          {editingArticle && (
            <Card>
              <CardHeader>
                <CardTitle>Modifier l&apos;article</CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleForm
                  article={editingArticle}
                  onSubmit={handleUpdateArticle}
                  onCancel={() => {
                    setEditingArticle(null);
                    setActiveTab('list');
                  }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Import Airtable */}
        <TabsContent value="import">
          <AirtableImporter />
        </TabsContent>

        {/* Gérer les tags */}
        <TabsContent value="tags">
          <TagManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
