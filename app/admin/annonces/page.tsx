'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AnnouncementImporter } from '@/components/admin/AnnouncementImporter';
import { AnnouncementList } from '@/components/admin/AnnouncementList';
import type { Announcement } from '@/lib/announcements-utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminAnnoncesPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?callbackUrl=/admin/annonces');
    }
  }, [user, authLoading, router]);

  // Charger les annonces depuis Firestore
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(firestore, 'announcements'));
      const loadedAnnouncements: Announcement[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedAnnouncements.push({
          id: doc.id,
          title: data.title,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          time: data.time || '',
          location: data.location || '',
          type: data.type || 'event',
          details: data.details || '',
          pricing: data.pricing || '',
          active: data.active ?? true,
          pinned: data.pinned ?? false,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        });
      });

      // Trier : épinglées d'abord, puis par date
      loadedAnnouncements.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.date.getTime() - a.date.getTime();
      });

      setAnnouncements(loadedAnnouncements);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (newAnnouncements: Omit<Announcement, 'id' | 'createdAt'>[]) => {
    try {
      const importedCount = newAnnouncements.length;

      // Ajouter chaque annonce à Firestore
      for (const announcement of newAnnouncements) {
        const docRef = doc(collection(firestore, 'announcements'));
        await setDoc(docRef, {
          ...announcement,
          createdAt: new Date(),
          active: announcement.active ?? true,
          pinned: announcement.pinned ?? false,
        });
      }

      toast.success(`${importedCount} annonce(s) importée(s) avec succès`);
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      toast.error('Erreur lors de l\'importation des annonces');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Announcement>) => {
    try {
      const docRef = doc(firestore, 'announcements', id);
      await updateDoc(docRef, updates as any);
      toast.success('Annonce mise à jour');
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'announcements', id));
      toast.success('Annonce supprimée');
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleBulkArchive = async () => {
    try {
      const now = new Date();
      const expiredAnnouncements = announcements.filter(
        (a) => a.date < now && a.active
      );

      for (const announcement of expiredAnnouncements) {
        await updateDoc(doc(firestore, 'announcements', announcement.id), {
          active: false,
        });
      }

      toast.success(`${expiredAnnouncements.length} annonce(s) archivée(s)`);
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast.error('Erreur lors de l\'archivage');
    }
  };

  // Si en cours de chargement auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  // Si pas connecté
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Administration des Annonces</h1>
          <p className="text-muted-foreground">
            Gérez les annonces affichées sur le site EPLS
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/membres">← Retour à l'espace membres</Link>
        </Button>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import HTML</TabsTrigger>
          <TabsTrigger value="list">
            Liste des annonces ({announcements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Importer des annonces depuis HTML</CardTitle>
              <CardDescription>
                Collez le code HTML contenant les annonces. Le système détectera
                automatiquement les doublons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementImporter
                existingAnnouncements={announcements}
                onImport={handleImport}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Annonces existantes</CardTitle>
                  <CardDescription>
                    Gérez les annonces : éditer, épingler, activer/désactiver,
                    supprimer
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBulkArchive}
                  disabled={loading}
                >
                  Archiver les annonces expirées
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Chargement des annonces...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucune annonce pour le moment.</p>
                  <p className="text-sm mt-2">
                    Utilisez l'onglet "Import HTML" pour ajouter des annonces.
                  </p>
                </div>
              ) : (
                <AnnouncementList
                  announcements={announcements}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
