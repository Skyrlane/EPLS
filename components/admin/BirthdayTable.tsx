'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Birthday } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface BirthdayTableProps {
  birthdays: Birthday[];
  onEdit: (birthday: Birthday) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function BirthdayTable({
  birthdays,
  onEdit,
  onDelete,
  onToggleActive,
}: BirthdayTableProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [birthdayToDelete, setBirthdayToDelete] = useState<Birthday | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (birthday: Birthday) => {
    setBirthdayToDelete(birthday);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!birthdayToDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(birthdayToDelete.id);
      toast({
        title: 'Succès',
        description: 'Anniversaire supprimé avec succès',
      });
      setDeleteDialogOpen(false);
      setBirthdayToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (birthday: Birthday) => {
    try {
      await onToggleActive(birthday.id, birthday.isActive);
      toast({
        title: 'Succès',
        description: birthday.isActive 
          ? 'Anniversaire désactivé' 
          : 'Anniversaire activé',
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du changement de statut',
        variant: 'destructive',
      });
    }
  };

  if (birthdays.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun anniversaire enregistré</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {birthdays.map((birthday) => (
              <TableRow key={birthday.id}>
                <TableCell className="font-medium">{birthday.firstName}</TableCell>
                <TableCell>{birthday.lastName}</TableCell>
                <TableCell>
                  {birthday.day} {MONTH_NAMES[birthday.month - 1]}
                </TableCell>
                <TableCell>
                  <Badge variant={birthday.isActive ? 'default' : 'secondary'}>
                    {birthday.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(birthday)}
                      title={birthday.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {birthday.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(birthday)}
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(birthday)}
                      title="Supprimer"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'anniversaire de{' '}
              <strong>
                {birthdayToDelete?.firstName} {birthdayToDelete?.lastName}
              </strong>{' '}
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
