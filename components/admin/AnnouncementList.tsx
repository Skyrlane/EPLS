'use client';

import { useState, useMemo } from 'react';
import type { Announcement } from '@/types';
import {
  isExpired,
  sortAnnouncements,
  formatAnnouncementDate
} from '@/lib/announcements-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Copy,
  Power,
  PowerOff,
  Archive,
  Pin,
  PinOff
} from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onRefresh: () => void;
}

export function AnnouncementList({
  announcements,
  onEdit,
  onRefresh
}: AnnouncementListProps) {
  const { toast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [archiveAllConfirm, setArchiveAllConfirm] = useState(false);

  // Trier les annonces
  const sortedAnnouncements = useMemo(() => {
    return sortAnnouncements(announcements);
  }, [announcements]);

  // Compter les annonces actives expirées
  const expiredCount = useMemo(
    () => announcements.filter(a => a.isActive && isExpired(a.date)).length,
    [announcements]
  );

  // Compter les annonces désactivées
  const inactiveCount = useMemo(
    () => announcements.filter(a => !a.isActive).length,
    [announcements]
  );

  // Dupliquer une annonce
  const handleDuplicate = async (announcement: Announcement) => {
    try {
      // Créer une copie avec une date dans 7 jours
      const newDate = new Date(announcement.date);
      newDate.setDate(newDate.getDate() + 7);

      const docData = {
        ...announcement,
        title: `${announcement.title} (Copie)`,
        date: Timestamp.fromDate(newDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isPinned: false
      };

      // Supprimer l'id pour créer un nouveau document
      delete (docData as any).id;

      const { addDoc, collection } = await import('firebase/firestore');
      await addDoc(collection(firestore, 'announcements'), docData);

      toast({ title: "Succès", description: 'Annonce dupliquée avec succès' });
      onRefresh();
    } catch (error) {
      console.error('Erreur duplication:', error);
      toast({ title: "Erreur", description: 'Erreur lors de la duplication', variant: "destructive" });
    }
  };

  // Activer/Désactiver une annonce
  const handleToggleActive = async (announcement: Announcement) => {
    try {
      const docRef = doc(firestore, 'announcements', announcement.id);
      await updateDoc(docRef, {
        isActive: !announcement.isActive,
        updatedAt: Timestamp.now()
      });

      toast({
        title: "Succès",
        description: announcement.isActive
          ? 'Annonce désactivée'
          : 'Annonce réactivée'
      });
      onRefresh();
    } catch (error) {
      console.error('Erreur toggle active:', error);
      toast({ title: "Erreur", description: 'Erreur lors de la modification', variant: "destructive" });
    }
  };

  // Épingler/Désépingler une annonce
  const handleTogglePin = async (announcement: Announcement) => {
    try {
      const docRef = doc(firestore, 'announcements', announcement.id);
      await updateDoc(docRef, {
        isPinned: !announcement.isPinned,
        updatedAt: Timestamp.now()
      });

      toast({
        title: "Succès",
        description: announcement.isPinned
          ? 'Annonce désépinglée'
          : 'Annonce épinglée'
      });
      onRefresh();
    } catch (error) {
      console.error('Erreur toggle pin:', error);
      toast({ title: "Erreur", description: 'Erreur lors de la modification', variant: "destructive" });
    }
  };

  // Supprimer une annonce
  const handleDelete = async (id: string) => {
    console.log('🗑️ === SUPPRESSION ANNONCE ===');
    console.log('ID:', id);
    
    try {
      if (!id) {
        throw new Error('ID d\'annonce manquant');
      }

      // Vérifier que l'annonce existe
      const docRef = doc(firestore, 'announcements', id);
      const announcementSnap = await getDoc(docRef);

      if (!announcementSnap.exists()) {
        throw new Error('Annonce introuvable');
      }

      const announcementData = announcementSnap.data();
      console.log('Annonce trouvée:', announcementData?.title || 'Sans titre');
      console.log('Status:', announcementData?.isActive ? 'Active' : 'Désactivée');

      // Supprimer le document
      console.log('Tentative de suppression...');
      await deleteDoc(docRef);
      console.log('✅ Annonce supprimée avec succès de Firestore');

      toast({ title: "Succès", description: 'Annonce supprimée avec succès !' });
      
      // Recharger la liste
      console.log('Rechargement de la liste des annonces...');
      onRefresh();
      
    } catch (error: any) {
      console.error('❌ Erreur suppression:', error);
      console.error('Message:', error?.message);
      console.error('Code:', error?.code);
      console.error('Stack:', error?.stack);

      // Message d'erreur plus explicite
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error?.code === 'permission-denied') {
        errorMessage = 'Permission refusée. Vérifiez que vous êtes connecté.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({ 
        title: "Erreur", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Archiver toutes les annonces expirées
  const handleArchiveAll = async () => {
    try {
      const expiredAnnouncements = announcements.filter(a => isExpired(a.date));

      for (const announcement of expiredAnnouncements) {
        const docRef = doc(firestore, 'announcements', announcement.id);
        await updateDoc(docRef, {
          isActive: false,
          updatedAt: Timestamp.now()
        });
      }

      toast({ title: "Succès", description: `${expiredAnnouncements.length} annonce(s) archivée(s)` });
      onRefresh();
    } catch (error) {
      console.error('Erreur archivage:', error);
      toast({ title: "Erreur", description: 'Erreur lors de l\'archivage', variant: "destructive" });
    } finally {
      setArchiveAllConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Annonces ({sortedAnnouncements.length})</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {expiredCount > 0 && `${expiredCount} annonce(s) expirée(s) • `}
                  {inactiveCount > 0 && `${inactiveCount} annonce(s) désactivée(s)`}
                  {expiredCount === 0 && inactiveCount === 0 && 'Toutes les annonces sont à jour'}
                </p>
            </div>

            {expiredCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setArchiveAllConfirm(true)}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archiver toutes les expirées
                </Button>
              )}
          </div>
        </CardHeader>
      </Card>

      {/* Liste des annonces */}
      {sortedAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucune annonce à afficher
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedAnnouncements.map((announcement) => {
            const expired = isExpired(announcement.date);

            return (
              <Card
                key={announcement.id}
                className={`${!announcement.isActive ? 'opacity-50' : ''} ${
                  announcement.isPinned ? 'border-primary' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Titre et badges */}
                      <div className="flex items-start gap-2 flex-wrap">
                        <Badge
                          style={{ backgroundColor: announcement.tagColor }}
                          className="text-white"
                        >
                          {announcement.tag}
                        </Badge>

                        {announcement.isPinned && (
                          <Badge variant="outline" className="border-primary text-primary">
                            <Pin className="mr-1 h-3 w-3" />
                            Épinglé
                          </Badge>
                        )}

                        {expired ? (
                          <Badge variant="secondary" className="bg-gray-500 text-white">
                            Expirée
                          </Badge>
                        ) : announcement.isActive ? (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Désactivée</Badge>
                        )}
                      </div>

                      {/* Titre */}
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>

                      {/* Infos */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatAnnouncementDate(announcement.date)} à {announcement.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-foreground">{announcement.location.name}</p>
                            {announcement.location.address && (
                              <p className="text-xs">{announcement.location.address}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Détails */}
                      {announcement.details && announcement.details.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Détails :</p>
                          <ul className="text-sm text-muted-foreground space-y-0.5 list-disc list-inside">
                            {announcement.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tarification */}
                      {announcement.pricing && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Tarification :</p>
                          <ul className="text-sm text-muted-foreground space-y-0.5">
                            {announcement.pricing.free && <li>• {announcement.pricing.free}</li>}
                            {announcement.pricing.child && <li>• {announcement.pricing.child}</li>}
                            {announcement.pricing.student && <li>• {announcement.pricing.student}</li>}
                            {announcement.pricing.adult && <li>• {announcement.pricing.adult}</li>}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(announcement)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePin(announcement)}
                      >
                        {announcement.isPinned ? (
                          <PinOff className="h-4 w-4" />
                        ) : (
                          <Pin className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(announcement)}
                      >
                        {announcement.isActive ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de confirmation d'archivage multiple */}
      <AlertDialog open={archiveAllConfirm} onOpenChange={setArchiveAllConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver toutes les annonces expirées</AlertDialogTitle>
            <AlertDialogDescription>
              {expiredCount} annonce(s) expirée(s) seront archivées (désactivées). Vous pourrez les réactiver plus tard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveAll}>
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
