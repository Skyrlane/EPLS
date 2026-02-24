'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Echo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar } from 'lucide-react';

/**
 * Composant sécurisé pour afficher les archives des échos
 * Ne bloque jamais le rendu, même en cas d'erreur Firebase
 */
export function EchoArchivesPageSafe() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [echos, setEchos] = useState<Echo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEchos() {
      try {
        if (!firestore) {
          throw new Error('Firebase non configuré');
        }

        const echosRef = collection(firestore, 'echos');
        const q = query(echosRef, where('status', '==', 'published'));
        const snapshot = await getDocs(q);

        const fetchedEchos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Echo[];

        // Trier par année et mois (décroissant)
        const sorted = fetchedEchos.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        });

        setEchos(sorted);
        setLoading(false);
      } catch (err: any) {
        console.error('Erreur chargement échos:', err);
        setError(err?.message || 'Erreur inconnue');
        setLoading(false);
      }
    }

    fetchEchos();
  }, []);

  // Extraire les années disponibles
  const availableYears = useMemo(() => {
    if (!echos) return [];
    const years = [...new Set(echos.map(echo => echo.year))];
    return years.sort((a, b) => b - a);
  }, [echos]);

  // Filtrer les échos par année
  const filteredEchos = useMemo(() => {
    if (!echos) return [];
    if (selectedYear === 'all') return echos;
    return echos.filter(echo => echo.year === selectedYear);
  }, [echos, selectedYear]);

  // Grouper les échos par année
  const echosByYear = useMemo(() => {
    const grouped: Record<number, Echo[]> = {};
    filteredEchos.forEach(echo => {
      if (!grouped[echo.year]) {
        grouped[echo.year] = [];
      }
      grouped[echo.year].push(echo);
    });
    return grouped;
  }, [filteredEchos]);

  // Formater la taille du fichier
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  };

  // Loading
  if (loading) {
    return (
      <Alert>
        <AlertDescription className="text-center py-4">
          Chargement des échos...
        </AlertDescription>
      </Alert>
    );
  }

  // Erreur ou pas d'échos
  if (error || !echos || echos.length === 0) {
    return (
      <Alert>
        <AlertDescription className="text-center py-4">
          {error ? (
            <>
              Une erreur est survenue. Veuillez réessayer plus tard.
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs opacity-80">
                  Erreur : {error}
                </div>
              )}
            </>
          ) : (
            'Aucun écho disponible pour le moment. Consultez le guide SETUP_ECHOS.md pour ajouter des données.'
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filtres par année */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer par année</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedYear === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedYear('all')}
              size="default"
            >
              Toutes les années
            </Button>
            {availableYears.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                onClick={() => setSelectedYear(year)}
                size="default"
              >
                {year}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des échos par année */}
      {Object.keys(echosByYear).length > 0 ? (
        Object.keys(echosByYear)
          .map(Number)
          .sort((a, b) => b - a)
          .map(year => (
            <Card key={year}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Échos EPLS {year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {echosByYear[year]
                    .sort((a, b) => b.month - a.month)
                    .map(echo => (
                      <div
                        key={echo.id}
                        className="border-l-4 border-primary pl-4 py-3 hover:bg-muted transition-colors rounded-r"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="hidden sm:block flex-shrink-0 w-16 h-[90px] rounded overflow-hidden bg-muted">
                            <img
                              src={echo.coverImageUrl || echo.coverUrl || "/images/echo/default-cover.svg"}
                              alt={`Couverture ${echo.title}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{echo.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(0, echo.month - 1).toLocaleDateString('fr-FR', { month: 'long' })} {echo.year}
                            </p>
                            {echo.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {echo.description}
                              </p>
                            )}
                            {echo.fileSize && (
                              <Badge variant="secondary" className="text-xs">
                                {formatFileSize(echo.fileSize)}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <a
                                href={echo.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Télécharger ${echo.title}`}
                              >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">PDF</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))
      ) : (
        <Alert>
          <AlertDescription className="text-center py-4">
            Aucun écho disponible pour l'année {selectedYear}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
