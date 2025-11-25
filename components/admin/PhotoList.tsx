'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react';
import type { GalleryPhoto, GalleryTag } from '@/types';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface PhotoListProps {
  photos: GalleryPhoto[];
  tags: GalleryTag[];
  onUpdate: () => void;
  onDelete: () => void;
}

export function PhotoList({ photos, tags, onUpdate, onDelete }: PhotoListProps) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');

  const filteredPhotos = photos.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.isActive;
    if (filter === 'inactive') return !p.isActive;
    if (filter === 'featured') return p.isFeatured;
    return p.tags.includes(filter);
  });

  const toggleActive = async (photo: GalleryPhoto) => {
    try {
      const docRef = doc(firestore, 'gallery_photos', photo.id);
      await updateDoc(docRef, { isActive: !photo.isActive });
      toast({ title: 'Succès', description: 'Photo mise à jour' });
      onUpdate();
    } catch (error) {
      console.error('Erreur toggle active:', error);
      toast({ title: 'Erreur', description: 'Impossible de modifier', variant: 'destructive' });
    }
  };

  const toggleFeatured = async (photo: GalleryPhoto) => {
    try {
      const docRef = doc(firestore, 'gallery_photos', photo.id);
      await updateDoc(docRef, { isFeatured: !photo.isFeatured });
      toast({ title: 'Succès', description: 'Photo mise à jour' });
      onUpdate();
    } catch (error) {
      console.error('Erreur toggle featured:', error);
      toast({ title: 'Erreur', description: 'Impossible de modifier', variant: 'destructive' });
    }
  };

  const deletePhoto = async (photo: GalleryPhoto) => {
    if (!confirm(`Supprimer "${photo.title}" ?`)) return;

    try {
      // Extraire les chemins Storage depuis les URLs
      const extractPath = (url: string) => {
        try {
          const urlObj = new URL(url);
          const path = decodeURIComponent(urlObj.pathname.split('/o/')[1]?.split('?')[0] || '');
          return path;
        } catch {
          return '';
        }
      };

      const paths = [
        extractPath(photo.originalUrl),
        extractPath(photo.mediumUrl),
        extractPath(photo.thumbnailUrl)
      ].filter(p => p); // Filtrer les chemins vides

      console.log('🗑️ Suppression fichiers Storage:', paths);

      // Supprimer les fichiers Storage
      await Promise.all(
        paths.map(path => deleteObject(ref(storage, path)).catch(err => {
          console.error(`⚠️ Échec suppression ${path}:`, err);
        }))
      );

      // Supprimer le document Firestore
      await deleteDoc(doc(firestore, 'gallery_photos', photo.id));

      toast({ title: 'Succès', description: 'Photo supprimée' });
      onDelete();
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          Toutes ({photos.length})
        </Button>
        <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')}>
          Actives ({photos.filter(p => p.isActive).length})
        </Button>
        <Button variant={filter === 'featured' ? 'default' : 'outline'} onClick={() => setFilter('featured')}>
          Mises en avant ({photos.filter(p => p.isFeatured).length})
        </Button>
        {tags.map(tag => (
          <Button
            key={tag.id}
            variant={filter === tag.id ? 'default' : 'outline'}
            onClick={() => setFilter(tag.id)}
          >
            {tag.name} ({photos.filter(p => p.tags.includes(tag.id)).length})
          </Button>
        ))}
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhotos.map(photo => {
          const photoTags = tags.filter(t => photo.tags.includes(t.id));
          
          return (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={photo.mediumUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                {!photo.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <h3 className="font-semibold truncate">{photo.title}</h3>
                
                {photo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
                )}

                {photoTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {photoTags.map(tag => (
                      <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(photo)}
                  >
                    {photo.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(photo)}
                  >
                    {photo.isFeatured ? <Star className="h-4 w-4 fill-yellow-400" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePhoto(photo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  {photo.views} vues • {(photo.fileSize / 1024).toFixed(0)} KB
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucune photo dans ce filtre
        </div>
      )}
    </div>
  );
}
