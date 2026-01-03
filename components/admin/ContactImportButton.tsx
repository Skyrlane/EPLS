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
import contactData from '@/contacts-data.json';
import type { Contact } from '@/types';

interface ContactImportButtonProps {
  onImportComplete: () => Promise<void>;
  existingContacts: Contact[];
  onImport: (data: any[]) => Promise<{ created: number; errors: number }>;
}

interface ContactDataItem {
  lastName: string;
  firstName: string;
  phoneFixed?: string;
  phoneMobile?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  birthDate?: string;
  isMember: boolean;
}

export function ContactImportButton({
  onImportComplete,
  existingContacts,
  onImport,
}: ContactImportButtonProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    created: number;
    duplicates: number;
    errors: number;
  } | null>(null);

  const handleImport = async () => {
    try {
      setIsImporting(true);

      const data = contactData as { contacts: ContactDataItem[] };
      const total = data.contacts.length;

      // Vérifier les doublons
      const existingSet = new Set(
        existingContacts.map(
          (c) => `${c.firstName.toLowerCase()}-${c.lastName.toLowerCase()}`
        )
      );

      const newContacts: any[] = [];
      let duplicates = 0;

      for (const item of data.contacts) {
        const key = `${item.firstName.toLowerCase()}-${item.lastName.toLowerCase()}`;

        if (existingSet.has(key)) {
          duplicates++;
          console.log(`⚠️ Doublon ignoré: ${item.firstName} ${item.lastName}`);
        } else {
          newContacts.push({
            firstName: item.firstName,
            lastName: item.lastName.toUpperCase(),
            phoneFixed: item.phoneFixed || null,
            phoneMobile: item.phoneMobile || null,
            email: item.email || null,
            address: item.address || null,
            postalCode: item.postalCode || null,
            city: item.city || null,
            birthDate: item.birthDate || null,
            isMember: item.isMember || false,
            isActive: true,
            notes: '',
          });
        }
      }

      // Importer les nouveaux contacts
      let created = 0;
      let errors = 0;

      if (newContacts.length > 0) {
        const result = await onImport(newContacts);
        created = result.created;
        errors = result.errors;
      }

      setImportStats({
        total,
        created,
        duplicates,
        errors,
      });

      toast({
        title: 'Import terminé',
        description: `${created} contacts importés, ${duplicates} doublons ignorés${errors > 0 ? `, ${errors} erreurs` : ''}`,
      });

      await onImportComplete();
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'import des contacts',
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
            <DialogTitle>Importer les contacts</DialogTitle>
            <DialogDescription>
              Cette action va importer les contacts depuis le fichier
              contacts-data.json. Les doublons (même nom + prénom) seront
              automatiquement ignorés.
            </DialogDescription>
          </DialogHeader>

          {importStats ? (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Résumé de l'import :</strong>
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Total dans le fichier : {importStats.total}</li>
                <li className="text-green-600">
                  Nouveaux importés : {importStats.created}
                </li>
                <li className="text-orange-600">
                  Doublons ignorés : {importStats.duplicates}
                </li>
                {importStats.errors > 0 && (
                  <li className="text-red-600">
                    Erreurs : {importStats.errors}
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le fichier contient {(contactData as any).contacts.length} contacts.
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
