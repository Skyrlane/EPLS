'use client';

import { useRealtimeCollection } from '@/hooks/use-realtime-collection';
import { where } from 'firebase/firestore';
import type { Echo } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileTextIcon, ArrowRightIcon, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useEffect, useState } from 'react';

/**
 * Composant pour afficher l'écho du mois en cours sur la page d'accueil
 * Utilise Firebase pour récupérer l'écho en temps réel
 */
export function CurrentMonthEcho() {
  const [mounted, setMounted] = useState(false);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Query simplifiée pour éviter les index composites
  const { data: allEchos, loading, error } = useRealtimeCollection<Echo>({
    collectionName: 'echos',
    queryConstraints: [
      where('status', '==', 'published')
    ]
  });

  // Si pas encore monté, afficher un skeleton
  if (!mounted) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-9 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Filtrer côté client pour trouver l'écho du mois
  const currentEcho = useMemo(() => {
    if (!allEchos || allEchos.length === 0) return null;

    const monthEchos = allEchos.filter(
      echo => echo.month === currentMonth && echo.year === currentYear
    );

    if (monthEchos.length === 0) return null;

    // Trier par date de publication (le plus récent en premier)
    return monthEchos.sort((a, b) => {
      const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
      const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    })[0];
  }, [allEchos, currentMonth, currentYear]);

  // État de chargement
  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-9 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Erreur
  if (error) {
    console.error('Erreur CurrentMonthEcho:', error);
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>
              Impossible de charger l'écho du mois. Veuillez réessayer plus tard.
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs opacity-80">
                  Erreur : {error?.message || String(error)}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Aucun écho du mois
  if (!currentEcho) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">L'Echo mensuel</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Consultez notre bulletin mensuel avec les dernières nouvelles de l'église
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Alert>
              <AlertDescription className="text-center py-4">
                Aucun écho disponible pour ce mois-ci. Consultez les éditions précédentes dans les archives.
              </AlertDescription>
            </Alert>
            <div className="text-center mt-6">
              <Button asChild variant="outline">
                <Link href="/echo" className="flex items-center gap-2">
                  <ArrowRightIcon className="h-4 w-4" />
                  Voir les archives
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'écho du mois
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">L'Echo mensuel</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Consultez notre bulletin mensuel avec les dernières nouvelles de l'église
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image à gauche */}
              <div className="md:w-1/3">
                {currentEcho.coverImageUrl ? (
                  <img
                    src={currentEcho.coverImageUrl}
                    alt={currentEcho.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <FileTextIcon className="h-20 w-20 text-primary/30" />
                  </div>
                )}
              </div>

              {/* Contenu à droite */}
              <div className="md:w-2/3 p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {currentEcho.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {new Date(0, currentEcho.month - 1).toLocaleDateString('fr-FR', { month: 'long' })} {currentEcho.year}
                </p>
                {currentEcho.description && (
                  <p className="text-foreground mb-8">
                    {currentEcho.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <a
                      href={currentEcho.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      aria-label={`Télécharger ${currentEcho.title}`}
                    >
                      <FileTextIcon className="h-4 w-4" />
                      Télécharger le PDF
                    </a>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href="/echo" className="flex items-center gap-2">
                      <ArrowRightIcon className="h-4 w-4" />
                      Archives
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
