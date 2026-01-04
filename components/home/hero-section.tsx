'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { HeroImageSettings } from '@/types';

import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  initialImageUrl?: string;
}

export function HeroSection({ initialImageUrl = '/images/hero/church-hero.png' }: HeroSectionProps) {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(initialImageUrl);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !firestore) return;

    // Ecouter les changements en temps reel
    const unsubscribe = onSnapshot(
      doc(firestore, 'site_settings', 'hero_image'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as HeroImageSettings;
          setHeroImageUrl(data.imageUrl);
        } else {
          // Fallback si aucune image custom
          setHeroImageUrl('/images/hero/church-hero.png');
        }
      },
      (error) => {
        console.error('Erreur listener hero image:', error);
        // Fallback en cas d'erreur
        setHeroImageUrl('/images/hero/church-hero.png');
      }
    );

    return () => unsubscribe();
  }, [mounted]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <img
        src={heroImageUrl}
        alt="Eglise Protestante Libre de Strasbourg"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-md">
          Eglise Protestante Libre de Strasbourg
        </h1>
        <p className="mt-4 max-w-lg text-lg md:text-xl drop-shadow-md font-medium">
          Une communaute chretienne vivante, enracinee dans la Bible et tournee vers les autres
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full text-base shadow-md">
            <Link href="/notre-eglise">Decouvrir notre eglise</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full text-base shadow-md bg-white/10 border-white text-white hover:bg-white/20">
            <Link href="/culte/calendrier">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Nos activites
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
