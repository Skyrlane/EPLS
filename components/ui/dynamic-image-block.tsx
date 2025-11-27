'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { SiteImage } from '@/types';
import { ImageBlock, ImageBlockProps } from './image-block';

interface DynamicImageBlockProps extends Omit<ImageBlockProps, 'src'> {
  zone: string;           // ID de la zone (ex: 'cultes-hero')
  fallbackSrc: string;    // Image par défaut si pas de config Firestore
}

/**
 * Composant d'image dynamique qui charge depuis Firestore
 * Permet de gérer les images du site depuis l'admin
 *
 * @example
 * <DynamicImageBlock
 *   zone="cultes-hero"
 *   fallbackSrc="/placeholder.svg"
 *   alt="Cultes à l'EPLS"
 *   type="hero"
 * />
 */
export function DynamicImageBlock({
  zone,
  fallbackSrc,
  alt,
  ...imageBlockProps
}: DynamicImageBlockProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !firestore) {
      return;
    }

    // Écouter les changements en temps réel depuis Firestore
    const unsubscribe = onSnapshot(
      doc(firestore, 'site_images', zone),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteImage;

          // Utiliser l'image uploadée si elle existe et est active
          if (data.isActive && data.imageUrl) {
            setImageSrc(data.imageUrl);
          } else {
            // Sinon utiliser le fallback défini dans Firestore
            setImageSrc(data.fallbackUrl || fallbackSrc);
          }
        } else {
          // Aucune config Firestore, utiliser le fallback
          setImageSrc(fallbackSrc);
        }
      },
      (error) => {
        console.error(`Erreur listener image zone "${zone}":`, error);
        setImageSrc(fallbackSrc);
      }
    );

    return () => unsubscribe();
  }, [zone, fallbackSrc, mounted]);

  return (
    <ImageBlock
      src={imageSrc}
      alt={alt}
      {...imageBlockProps}
    />
  );
}
