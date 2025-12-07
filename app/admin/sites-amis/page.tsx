'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/use-auth';
import type { PartnerSite } from '@/types';
import { PARTNER_CATEGORIES } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { DynamicImageBlock } from '@/components/ui/dynamic-image-block';
import { Switch } from '@/components/ui/switch';

export default function AdminSitesAmisPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // États
  const [sites, setSites] = useState<PartnerSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulaire
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [logoZone, setLogoZone] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Charger les sites
  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      setLoading(true);
      const sitesRef = collection(firestore, 'partner_sites');
      const q = query(sitesRef, orderBy('category'), orderBy('sortOrder'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PartnerSite[];
      
      setSites(data);
    } catch (error) {
      console.error('Erreur chargement sites:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les sites',
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
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Auto-générer le slug quand le nom change
  useEffect(() => {
    if (name && !editingId) {
      setSlug(generateSlug(name));
    }
  }, [name, editingId]);

  // Nouveau site
  function handleNew() {
    resetForm();
    setIsFormOpen(true);
  }

  // Éditer
  function handleEdit(site: PartnerSite) {
    setEditingId(site.id);
    setName(site.name);
    setSlug(site.slug);
    setCategory(site.category);
    setDescription(site.description);
    setUrl(site.url);
    setLogoZone(site.logoZone || '');
    setSortOrder(site.sortOrder);
    setIsActive(site.isActive);
    setIsFormOpen(true);
  }

  // Sauvegarder
  async function handleSave() {
    if (!name || !slug || !category || !description || !url) {
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
      const siteData = {
        name,
        slug,
        category,
        description,
        url,
        logoZone: logoZone || null,
        sortOrder,
        isActive,
        updatedAt: Timestamp.now(),
      };

      if (editingId) {
        // Mise à jour
        const siteRef = doc(firestore, 'partner_sites', editingId);
        await updateDoc(siteRef, siteData);
        toast({
          title: 'Site mis à jour',
          description: `${name} a été mis à jour avec succès`
        });
      } else {
        // Création
        await addDoc(collection(firestore, 'partner_sites'), {
          ...siteData,
          createdAt: Timestamp.now(),
          createdBy: user.uid,
          createdByName: user.displayName || 'Admin'
        });
        toast({
          title: 'Site créé',
          description: `${name} a été ajouté avec succès`
        });
      }

      setIsFormOpen(false);
      resetForm();
      loadSites();
    } catch (error) {
      console.error('Erreur sauvegarde site:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le site',
        variant: 'destructive'
      });
    }
  }

  // Supprimer
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'partner_sites', id));
      toast({
        title: 'Site supprimé',
        description: `${name} a été supprimé`
      });
      loadSites();
    } catch (error) {
      console.error('Erreur suppression site:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le site',
        variant: 'destructive'
      });
    }
  }

  // Réinitialiser formulaire
  function resetForm() {
    setEditingId(null);
    setName('');
    setSlug('');
    setCategory('');
    setDescription('');
    setUrl('');
    setLogoZone('');
    setSortOrder(0);
    setIsActive(true);
  }

  // Grouper par catégorie
  const sitesByCategory = sites.reduce((acc, site) => {
    if (!acc[site.category]) {
      acc[site.category] = [];
    }
    acc[site.category].push(site);
    return acc;
  }, {} as Record<string, PartnerSite[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Sites Amis</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau site
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites publiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sites.filter(s => s.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(sitesByCategory).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des sites par catégorie */}
      <div className="space-y-6">
        {Object.entries(sitesByCategory).map(([cat, categorySites]) => (
          <div key={cat}>
            <h2 className="text-xl font-semibold mb-3">{cat} ({categorySites.length})</h2>
            <div className="grid gap-4">
              {categorySites.map(site => (
                <Card key={site.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Logo mini */}
                      <div className="w-16 h-16 flex-shrink-0">
                        {site.logoZone ? (
                          <DynamicImageBlock
                            zone={site.logoZone}
                            fallbackSrc="/placeholder.svg?height=64&width=64"
                            alt={site.name}
                            type="avatar"
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                            Logo
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{site.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${site.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {site.isActive ? '✅ Publié' : '⚠️ Brouillon'}
                          </span>
                        </div>
                        <a 
                          href={site.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {site.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {site.description}
                        </p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Ordre: {site.sortOrder}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(site)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(site.id, site.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {sites.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Aucun site partenaire pour le moment. Cliquez sur "Nouveau site" pour commencer.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de création/édition */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Éditer le site' : 'Nouveau site ami'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations du site partenaire' : 'Ajoutez un nouveau site partenaire'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du site *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Radio Arc-en-Ciel"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (généré automatiquement)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="radio-arc-en-ciel"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Description du site partenaire..."
                required
              />
            </div>

            <div>
              <Label htmlFor="url">URL du site *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.exemple.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="logoZone">Zone d'image (logo)</Label>
              <Input
                id="logoZone"
                value={logoZone}
                onChange={(e) => setLogoZone(e.target.value)}
                placeholder="partner-radio-arcenciel"
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 <strong>Format :</strong> partner-nom-du-site (ex: partner-radio-arcenciel)<br/>
                Gérer les logos dans{' '}
                <Link href="/admin/images-site" className="text-primary hover:underline" target="_blank">
                  Images du site
                </Link>
                {' '}(nouvel onglet)
              </p>
            </div>

            <div>
              <Label htmlFor="sortOrder">Ordre d'affichage</Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Plus le numéro est petit, plus le site apparaîtra en premier dans sa catégorie
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Publié</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                💾 Enregistrer
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
