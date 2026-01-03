'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import birthdayData from '@/anniversaires-data.json';
import type { Birthday } from '@/types';

interface BirthdayImportButtonProps {
  onImportComplete: () => Promise<void>;
  existingBirthdays: Birthday[];
  onImport: (data: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
}

interface BirthdayDataItem {
  jour: number;
  mois: number;
  nom: string;
  prenom: string;
}

export function BirthdayImportButton({
  onImportComplete,
  existingBirthdays,
  onImport,
}: BirthdayImportButtonProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    new: number;
    duplicates: number;
  } | null>(null);

  const handleImport = async () => {
    try {
      setIsImporting(true);

      const data = birthdayData as { anniversaires: BirthdayDataItem[] };
      const total = data.anniversaires.length;

      // Vérifier les doublons
      const existingSet = new Set(
        existingBirthdays.map(
          (b) => `${b.firstName.toLowerCase()}-${b.lastName.toLowerCase()}-${b.day}-${b.month}`
        )
      );

      const newBirthdays: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      let duplicates = 0;

      for (const item of data.anniversaires) {
        const key = `${item.prenom.toLowerCase()}-${item.nom.toLowerCase()}-${item.jour}-${item.mois}`;
        
        if (existingSet.has(key)) {
          duplicates++;
        } else {
          newBirthdays.push({
            firstName: item.prenom,
            lastName: item.nom,
            day: item.jour,
            month: item.mois,
            isActive: true,
          });
        }
      }

      // Importer les nouveaux anniversaires
      if (newBirthdays.length > 0) {
        await onImport(newBirthdays);
      }

      setImportStats({
        total,
        new: newBirthdays.length,
        duplicates,
      });

      toast({
        title: 'Import terminé',
        description: `${newBirthdays.length} anniversaires importés, ${duplicates} doublons ignorés`,
      });

      await onImportComplete();
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'import des anniversaires',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} variant="outline">
        <Upload className="mr-2 h-4 w-4" />
        Importer les données initiales
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer les anniversaires</DialogTitle>
            <DialogDescription>
              Cette action va importer les anniversaires depuis le fichier
              anniversaires-data.json. Les doublons seront automatiquement ignorés.
            </DialogDescription>
          </DialogHeader>

          {importStats ? (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Résumé de l'import :</strong>
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Total dans le fichier : {importStats.total}</li>
                <li className="text-green-600">Nouveaux importés : {importStats.new}</li>
                <li className="text-orange-600">Doublons ignorés : {importStats.duplicates}</li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le fichier contient {(birthdayData as any).anniversaires.length} anniversaires.
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setImportStats(null);
              }}
            >
              {importStats ? 'Fermer' : 'Annuler'}
            </Button>
            {!importStats && (
              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? 'Import en cours...' : 'Importer'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
