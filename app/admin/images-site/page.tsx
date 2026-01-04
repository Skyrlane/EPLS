'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import type { SiteImage } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Trash2,
  Search,
  Filter,
  ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export default function AdminImagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [images, setImages] = useState<SiteImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadingZone, setUploadingZone] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/connexion?callbackUrl=/admin/images-site');
    }
  }, [user, router]);

  // Load all site images
  useEffect(() => {
    if (!user || !firestore) return;

    const q = query(
      collection(firestore, 'site_images'),
      orderBy('page'),
      orderBy('priority', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SiteImage[];

      setImages(imagesData);
      setFilteredImages(imagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Apply filters
  useEffect(() => {
    let filtered = images;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((img) => img.category === categoryFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((img) => img.isActive && img.imageUrl);
    } else if (statusFilter === 'missing') {
      filtered = filtered.filter((img) => !img.imageUrl || !img.isActive);
    }

    setFilteredImages(filtered);
  }, [searchTerm, categoryFilter, statusFilter, images]);

  const handleFileSelect = async (zone: string, file: File) => {
    // Validation format
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast({
        title: 'Format non supporté',
        description: 'Utilisez JPG, PNG ou WebP uniquement',
        variant: 'destructive',
      });
      return;
    }

    // Validation taille
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Fichier trop lourd',
        description: `Maximum : 5 MB (votre fichier: ${(file.size / 1024 / 1024).toFixed(1)} MB)`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingZone(zone);

      // Upload vers Storage
      const storagePath = `site/images/${zone}/${Date.now()}.${file.type.split('/')[1]}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore
      await updateDoc(doc(firestore, 'site_images', zone), {
        imageUrl: downloadURL,
        storagePath,
        isActive: true,
        updatedAt: Timestamp.now(),
        updatedBy: user?.uid,
        updatedByName: user?.displayName || user?.email || 'Admin',
      });

      toast({
        title: 'Succès',
        description: 'Image uploadée avec succès',
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'uploader l'image",
        variant: 'destructive',
      });
    } finally {
      setUploadingZone(null);
    }
  };

  const handleDeleteImage = async (image: SiteImage) => {
    if (!confirm(`Supprimer l'image "${image.label}" ?`)) return;

    try {
      // Delete from Storage if exists
      if (image.storagePath) {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef);
      }

      // Update Firestore
      await updateDoc(doc(firestore, 'site_images', image.id), {
        imageUrl: null,
        storagePath: null,
        isActive: false,
        updatedAt: Timestamp.now(),
        updatedBy: user?.uid,
        updatedByName: user?.displayName || user?.email || 'Admin',
      });

      toast({
        title: 'Succès',
        description: 'Image supprimée',
      });
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'image",
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (image: SiteImage) => {
    if (image.isActive && image.imageUrl) {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>;
    } else if (image.imageUrl && !image.isActive) {
      return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" /> Désactivée</Badge>;
    } else {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Manquante</Badge>;
    }
  };

  const stats = {
    total: images.length,
    active: images.filter((img) => img.isActive && img.imageUrl).length,
    missing: images.filter((img) => !img.imageUrl || !img.isActive).length,
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">🖼️ Gestion des Images du Site</h1>
          <p className="text-muted-foreground">
            Gérez toutes les images statiques du site depuis une interface centralisée
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">← Retour à l'administration</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total des zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Images actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">À configurer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.missing}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="logo">Logo</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les status</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="missing">Manquantes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{image.label}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {image.page} • {image.dimensions.width}×{image.dimensions.height}
                  </CardDescription>
                </div>
                {getStatusBadge(image)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={image.imageUrl || image.fallbackUrl}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Zone:</span> {image.zone}</p>
                <p><span className="font-medium">Catégorie:</span> {image.category}</p>
                <p><span className="font-medium">Priorité:</span> {image.priority}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {image.imageUrl && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteImage(image)}
                    disabled={uploadingZone === image.id}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                )}
                <label className="flex-1">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(image.id, e.target.files[0]);
                      }
                    }}
                    disabled={uploadingZone === image.id}
                  />
                  <Button
                    type="button"
                    variant={image.imageUrl ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    disabled={uploadingZone === image.id}
                    onClick={(e) => {
                      e.preventDefault();
                      (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                    }}
                  >
                    {uploadingZone === image.id ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        {image.imageUrl ? 'Remplacer' : 'Uploader'}
                      </>
                    )}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Alert>
          <AlertDescription>
            Aucune image ne correspond aux filtres sélectionnés.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
