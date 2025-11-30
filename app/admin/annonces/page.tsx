'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, Timestamp, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AnnouncementImporter } from '@/components/admin/AnnouncementImporter';
import { AnnouncementList } from '@/components/admin/AnnouncementList';
import { AnnouncementEditModal } from '@/components/admin/AnnouncementEditModal';
import type { Announcement } from '@/lib/announcements-utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminAnnoncesPage() {
  const [currentAnnouncements, setCurrentAnnouncements] = useState<Announcement[]>([]);
  const [expiredAnnouncements, setExpiredAnnouncements] = useState<Announcement[]>([]);
  const [showExpired, setShowExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      
      // Date de référence : début d'aujourd'hui (00:00:00)
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const timestampStartOfToday = Timestamp.fromDate(startOfToday);
      
      console.log('📅 Date de référence (début aujourd\'hui):', startOfToday.toLocaleDateString('fr-FR'));
      
      // 1. ANNONCES ACTUELLES : date >= aujourd'hui ET isActive = true
      const qCurrent = query(
        collection(firestore, 'announcements'),
        where('isActive', '==', true),
        where('date', '>=', timestampStartOfToday),
        orderBy('date', 'asc')
      );
      
      const currentSnap = await getDocs(qCurrent);
      const current: Announcement[] = currentSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          time: data.time || '',
          location: data.location || { name: data.location || '', address: '' },
          type: data.type || 'culte',
          tag: data.tag || 'Culte',
          tagColor: data.tagColor || '#3B82F6',
          details: data.details || [],
          pricing: data.pricing,
          isPinned: data.isPinned ?? false,
          priority: data.priority || 100,
          isActive: data.isActive ?? true,
          status: data.status || 'published',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
        };
      });
      
      console.log('✅ Annonces actuelles:', current.length);
      current.forEach(ann => {
        console.log(`  - ${ann.title}: ${ann.date.toLocaleDateString('fr-FR')}`);
      });
      
      setCurrentAnnouncements(current);
      
      // 2. ANNONCES EXPIRÉES/ARCHIVÉES : 
      //    - date < aujourd'hui (expirées par date)
      //    - OU isActive = false (archivées manuellement)
      
      // 2a. Annonces expirées par date
      const qExpiredByDate = query(
        collection(firestore, 'announcements'),
        where('date', '<', timestampStartOfToday),
        orderBy('date', 'desc')
      );
      
      const expiredByDateSnap = await getDocs(qExpiredByDate);
      const expiredByDate: Announcement[] = expiredByDateSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          time: data.time || '',
          location: data.location || { name: data.location || '', address: '' },
          type: data.type || 'culte',
          tag: data.tag || 'Culte',
          tagColor: data.tagColor || '#3B82F6',
          details: data.details || [],
          pricing: data.pricing,
          isPinned: data.isPinned ?? false,
          priority: data.priority || 100,
          isActive: data.isActive ?? true,
          status: data.status || 'published',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
        };
      });
      
      // 2b. Annonces archivées (isActive = false) avec date future
      const qArchivedFuture = query(
        collection(firestore, 'announcements'),
        where('isActive', '==', false),
        where('date', '>=', timestampStartOfToday),
        orderBy('date', 'desc')
      );
      
      const archivedFutureSnap = await getDocs(qArchivedFuture);
      const archivedFuture: Announcement[] = archivedFutureSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          time: data.time || '',
          location: data.location || { name: data.location || '', address: '' },
          type: data.type || 'culte',
          tag: data.tag || 'Culte',
          tagColor: data.tagColor || '#3B82F6',
          details: data.details || [],
          pricing: data.pricing,
          isPinned: data.isPinned ?? false,
          priority: data.priority || 100,
          isActive: data.isActive ?? true,
          status: data.status || 'published',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
        };
      });
      
      // Merger et dédupliquer (au cas où une annonce serait à la fois expirée et archivée)
      const expiredMap = new Map<string, Announcement>();
      [...expiredByDate, ...archivedFuture].forEach(ann => {
        expiredMap.set(ann.id, ann);
      });
      const expired = Array.from(expiredMap.values()).sort((a, b) => 
        b.date.getTime() - a.date.getTime()
      );
      
      console.log('🕐 Annonces expirées/archivées:', expired.length);
      console.log(`  - Expirées par date: ${expiredByDate.length}`);
      console.log(`  - Archivées (futures): ${archivedFuture.length}`);
      expired.slice(0, 5).forEach(ann => {
        const status = ann.isActive ? 'active' : 'archivée';
        console.log(`  - ${ann.title}: ${ann.date.toLocaleDateString('fr-FR')} (${status})`);
      });
      if (expired.length > 5) {
        console.log(`  ... et ${expired.length - 5} autres`);
      }
      
      setExpiredAnnouncements(expired);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des annonces:', error);
      toast({ title: "Erreur", description: 'Erreur lors du chargement des annonces', variant: "destructive" });
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
      const announcementsToArchive = expiredAnnouncements.filter(
        (a) => a.isActive
      );

      for (const announcement of announcementsToArchive) {
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

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSaved = async () => {
    await loadAnnouncements();
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
            Liste des annonces ({currentAnnouncements.length + expiredAnnouncements.length})
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
                existingAnnouncements={[...currentAnnouncements, ...expiredAnnouncements]}
                onImportComplete={loadAnnouncements}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-6">
            {/* Toggle Actuelles / Expirées */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowExpired(false)}
                variant={!showExpired ? "default" : "outline"}
                className={!showExpired ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                📅 Annonces Actuelles ({currentAnnouncements.length})
              </Button>
              
              <Button
                onClick={() => setShowExpired(true)}
                variant={showExpired ? "default" : "outline"}
                className={showExpired ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                🕐 Annonces Expirées/Archivées ({expiredAnnouncements.length})
              </Button>
            </div>

            {/* Section Annonces Actuelles */}
            {!showExpired && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-600">
                        Annonces Actuelles ({currentAnnouncements.length})
                      </CardTitle>
                      <CardDescription>
                        Annonces à venir (date &gt;= aujourd'hui)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <p>Chargement des annonces...</p>
                    </div>
                  ) : currentAnnouncements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucune annonce actuelle.</p>
                      <p className="text-sm mt-2">
                        Utilisez l'onglet "Import HTML" pour ajouter des annonces.
                      </p>
                    </div>
                  ) : (
                    <AnnouncementList
                      announcements={currentAnnouncements}
                      onEdit={handleEdit}
                      onRefresh={loadAnnouncements}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Section Annonces Expirées */}
            {showExpired && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-orange-600">
                        Annonces Expirées/Archivées ({expiredAnnouncements.length})
                      </CardTitle>
                      <CardDescription>
                        Annonces passées (date &lt; aujourd'hui) ou archivées manuellement
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleBulkArchive}
                      disabled={loading || expiredAnnouncements.filter(a => a.isActive).length === 0}
                    >
                      Archiver toutes les expirées actives
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <p>Chargement des annonces...</p>
                    </div>
                  ) : expiredAnnouncements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucune annonce expirée.</p>
                    </div>
                  ) : (
                    <AnnouncementList
                      announcements={expiredAnnouncements}
                      onEdit={handleEdit}
                      onRefresh={loadAnnouncements}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal d'édition */}
      <AnnouncementEditModal
        announcement={editingAnnouncement}
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSaved={handleSaved}
      />
    </div>
  );
}
