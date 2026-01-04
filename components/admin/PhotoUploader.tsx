'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import type { GalleryTag } from '@/types';
import { validateImageFile, generateImageVersions, revokeObjectURLs } from '@/lib/image-utils';

interface PhotoUploaderProps {
  tags: GalleryTag[];
  onUploadComplete: () => void;
  maxPhotos: number;
  currentCount: number;
}

interface PhotoPreview {
  file: File;
  previewUrl: string;
  title: string;
  description: string;
  selectedTags: string[];
  isFeatured: boolean;
  photoDate: string;
}

export function PhotoUploader({ tags, onUploadComplete, maxPhotos, currentCount }: PhotoUploaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Vérifier la limite
    if (currentCount + photos.length + acceptedFiles.length > maxPhotos) {
      toast({
        title: 'Limite atteinte',
        description: `Vous ne pouvez pas dépasser ${maxPhotos} photos`,
        variant: 'destructive'
      });
      return;
    }

    const newPhotos: PhotoPreview[] = [];

    acceptedFiles.forEach(file => {
      const validation = validateImageFile(file);
      
      if (!validation.valid) {
        toast({
          title: 'Fichier rejeté',
          description: validation.error,
          variant: 'destructive'
        });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      
      // 🔍 DEBUG: Log création preview
      console.log('✅ Preview créée:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        fileType: file.type,
        previewUrl: previewUrl.substring(0, 50) + '...'
      });
      
      newPhotos.push({
        file,
        previewUrl,
        title: file.name.replace(/\.[^/.]+$/, ''), // Nom sans extension
        description: '',
        selectedTags: [],
        isFeatured: false,
        photoDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      });
    });

    setPhotos(prev => [...prev, ...newPhotos]);
  }, [currentCount, photos.length, maxPhotos, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: true
  });

  const removePhoto = (index: number) => {
    const photo = photos[index];
    revokeObjectURLs(photo.previewUrl);
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const updatePhoto = (index: number, updates: Partial<PhotoPreview>) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const toggleTag = (photoIndex: number, tagId: string) => {
    const photo = photos[photoIndex];
    const newTags = photo.selectedTags.includes(tagId)
      ? photo.selectedTags.filter(t => t !== tagId)
      : [...photo.selectedTags, tagId];
    
    updatePhoto(photoIndex, { selectedTags: newTags });
  };

  const uploadPhotos = async () => {
    if (!user) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté', variant: 'destructive' });
      return;
    }

    if (photos.length === 0) {
      toast({ title: 'Erreur', description: 'Aucune photo à uploader', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let uploaded = 0;
    const errors: string[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      try {
        console.log(`
📤 ===== UPLOAD ${i + 1}/${photos.length} =====`);
        console.log('📄 Fichier:', photo.file.name, `(${(photo.file.size / 1024).toFixed(0)} KB)`);

        // Générer les 3 versions
        console.log('🔄 Génération des versions d\'image...');
        const { original, medium, thumbnail, originalDimensions } = await generateImageVersions(photo.file);
        console.log('✅ Versions générées avec succès');

        // Générer un ID unique
        const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Upload vers Storage (3 versions)
        console.log('☁️ Upload vers Storage (3 fichiers)...');
        const [originalUrl, mediumUrl, thumbnailUrl] = await Promise.all([
          uploadToStorage(original.blob, `gallery/original/${photoId}.webp`),
          uploadToStorage(medium.blob, `gallery/medium/${photoId}.webp`),
          uploadToStorage(thumbnail.blob, `gallery/thumbnail/${photoId}.webp`)
        ]);
        console.log('✅ Upload Storage réussi');

        // Libérer les URLs temporaires
        revokeObjectURLs(original.url, medium.url, thumbnail.url);

        // Créer le document Firestore
        console.log('💾 Création document Firestore...');
        await addDoc(collection(firestore, 'gallery_photos'), {
          title: photo.title,
          description: photo.description,
          originalUrl,
          mediumUrl,
          thumbnailUrl,
          width: originalDimensions.width,
          height: originalDimensions.height,
          orientation: originalDimensions.orientation,
          fileSize: original.blob.size,
          mimeType: 'image/webp',
          tags: photo.selectedTags,
          uploadedBy: user.uid,
          uploadedByName: user.displayName || user.email || 'Admin',
          isActive: true,
          isFeatured: photo.isFeatured,
          order: 100, // Par défaut en bas
          views: 0,
          photoDate: photo.photoDate ? Timestamp.fromDate(new Date(photo.photoDate)) : null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });

        console.log(`✅ Photo uploadée: ${photo.title}`);
        uploaded++;
        setUploadProgress(Math.round((uploaded / photos.length) * 100));

      } catch (error) {
        console.error(`❌ ERREUR UPLOAD ${photo.file.name}:`, error);
        
        // Créer un message d'erreur détaillé
        let errorMessage = `${photo.file.name}: `;
        
        if (error instanceof Error) {
          // Détecter le type d'erreur
          if (error.message.includes('storage')) {
            errorMessage += `Échec upload Storage (${error.message})`;
          } else if (error.message.includes('firestore')) {
            errorMessage += `Échec création Firestore (${error.message})`;
          } else if (error.message.includes('canvas') || error.message.includes('blob')) {
            errorMessage += `Échec traitement image (${error.message})`;
          } else {
            errorMessage += error.message;
          }
        } else {
          errorMessage += 'Erreur inconnue';
        }
        
        errors.push(errorMessage);
      }
    }

    setUploading(false);

    // Feedback
    if (uploaded > 0) {
      toast({
        title: 'Succès',
        description: `${uploaded} photo(s) uploadée(s)`
      });
      
      // Nettoyer et recharger
      photos.forEach(p => revokeObjectURLs(p.previewUrl));
      setPhotos([]);
      onUploadComplete();
    }

    if (errors.length > 0) {
      console.error('❌ Erreurs upload détaillées:', errors);
      
      // Afficher les erreurs détaillées (max 3 pour ne pas surcharger)
      const errorSummary = errors.slice(0, 3).join('\n');
      const remainingErrors = errors.length > 3 ? `\n... et ${errors.length - 3} autre(s) erreur(s)` : '';
      
      toast({
        title: `Erreurs (${errors.length} photo(s))`,
        description: errorSummary + remainingErrors,
        variant: 'destructive',
        duration: 10000 // 10 secondes pour lire les erreurs
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg">Déposez les images ici...</p>
        ) : (
          <>
            <p className="text-lg mb-2">Glissez-déposez vos images ici</p>
            <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner</p>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG, WebP • Max 10 MB par image
            </p>
          </>
        )}
      </div>

      {/* Limite */}
      {currentCount + photos.length > maxPhotos * 0.8 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Attention : {currentCount + photos.length} / {maxPhotos} photos
            {currentCount + photos.length >= maxPhotos && ' (limite atteinte)'}
          </AlertDescription>
        </Alert>
      )}

      {/* Prévisualisations */}
      {photos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{photos.length} photo(s) à uploader</h3>
            <Button onClick={uploadPhotos} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upload en cours... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Uploader tout
                </>
              )}
            </Button>
          </div>

          {photos.map((photo, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex gap-4">
                {/* Prévisualisation */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <img
                    src={photo.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Formulaire */}
                <div className="flex-1 space-y-3">
                  {/* Titre */}
                  <div>
                    <Label htmlFor={`title-${index}`}>Titre *</Label>
                    <Input
                      id={`title-${index}`}
                      value={photo.title}
                      onChange={(e) => updatePhoto(index, { title: e.target.value })}
                      placeholder="Ex: Culte de Noël 2024"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor={`desc-${index}`}>Description</Label>
                    <Textarea
                      id={`desc-${index}`}
                      value={photo.description}
                      onChange={(e) => updatePhoto(index, { description: e.target.value })}
                      placeholder="Description de la photo..."
                      rows={2}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <Label htmlFor={`date-${index}`}>Date de la photo</Label>
                    <Input
                      id={`date-${index}`}
                      type="date"
                      value={photo.photoDate}
                      onChange={(e) => updatePhoto(index, { photoDate: e.target.value })}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant={photo.selectedTags.includes(tag.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          style={photo.selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                          onClick={() => toggleTag(index, tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`featured-${index}`}
                      checked={photo.isFeatured}
                      onCheckedChange={(checked) => updatePhoto(index, { isFeatured: !!checked })}
                    />
                    <Label htmlFor={`featured-${index}`} className="cursor-pointer">
                      Mettre en avant (apparaîtra dans le carousel)
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper pour upload vers Storage
async function uploadToStorage(blob: Blob, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    
    console.log(`  📤 Upload: ${path} (${(blob.size / 1024).toFixed(0)} KB)`);
    await uploadBytes(storageRef, blob);
    
    console.log(`  🔗 Récupération URL...`);
    const url = await getDownloadURL(storageRef);
    
    console.log(`  ✅ URL: ${url.substring(0, 60)}...`);
    return url;
  } catch (error) {
    console.error(`  ❌ Échec upload ${path}:`, error);
    throw new Error(`Upload Storage échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}
