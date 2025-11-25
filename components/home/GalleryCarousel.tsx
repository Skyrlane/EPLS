'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { GalleryPhoto } from '@/types';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface GalleryCarouselProps {
  autoPlayInterval?: number; // En millisecondes (défaut: 4000)
  maxPhotos?: number; // Nombre max de photos à charger (défaut: 10)
}

export function GalleryCarousel({ autoPlayInterval = 4000, maxPhotos = 10 }: GalleryCarouselProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  // Charger les photos mises en avant
  useEffect(() => {
    loadFeaturedPhotos();
  }, []);

  const loadFeaturedPhotos = async () => {
    try {
      const photosRef = collection(firestore, 'gallery_photos');
      const q = query(
        photosRef,
        where('isActive', '==', true),
        where('isFeatured', '==', true),
        orderBy('order', 'asc'),
        limit(maxPhotos)
      );
      
      const snap = await getDocs(q);
      const data: GalleryPhoto[] = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        photoDate: doc.data().photoDate?.toDate() || null
      } as GalleryPhoto));

      setPhotos(data);
    } catch (error) {
      console.error('Erreur chargement carousel:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length, autoPlayInterval, goToNext]);

  // Pause au hover
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  if (loading) {
    return (
      <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
    );
  }

  if (photos.length === 0) {
    return null; // Ne rien afficher si pas de photos
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="relative w-full">
      {/* Carousel container */}
      <div
        className="relative w-full aspect-video overflow-hidden rounded-lg shadow-xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Images */}
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={photo.mediumUrl}
              alt={photo.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            
            {/* Overlay avec titre */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{photo.title}</h3>
                {photo.description && (
                  <p className="text-sm text-gray-200 mb-4 line-clamp-2">{photo.description}</p>
                )}
                <Link href="/galerie">
                  <Button variant="secondary" size="sm">
                    Voir toute la galerie
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Boutons navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Bouton play/pause */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        {/* Compteur */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Indicateurs (dots) */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller à la photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
