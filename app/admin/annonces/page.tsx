'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
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
    console.log('🔍 === CHARGEMENT ANNONCES ADMIN ===');
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(firestore, 'announcements'));
      const loadedAnnouncements: Announcement[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Convertir Timestamp en Date
        const dateValue = data.date?.toDate ? data.date.toDate() : new Date(data.date);
        const createdAtValue = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        const updatedAtValue = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();
        
        loadedAnnouncements.push({
          id: doc.id,
          title: data.title,
          date: dateValue,
          time: data.time || '',
          location: data.location || { name: data.location || '', address: '' },
          type: data.type || 'culte',
          tag: data.tag || 'Culte',
          tagColor: data.tagColor || '#3B82F6',
          details: data.details || [],
          pricing: data.pricing,
          isPinned: data.isPinned ?? false,
          priority: data.priority || 100,
          isActive: data.isActive ?? true, // ✅ Utiliser isActive
          status: data.status || 'published',
          createdAt: createdAtValue,
          updatedAt: updatedAtValue
        });
      });

      // Trier : épinglées d'abord, puis par priorité, puis par date
      loadedAnnouncements.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.date.getTime() - b.date.getTime();
      });

      // Logs de debug
      const activeAnnouncements = loadedAnnouncements.filter(a => a.isActive);
      const inactiveAnnouncements = loadedAnnouncements.filter(a => !a.isActive);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentAnnouncements = activeAnnouncements.filter(a => a.date >= today);
      const expiredAnnouncements = activeAnnouncements.filter(a => a.date < today);

      console.log('📊 Résumé des annonces :');
      console.log(`  Total : ${loadedAnnouncements.length}`);
      console.log(`  ✅ Actives : ${activeAnnouncements.length}`);
      console.log(`    - Actuelles (date >= aujourd'hui) : ${currentAnnouncements.length}`);
      console.log(`    - Expirées (date < aujourd'hui) : ${expiredAnnouncements.length}`);
      console.log(`  ❌ Désactivées : ${inactiveAnnouncements.length}`);

      // Détail des annonces désactivées
      if (inactiveAnnouncements.length > 0) {
        console.log('\n⚠ Annonces désactivées (ne devraient PAS être dans "Annonces Actuelles") :');
        inactiveAnnouncements.forEach(a => {
          console.log(`  - ${a.title} (${a.date.toLocaleDateString()})`);
        });
      }

      setAnnouncements(loadedAnnouncements);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      toast({ title: "Erreur", description: '$1', variant: "destructive" });
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

      toast({ title: "Succès", description: `$1` });
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
      toast({ title: "Succès", description: '$1' });
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({ title: "Erreur", description: '$1', variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'announcements', id));
      toast({ title: "Succès", description: '$1' });
      await loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({ title: "Erreur", description: '$1', variant: "destructive" });
    }
  };

  const handleBulkArchive = async () => {
    try {
      const now = new Date();
      const expiredAnnouncements = announcements.filter(
        (a) => a.date < now && a.isActive
      );

      for (const announcement of expiredAnnouncements) {
        await updateDoc(doc(firestore, 'announcements', announcement.id), {
          isActive: false,
          updatedAt: Timestamp.now()
        });
      }

      toast({ title: "Succès", description: `$1` });
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
                onImportComplete={loadAnnouncements}
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
