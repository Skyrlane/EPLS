'use client';

import { useState, useMemo } from 'react';
import { useRealtimeCollection } from '@/hooks/use-realtime-collection';
import { where } from 'firebase/firestore';
import type { Echo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, FileText } from 'lucide-react';

/**
 * Composant pour afficher les archives des échos avec filtres par année
 * Utilise Firebase pour récupérer les données en temps réel
 */
export function EchoArchivesPage() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Query simplifiée pour éviter les index composites
  const { data: allEchos, loading, error } = useRealtimeCollection<Echo>({
    collectionName: 'echos',
    queryConstraints: [
      where('status', '==', 'published')
    ]
  });

  // Trier les échos côté client
  const echos = useMemo(() => {
    if (!allEchos) return [];
    return [...allEchos].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [allEchos]);

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

  // État de chargement
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Erreur
  if (error) {
    console.error('Erreur EchoArchivesPage:', error);
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Impossible de charger les échos. Veuillez réessayer plus tard.
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs opacity-80">
              Erreur : {error?.message || String(error)}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Aucun écho
  if (!echos || echos.length === 0) {
    return (
      <Alert>
        <AlertDescription className="text-center py-4">
          Aucun écho disponible pour le moment.
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
      {Object.keys(echosByYear)
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
        ))}

      {/* Message si aucun écho pour l'année sélectionnée */}
      {filteredEchos.length === 0 && selectedYear !== 'all' && (
        <Alert>
          <AlertDescription className="text-center py-4">
            Aucun écho disponible pour l'année {selectedYear}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
