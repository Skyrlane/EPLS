'use client';

import { useState } from 'react';
import { Download, FileWarning, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
  fileSize?: number;
  className?: string;
}

/**
 * Composant pour afficher et télécharger des PDFs
 * - Desktop : Viewer inline avec iframe
 * - Mobile : Bouton de téléchargement
 * - Affiche un warning si le fichier est > 5MB
 */
export function PdfViewer({ pdfUrl, title = 'Document PDF', fileSize, className }: PdfViewerProps) {
  const [viewerError, setViewerError] = useState(false);

  // Convertir la taille du fichier en MB
  const fileSizeMB = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) : null;
  const isLargeFile = fileSize && fileSize > 5 * 1024 * 1024; // > 5MB

  // Détection mobile simple (côté client)
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    setIsMobile(window.innerWidth < 768);
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Warning pour les gros fichiers */}
      {isLargeFile && (
        <Alert variant="default" className="border-secondary bg-secondary/20">
          <FileWarning className="h-4 w-4 text-secondary-foreground" />
          <AlertTitle className="text-secondary-foreground">Fichier volumineux</AlertTitle>
          <AlertDescription className="text-secondary-foreground/80">
            Ce PDF fait {fileSizeMB} MB. Le téléchargement peut prendre quelques instants.
          </AlertDescription>
        </Alert>
      )}

      {/* Boutons d'action */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="default" size="default">
          <a
            href={pdfUrl}
            download
            aria-label={`Télécharger ${title}`}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger
            {fileSizeMB && <span className="text-xs opacity-80">({fileSizeMB} MB)</span>}
          </a>
        </Button>

        <Button asChild variant="outline" size="default">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ouvrir ${title} dans un nouvel onglet`}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir dans un nouvel onglet
          </a>
        </Button>
      </div>

      {/* Viewer PDF (desktop uniquement) */}
      {!isMobile && !viewerError && (
        <div className="border rounded-lg overflow-hidden bg-muted">
          <iframe
            src={pdfUrl}
            className="w-full h-[800px]"
            title={title}
            onError={() => setViewerError(true)}
            aria-label={`Aperçu de ${title}`}
          />
        </div>
      )}

      {/* Fallback si erreur du viewer */}
      {viewerError && (
        <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Impossible d'afficher le PDF</AlertTitle>
          <AlertDescription>
            Veuillez télécharger le fichier ou l'ouvrir dans un nouvel onglet.
          </AlertDescription>
        </Alert>
      )}

      {/* Message mobile */}
      {isMobile && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Utilisez les boutons ci-dessus pour consulter le PDF.
        </div>
      )}
    </div>
  );
}
