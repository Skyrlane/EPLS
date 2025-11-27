'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { HeroImageSettings } from '@/types';
import { ImageBlock } from '@/components/ui/image-block';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [heroImageUrl, setHeroImageUrl] = useState<string>('/images/hero/church-hero.png');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !firestore) return;

    // Écouter les changements en temps réel
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
      <ImageBlock
        src={heroImageUrl}
        alt="Église Protestante Libre de Strasbourg"
        type="hero"
        priority={true}
        width={1920}
        height={780}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 md:bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-md">
          Église Protestante Libre de Strasbourg
        </h1>
        <p className="mt-4 max-w-lg text-lg md:text-xl drop-shadow-md font-medium">
          Une communauté chrétienne vivante, enracinée dans la Bible et tournée vers les autres
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="/notre-eglise">Découvrir notre église</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-full text-base bg-white text-primary hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 shadow-md">
            <Link href="/culte/calendrier">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Nos activités
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
