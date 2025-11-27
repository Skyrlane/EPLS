'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { doc, getDoc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import type { HeroImageSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Info } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

// Configuration pour éviter les problèmes de chargement en production
const imageLoader = ({ src }: { src: string }) => src;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const STORAGE_PATH = 'site/hero/hero-current.webp';

export default function AdminHeroImagePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [heroImage, setHeroImage] = useState<HeroImageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Redirection si non authentifié
  useEffect(() => {
    if (!user) {
      router.push('/connexion?callbackUrl=/admin/hero-image');
    }
  }, [user, router]);

  // Charger l'image hero actuelle
  useEffect(() => {
    if (user) {
      loadHeroImage();
    }
  }, [user]);

  const loadHeroImage = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, 'site_settings', 'hero_image');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroImage({
          id: 'hero_image',
          ...data,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as HeroImageSettings);
      }
    } catch (error) {
      console.error('Erreur chargement hero image:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger l\'image',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion du drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
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
        description: `Votre image fait ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum : 2 MB`,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);

    // Créer une preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadHeroImage = async () => {
    if (!selectedFile || !user) return;

    try {
      setUploading(true);

      // 1. Uploader vers Storage
      const storageRef = ref(storage, STORAGE_PATH);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Obtenir les dimensions de l'image
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = previewUrl!;
      });

      // 3. Sauvegarder dans Firestore
      const heroImageData: Omit<HeroImageSettings, 'id'> = {
        imageUrl: downloadURL,
        storagePath: STORAGE_PATH,
        dimensions: {
          width: img.width,
          height: img.height,
        },
        format: selectedFile.type.split('/')[1],
        fileSize: selectedFile.size,
        uploadedBy: user.uid,
        uploadedByName: user.displayName || user.email || 'Admin',
        uploadedAt: Timestamp.now() as any,
        updatedAt: Timestamp.now() as any,
      };

      await setDoc(doc(firestore, 'site_settings', 'hero_image'), heroImageData);

      toast({
        title: 'Succès',
        description: 'Image hero mise à jour',
      });

      // Réinitialiser
      setSelectedFile(null);
      setPreviewUrl(null);
      loadHeroImage();
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader l\'image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteHeroImage = async () => {
    if (!confirm('Supprimer l\'image hero ? Le site reviendra à l\'image par défaut.')) return;

    try {
      setUploading(true);

      // 1. Supprimer de Storage
      if (heroImage?.storagePath) {
        const storageRef = ref(storage, heroImage.storagePath);
        await deleteObject(storageRef);
      }

      // 2. Supprimer de Firestore
      await deleteDoc(doc(firestore, 'site_settings', 'hero_image'));

      toast({
        title: 'Succès',
        description: 'Image hero supprimée',
      });

      setHeroImage(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion de l'Image d'Accueil</h1>
          <p className="text-muted-foreground">
            Personnalisez l'image hero de la page d'accueil
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/membres">← Retour</Link>
        </Button>
      </div>

      {/* Image actuelle */}
      {heroImage && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Aperçu actuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview */}
            <div className="relative w-full aspect-[1920/780] overflow-hidden rounded-lg border">
              <Image
                src={heroImage.imageUrl}
                alt="Hero image actuelle"
                fill
                className="object-cover"
                loader={imageLoader}
                unoptimized
              />
            </div>

            {/* Informations */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Format :</span>{' '}
                <span className="font-medium">{heroImage.format.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dimensions :</span>{' '}
                <span className="font-medium">
                  {heroImage.dimensions.width} x {heroImage.dimensions.height}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Taille :</span>{' '}
                <span className="font-medium">
                  {(heroImage.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Uploadée le :</span>{' '}
                <span className="font-medium">
                  {heroImage.uploadedAt.toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            {/* Bouton suppression */}
            <Button
              variant="destructive"
              onClick={deleteHeroImage}
              disabled={uploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer l'image
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload nouvelle image */}
      <Card>
        <CardHeader>
          <CardTitle>Changer l'image</CardTitle>
          <CardDescription>
            Uploadez une nouvelle image hero pour la page d'accueil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zone de drop */}
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Glissez-déposez votre image ici
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                id="hero-upload"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
              />
              <label htmlFor="hero-upload" className="cursor-pointer">
                <Button variant="outline" type="button">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Sélectionner une image
                </Button>
              </label>
            </div>
          ) : (
            <>
              {/* Preview du fichier sélectionné */}
              <div className="space-y-4">
                <div className="relative w-full aspect-[1920/780] overflow-hidden rounded-lg border">
                  <Image
                    src={previewUrl!}
                    alt="Preview"
                    fill
                    className="object-cover"
                    loader={imageLoader}
                    unoptimized
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={uploadHeroImage}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? 'Upload en cours...' : 'Uploader la nouvelle image'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    disabled={uploading}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Recommandations */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Recommandations :</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Format paysage recommandé (ratio 16:9 ou similaire)</li>
                <li>Dimensions minimales : 1920 x 780 pixels</li>
                <li>Taille maximale : 2 MB</li>
                <li>Formats acceptés : JPG, PNG, WebP</li>
                <li>Assurez-vous que le texte reste lisible sur l'image</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
