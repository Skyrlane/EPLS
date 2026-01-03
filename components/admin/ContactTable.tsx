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
import { Pencil, Trash2, Eye, EyeOff, Phone, Smartphone, Mail, MapPin } from 'lucide-react';
import type { Contact } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
}

export function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onToggleActive,
}: ContactTableProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(contactToDelete.id);
      toast({
        title: 'Succès',
        description: 'Contact supprimé avec succès',
      });
      setDeleteDialogOpen(false);
      setContactToDelete(null);
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

  const handleToggleActive = async (contact: Contact) => {
    try {
      await onToggleActive(contact.id, contact.isActive);
      toast({
        title: 'Succès',
        description: contact.isActive
          ? 'Contact désactivé'
          : 'Contact activé',
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

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun contact enregistré</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Visibilité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                {/* Nom complet */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="uppercase">{contact.lastName}</span>
                    <span className="text-muted-foreground">{contact.firstName}</span>
                  </div>
                </TableCell>

                {/* Coordonnées de contact */}
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">{contact.email}</span>
                      </div>
                    )}
                    {contact.phoneFixed && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{contact.phoneFixed}</span>
                      </div>
                    )}
                    {contact.phoneMobile && (
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3 text-muted-foreground" />
                        <span>{contact.phoneMobile}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Adresse */}
                <TableCell>
                  {(contact.address || contact.city) && (
                    <div className="flex items-start gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        {contact.address && <span>{contact.address}</span>}
                        {(contact.postalCode || contact.city) && (
                          <span className="text-muted-foreground">
                            {contact.postalCode} {contact.city}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>

                {/* Statut membre */}
                <TableCell>
                  {contact.isMember && (
                    <Badge variant="default" className="bg-green-600">
                      Membre
                    </Badge>
                  )}
                </TableCell>

                {/* Visibilité */}
                <TableCell>
                  <Badge variant={contact.isActive ? 'default' : 'secondary'}>
                    {contact.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(contact)}
                      title={contact.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {contact.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contact)}
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(contact)}
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
              Êtes-vous sûr de vouloir supprimer le contact de{' '}
              <strong>
                {contactToDelete?.firstName} {contactToDelete?.lastName}
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
