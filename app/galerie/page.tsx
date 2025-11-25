'use client';

import Link from "next/link"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { GalleryPhoto, GalleryTag } from '@/types'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import 'yet-another-react-lightbox/styles.css'

// Metadata supprimée (incompatible avec 'use client')

// Images de démonstration 
const galleryCategories = [
  {
    id: "cultes",
    name: "Cultes",
    images: [
      {
        id: 1,
        src: "/images/messages/grace.jpg",
        alt: "Culte dominical",
        description: "Notre assemblée lors d'un culte dominical",
        category: "Cultes",
        credit: "EPLS"
      },
      {
        id: 2,
        src: "/images/messages/foi.jpg",
        alt: "Louange pendant le culte",
        description: "Moment de louange pendant notre service",
        category: "Cultes",
        credit: "EPLS"
      },
      {
        id: 3,
        src: "/images/messages/evangile.jpg",
        alt: "Prédication du pasteur",
        description: "Notre pasteur lors d'une prédication",
        category: "Cultes",
        credit: "EPLS"
      },
    ],
  },
  {
    id: "evenements",
    name: "Événements",
    images: [
      {
        id: 4,
        src: "/images/messages/grace.jpg",
        alt: "Fête de Noël",
        description: "Célébration de Noël avec la communauté",
        category: "Événements",
        credit: "EPLS"
      },
      {
        id: 5,
        src: "/images/messages/foi.jpg",
        alt: "Repas communautaire",
        description: "Partage d'un repas après le culte",
        category: "Événements",
        credit: "EPLS"
      },
      {
        id: 6,
        src: "/images/messages/evangile.jpg",
        alt: "Étude biblique",
        description: "Groupe d'étude biblique hebdomadaire",
        category: "Événements",
        credit: "EPLS"
      },
    ],
  },
  {
    id: "jeunesse",
    name: "Jeunesse",
    images: [
      {
        id: 7,
        src: "/images/messages/esperance.jpg",
        alt: "Groupe de jeunes",
        description: "Rencontre du groupe de jeunes",
        category: "Jeunesse",
        credit: "EPLS"
      },
      {
        id: 8,
        src: "/images/messages/foi.jpg",
        alt: "Camp d'été",
        description: "Activités lors du camp d'été",
        category: "Jeunesse",
        credit: "EPLS"
      },
      {
        id: 9,
        src: "/images/messages/grace.jpg",
        alt: "École du dimanche",
        description: "Moment d'apprentissage à l'école du dimanche",
        category: "Jeunesse",
        credit: "EPLS"
      },
    ],
  },
  {
    id: "batiment",
    name: "Notre bâtiment",
    images: [
      {
        id: 10,
        src: "/images/hero/church-hero.png",
        alt: "Façade de l'église",
        description: "Vue extérieure de notre bâtiment",
        category: "Notre bâtiment",
        credit: "EPLS"
      },
      {
        id: 11,
        src: "/images/histoire/eglise-histoire.jpg",
        alt: "Salle principale",
        description: "Notre salle de culte",
        category: "Notre bâtiment",
        credit: "EPLS"
      },
      {
        id: 12,
        src: "/images/hero/culte-hero.png",
        alt: "Salle de réunion",
        description: "Espace pour les rencontres et études",
        category: "Notre bâtiment",
        credit: "EPLS"
      },
    ],
  },
]

export default function GaleriePhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [tags, setTags] = useState<GalleryTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      // Charger les tags
      const tagsRef = collection(firestore, 'gallery_tags');
      const tagsSnap = await getDocs(query(tagsRef, orderBy('name')));
      const tagsData: GalleryTag[] = tagsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as GalleryTag));
      setTags(tagsData);

      // Charger les photos actives
      const photosRef = collection(firestore, 'gallery_photos');
      const photosQuery = query(
        photosRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const photosSnap = await getDocs(photosQuery);
      const photosData: GalleryPhoto[] = photosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        photoDate: doc.data().photoDate?.toDate() || null
      } as GalleryPhoto));
      
      setPhotos(photosData);
    } catch (error) {
      console.error('Erreur chargement galerie:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = selectedTag === 'all'
    ? photos
    : photos.filter(p => p.tags.includes(selectedTag));

  const lightboxSlides = filteredPhotos.map(p => ({
    src: p.mediumUrl,
    title: p.title,
    description: p.description
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">Chargement de la galerie...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Galerie Photos</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span>Galerie Photos</span>
        </div>
      </header>

      {/* Filtres par tags */}
      <div className="mb-8">
        <Tabs value={selectedTag} onValueChange={setSelectedTag} className="w-full">
          <TabsList className="w-full justify-start mb-8 overflow-x-auto">
            <TabsTrigger value="all">Toutes ({photos.length})</TabsTrigger>
            {tags.map(tag => {
              const count = photos.filter(p => p.tags.includes(tag.id)).length;
              return (
                <TabsTrigger key={tag.id} value={tag.id}>
                  {tag.name} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Grille de photos (masonry layout) */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-4 group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <img
                src={photo.mediumUrl}
                alt={photo.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay au survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-sm text-gray-200 line-clamp-2">{photo.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl mb-2">Aucune photo dans cette catégorie</p>
          <p className="text-sm">Revenez bientôt, nous ajoutons régulièrement de nouvelles photos !</p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Fullscreen]}
        carousel={{ finite: false }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true
        }}
      />
    </div>
  );
} 