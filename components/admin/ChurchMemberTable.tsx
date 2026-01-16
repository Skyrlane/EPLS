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
import { Pencil, Trash2, Eye, EyeOff, Shield, User, Archive, BookUser } from 'lucide-react';
import type { ChurchMember } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ChurchMemberTableProps {
  members: ChurchMember[];
  onEdit: (member: ChurchMember) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  showStatus?: boolean;
}

const STATUS_CONFIG = {
  actif: { label: 'Actif', variant: 'default' as const, icon: User },
  conseil: { label: 'Conseil', variant: 'default' as const, icon: Shield },
  archive: { label: 'Archivé', variant: 'secondary' as const, icon: Archive },
};

export function ChurchMemberTable({
  members,
  onEdit,
  onDelete,
  onToggleActive,
  showStatus = true,
}: ChurchMemberTableProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<ChurchMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (member: ChurchMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(memberToDelete.id);
      toast({
        title: 'Succès',
        description: 'Membre supprimé avec succès',
      });
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
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

  const handleToggleActive = async (member: ChurchMember) => {
    try {
      await onToggleActive(member.id, member.isActive);
      toast({
        title: 'Succès',
        description: member.isActive
          ? 'Membre masqué'
          : 'Membre visible',
      });
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du changement de visibilité',
        variant: 'destructive',
      });
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun membre dans cette catégorie</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nom</TableHead>
              {showStatus && <TableHead>Statut</TableHead>}
              <TableHead>Fonction / Observations</TableHead>
              <TableHead>Visibilité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => {
              const statusConfig = STATUS_CONFIG[member.status];
              const StatusIcon = statusConfig.icon;
              // Détecter si le membre vient du carnet d'adresses
              const isFromCarnet = member.id.startsWith('contact-');

              return (
                <TableRow key={member.id}>
                  {/* Ordre */}
                  <TableCell className="text-muted-foreground text-sm">
                    {isFromCarnet ? (
                      <span title="Provient du carnet d'adresses">
                        <BookUser className="h-4 w-4 text-blue-500" />
                      </span>
                    ) : (
                      member.ordre || index + 1
                    )}
                  </TableCell>

                  {/* Nom complet */}
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="uppercase">{member.lastName}</span>
                      <span className="text-muted-foreground">{member.firstName}</span>
                    </div>
                  </TableCell>

                  {/* Statut */}
                  {showStatus && (
                    <TableCell>
                      <Badge variant={statusConfig.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                  )}

                  {/* Fonction ou observations */}
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {member.status === 'conseil' && member.conseilFunction && (
                        <Badge variant="outline" className="w-fit">
                          {member.conseilFunction}
                        </Badge>
                      )}
                      {member.status === 'archive' && (
                        <>
                          {member.observations && (
                            <span className="text-muted-foreground">
                              {member.observations}
                            </span>
                          )}
                          {member.dateRadiation && (
                            <span className="text-destructive text-xs">
                              {member.dateRadiation}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>

                  {/* Visibilité */}
                  <TableCell>
                    <Badge variant={member.isActive ? 'default' : 'secondary'}>
                      {member.isActive ? 'Visible' : 'Masqué'}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {isFromCarnet ? (
                      <span className="text-xs text-muted-foreground italic">
                        Via carnet d&apos;adresses
                      </span>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(member)}
                          title={member.isActive ? 'Masquer' : 'Rendre visible'}
                        >
                          {member.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(member)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(member)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong>
                {memberToDelete?.firstName} {memberToDelete?.lastName}
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
