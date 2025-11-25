'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { GalleryPhoto, GalleryTag } from '@/types';
import { PhotoUploader } from '@/components/admin/PhotoUploader';
import { PhotoList } from '@/components/admin/PhotoList';
import { TagManager } from '@/components/admin/TagManager';
import { useToast } from '@/hooks/use-toast';

export default function AdminPhotosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [tags, setTags] = useState<GalleryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    totalSize: 0
  });

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?callbackUrl=/admin/photos');
    }
  }, [user, authLoading, router]);

  // Charger les données
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les photos
      const photosRef = collection(firestore, 'gallery_photos');
      const photosQuery = query(photosRef, orderBy('createdAt', 'desc'));
      const photosSnap = await getDocs(photosQuery);
      
      const photosData: GalleryPhoto[] = photosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        photoDate: doc.data().photoDate?.toDate() || null
      } as GalleryPhoto));

      setPhotos(photosData);

      // Calculer les stats
      const totalSize = photosData.reduce((acc, p) => acc + (p.fileSize || 0), 0);
      setStats({
        total: photosData.length,
        active: photosData.filter(p => p.isActive).length,
        featured: photosData.filter(p => p.isFeatured).length,
        totalSize
      });

      // Charger les tags
      const tagsRef = collection(firestore, 'gallery_tags');
      const tagsQuery = query(tagsRef, orderBy('name'));
      const tagsSnap = await getDocs(tagsQuery);
      
      const tagsData: GalleryTag[] = tagsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as GalleryTag));

      setTags(tagsData);

      console.log('✅ Données chargées:', {
        photos: photosData.length,
        tags: tagsData.length
      });

    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Affichage pendant le chargement
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  // Affichage si non connecté
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion de la Galerie Photo</h1>
          <p className="text-muted-foreground">
            Uploadez, organisez et gérez les photos de l'église
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/membres">← Retour à l'espace membres</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Limite : 800
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Photos actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visibles publiquement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mises en avant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dans le carousel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stockage utilisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur 5 GB disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="manage">Gérer les photos ({photos.length})</TabsTrigger>
          <TabsTrigger value="tags">Tags ({tags.length})</TabsTrigger>
        </TabsList>

        {/* Tab: Upload */}
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploader des photos</CardTitle>
              <CardDescription>
                Glissez-déposez vos images ou cliquez pour sélectionner. 
                Formats acceptés : JPG, PNG, WebP (max 10 MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUploader
                tags={tags}
                onUploadComplete={loadData}
                maxPhotos={800}
                currentCount={stats.total}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Manage */}
        <TabsContent value="manage" className="mt-6">
          <PhotoList
            photos={photos}
            tags={tags}
            onUpdate={loadData}
            onDelete={loadData}
          />
        </TabsContent>

        {/* Tab: Tags */}
        <TabsContent value="tags" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des tags</CardTitle>
              <CardDescription>
                Créez et organisez les catégories de photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager
                tags={tags}
                onUpdate={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
