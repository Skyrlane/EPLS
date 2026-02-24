'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Echo } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileTextIcon, ArrowRightIcon } from 'lucide-react';

/**
 * Composant securise pour afficher l'echo du mois en cours
 * Ne bloque jamais le rendu de la page, meme en cas d'erreur
 */
export function CurrentMonthEchoSafe() {
  const [echos, setEchos] = useState<Echo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    setMounted(true);

    async function fetchEchos() {
      try {
        // Verifier que Firebase est initialise
        if (!firestore) {
          throw new Error('Firebase non configure');
        }

        const echosRef = collection(firestore, 'echos');
        const q = query(echosRef, where('status', '==', 'published'));
        const snapshot = await getDocs(q);

        const fetchedEchos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Echo[];

        setEchos(fetchedEchos);
        setLoading(false);
      } catch (err: any) {
        console.error('Erreur chargement echos:', err);
        setError(err?.message || 'Erreur inconnue');
        setLoading(false);
      }
    }

    fetchEchos();
  }, []);

  // Trouver l'echo du mois actuel
  const currentEcho = useMemo(() => {
    if (!echos || echos.length === 0) return null;

    const monthEchos = echos.filter(
      echo => echo.month === currentMonth && echo.year === currentYear
    );

    if (monthEchos.length === 0) return null;

    return monthEchos.sort((a, b) => {
      const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
      const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    })[0];
  }, [echos, currentMonth, currentYear]);

  // Loading skeleton
  if (!mounted || loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">L'Echo mensuel</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Chargement...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si erreur ou pas d'echo, ne rien afficher (ne pas bloquer la page)
  if (error || !currentEcho) {
    return null;
  }

  // Affichage de l'echo du mois
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">L'Echo mensuel</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Consultez notre bulletin mensuel avec les dernieres nouvelles de l'eglise
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image a gauche */}
              <div className="md:w-1/3">
                <img
                  src={currentEcho.coverImageUrl || currentEcho.coverUrl || "/images/echo/default-cover.svg"}
                  alt={currentEcho.title}
                  className="w-full h-full object-cover min-h-[300px]"
                />
              </div>

              {/* Contenu a droite */}
              <div className="md:w-2/3 p-8">
                <h3 className="text-2xl font-bold mb-2">
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
                      aria-label={`Telecharger ${currentEcho.title}`}
                    >
                      <FileTextIcon className="h-4 w-4" />
                      Telecharger le PDF
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
