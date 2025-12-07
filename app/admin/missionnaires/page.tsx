'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Missionary, Newsletter } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, FileText, Upload, X, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function MissionnairesAdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // États
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulaire
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState<string[]>(['']);
  const [imageZone, setImageZone] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  // Upload PDF
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [newNewsletterTitle, setNewNewsletterTitle] = useState('');
  const [newNewsletterFile, setNewNewsletterFile] = useState<File | null>(null);

  // Charger les missionnaires
  useEffect(() => {
    loadMissionaries();
  }, []);

  async function loadMissionaries() {
    try {
      setLoading(true);
      const missionariesRef = collection(firestore, 'missionaries');
      const snapshot = await getDocs(missionariesRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        newsletters: doc.data().newsletters?.map((n: any) => ({
          ...n,
          uploadedAt: n.uploadedAt?.toDate() || new Date()
        })) || []
      })) as Missionary[];
      
      // Trier par date de création (plus récent en premier)
      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setMissionaries(data);
    } catch (error) {
      console.error('Erreur chargement missionnaires:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les missionnaires',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  // Générer le slug depuis le nom
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Auto-générer le slug quand le nom change
  useEffect(() => {
    if (name && !editingId) {
      setSlug(generateSlug(name));
    }
  }, [name, editingId]);

  // Nouvelle entrée
  function handleNew() {
    resetForm();
    setIsFormOpen(true);
  }

  // Éditer
  function handleEdit(missionary: Missionary) {
    setEditingId(missionary.id);
    setName(missionary.name);
    setSlug(missionary.slug);
    setLocation(missionary.location);
    setDescription(missionary.description);
    setActivities(missionary.activities.length > 0 ? missionary.activities : ['']);
    setImageZone(missionary.imageZone || '');
    setYoutubeUrl(missionary.youtubeUrl || '');
    setIsActive(missionary.isActive);
    setNewsletters(missionary.newsletters || []);
    setIsFormOpen(true);
  }

  // Sauvegarder
  async function handleSave() {
    if (!name || !slug || !location || !description) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Non authentifié',
        description: 'Vous devez être connecté',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Filtrer les activités vides
      const filteredActivities = activities.filter(a => a.trim() !== '');

      const missionaryData = {
        name,
        slug,
        location,
        description,
        activities: filteredActivities,
        imageZone: imageZone || null,
        youtubeUrl: youtubeUrl || null,
        isActive,
        newsletters,
        updatedAt: Timestamp.now(),
      };

      if (editingId) {
        // Mise à jour
        const missionaryRef = doc(firestore, 'missionaries', editingId);
        await updateDoc(missionaryRef, missionaryData);
        toast({
          title: 'Missionnaire mis à jour',
          description: `${name} a été mis à jour avec succès`
        });
      } else {
        // Création
        const missionariesRef = collection(firestore, 'missionaries');
        await addDoc(missionariesRef, {
          ...missionaryData,
          createdAt: Timestamp.now(),
          createdBy: user.uid,
          createdByName: user.displayName || user.email
        });
        toast({
          title: 'Missionnaire créé',
          description: `${name} a été créé avec succès`
        });
      }

      resetForm();
      setIsFormOpen(false);
      loadMissionaries();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le missionnaire',
        variant: 'destructive'
      });
    }
  }

  // Supprimer
  async function handleDelete(missionary: Missionary) {
    if (!confirm(`Supprimer "${missionary.name}" ?\n\nCette action supprimera également tous les PDFs associés.`)) {
      return;
    }

    try {
      // Supprimer les PDFs de Storage
      for (const newsletter of missionary.newsletters) {
        if (newsletter.pdfPath) {
          const pdfRef = ref(storage, newsletter.pdfPath);
          await deleteObject(pdfRef).catch(() => {
            console.warn(`PDF déjà supprimé: ${newsletter.pdfPath}`);
          });
        }
      }

      // Supprimer le document Firestore
      const missionaryRef = doc(firestore, 'missionaries', missionary.id);
      await deleteDoc(missionaryRef);

      toast({
        title: 'Missionnaire supprimé',
        description: `${missionary.name} a été supprimé`
      });

      loadMissionaries();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le missionnaire',
        variant: 'destructive'
      });
    }
  }

  // Upload PDF
  async function handleUploadNewsletter() {
    if (!newNewsletterFile || !newNewsletterTitle || !editingId) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez remplir le titre et sélectionner un fichier PDF',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploadingPdf(true);

      // Upload dans Storage
      const timestamp = Date.now();
      const storagePath = `missionaries/${editingId}/newsletters/${timestamp}_${newNewsletterFile.name}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, newNewsletterFile);
      const pdfUrl = await getDownloadURL(storageRef);

      // Créer l'objet newsletter
      const newsletter: Newsletter = {
        id: `newsletter_${timestamp}`,
        title: newNewsletterTitle,
        pdfUrl,
        pdfPath: storagePath,
        uploadedAt: new Date()
      };

      // Ajouter aux newsletters locales
      const updatedNewsletters = [...newsletters, newsletter];
      setNewsletters(updatedNewsletters);

      // Mettre à jour Firestore
      const missionaryRef = doc(firestore, 'missionaries', editingId);
      await updateDoc(missionaryRef, {
        newsletters: updatedNewsletters.map(n => ({
          ...n,
          uploadedAt: Timestamp.fromDate(n.uploadedAt)
        }))
      });

      toast({
        title: 'PDF uploadé',
        description: `${newNewsletterTitle} a été ajouté`
      });

      // Reset
      setNewNewsletterTitle('');
      setNewNewsletterFile(null);
      loadMissionaries();
    } catch (error) {
      console.error('Erreur upload PDF:', error);
      toast({
        title: 'Erreur upload',
        description: 'Impossible d\'uploader le PDF',
        variant: 'destructive'
      });
    } finally {
      setUploadingPdf(false);
    }
  }

  // Supprimer un newsletter
  async function handleDeleteNewsletter(newsletterId: string) {
    if (!confirm('Supprimer ce PDF ?')) return;

    try {
      const newsletter = newsletters.find(n => n.id === newsletterId);
      if (!newsletter) return;

      // Supprimer de Storage
      if (newsletter.pdfPath) {
        const pdfRef = ref(storage, newsletter.pdfPath);
        await deleteObject(pdfRef).catch(() => {
          console.warn('PDF déjà supprimé');
        });
      }

      // Mettre à jour la liste
      const updatedNewsletters = newsletters.filter(n => n.id !== newsletterId);
      setNewsletters(updatedNewsletters);

      // Mettre à jour Firestore
      if (editingId) {
        const missionaryRef = doc(firestore, 'missionaries', editingId);
        await updateDoc(missionaryRef, {
          newsletters: updatedNewsletters.map(n => ({
            ...n,
            uploadedAt: Timestamp.fromDate(n.uploadedAt)
          }))
        });
      }

      toast({
        title: 'PDF supprimé',
        description: 'Le PDF a été supprimé'
      });

      loadMissionaries();
    } catch (error) {
      console.error('Erreur suppression PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le PDF',
        variant: 'destructive'
      });
    }
  }

  // Reset formulaire
  function resetForm() {
    setEditingId(null);
    setName('');
    setSlug('');
    setLocation('');
    setDescription('');
    setActivities(['']);
    setImageZone('');
    setYoutubeUrl('');
    setIsActive(true);
    setNewsletters([]);
    setNewNewsletterTitle('');
    setNewNewsletterFile(null);
  }

  // Gestion des activités
  function addActivity() {
    setActivities([...activities, '']);
  }

  function updateActivity(index: number, value: string) {
    const updated = [...activities];
    updated[index] = value;
    setActivities(updated);
  }

  function removeActivity(index: number) {
    if (activities.length === 1) {
      setActivities(['']);
    } else {
      setActivities(activities.filter((_, i) => i !== index));
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Missionnaires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les missionnaires, leurs activités et lettres de nouvelles
          </p>
        </div>
        <Button onClick={handleNew} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau missionnaire
        </Button>
      </div>

      {/* Liste des missionnaires */}
      {!isFormOpen && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {missionaries.map(missionary => (
            <Card key={missionary.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg">{missionary.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal">{missionary.location}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(missionary)}
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(missionary)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${missionary.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {missionary.isActive ? '✅ Publié' : '⚠️ Brouillon'}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    {missionary.description}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{missionary.newsletters.length} lettre(s)</span>
                  </div>
                  <Link
                    href={`/infos-docs/mission/${missionary.slug}`}
                    target="_blank"
                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                  >
                    Voir la page
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {missionaries.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Aucun missionnaire pour le moment</p>
              <Button onClick={handleNew} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier missionnaire
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Formulaire */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId ? 'Éditer' : 'Nouveau'} missionnaire</span>
              <Button variant="ghost" size="icon" onClick={() => {
                resetForm();
                setIsFormOpen(false);
              }}>
                <X className="h-5 w-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="infos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="infos">Informations générales</TabsTrigger>
                <TabsTrigger value="newsletters">Lettres de nouvelles</TabsTrigger>
              </TabsList>

              {/* Onglet 1 : Infos */}
              <TabsContent value="infos" className="space-y-6 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la famille *</Label>
                    <Input
                      id="name"
                      placeholder="Famille Gallarello"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      placeholder="famille-gallarello"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL : /infos-docs/mission/{slug || 'slug'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Lieu de mission *</Label>
                  <Input
                    id="location"
                    placeholder="Madagascar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Description de la famille et de sa mission..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Activités</Label>
                  {activities.map((activity, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Enseignement biblique"
                        value={activity}
                        onChange={(e) => updateActivity(index, e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeActivity(index)}
                        title="Supprimer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addActivity} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une activité
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageZone">Image de la famille</Label>
                  <Input
                    id="imageZone"
                    placeholder="missionary-gallarello"
                    value={imageZone}
                    onChange={(e) => setImageZone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Gérer les images dans{' '}
                    <Link href="/admin/images-site" className="text-primary hover:underline">
                      Images du site
                    </Link>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">URL Vidéo YouTube (optionnel)</Label>
                  <Input
                    id="youtubeUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="isActive">Publié</Label>
                </div>
              </TabsContent>

              {/* Onglet 2 : PDFs */}
              <TabsContent value="newsletters" className="space-y-6 mt-6">
                {!editingId && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Enregistrez d'abord le missionnaire pour pouvoir ajouter des lettres de nouvelles
                    </p>
                  </div>
                )}

                {editingId && (
                  <>
                    {/* Liste des PDFs existants */}
                    <div className="space-y-2">
                      <Label>Lettres de nouvelles existantes ({newsletters.length})</Label>
                      {newsletters.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune lettre pour le moment</p>
                      )}
                      <div className="space-y-2">
                        {newsletters.map(newsletter => (
                          <div key={newsletter.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{newsletter.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={newsletter.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Télécharger
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteNewsletter(newsletter.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upload nouveau PDF */}
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="text-lg">➕ Ajouter une lettre de nouvelles</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newsletterTitle">Titre</Label>
                          <Input
                            id="newsletterTitle"
                            placeholder="Nouvelles juin 2021"
                            value={newNewsletterTitle}
                            onChange={(e) => setNewNewsletterTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newsletterFile">Fichier PDF</Label>
                          <Input
                            id="newsletterFile"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setNewNewsletterFile(e.target.files?.[0] || null)}
                          />
                          {newNewsletterFile && (
                            <p className="text-sm text-muted-foreground">
                              📄 {newNewsletterFile.name} ({(newNewsletterFile.size / 1024).toFixed(0)} KB)
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={handleUploadNewsletter}
                          disabled={uploadingPdf || !newNewsletterTitle || !newNewsletterFile}
                          className="w-full"
                        >
                          {uploadingPdf ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Upload en cours...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Uploader le PDF
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
