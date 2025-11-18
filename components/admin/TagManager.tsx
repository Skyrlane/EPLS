'use client';

/**
 * Gestionnaire de tags pour le blog
 */

import { useState, useEffect } from 'react';
import { BlogTag } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { BLOG_TAGS } from '@/lib/blog-utils';

export function TagManager() {
  const { toast } = useToast();
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState({ label: '', color: '#3B82F6' });

  // Charger les tags depuis Firestore (on utilisera les tags prédéfinis pour ce projet)
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const tagsRef = collection(firestore, 'blogTags');
      const snapshot = await getDocs(tagsRef);
      
      if (snapshot.empty) {
        // Initialiser avec les tags prédéfinis si aucun n'existe
        setTags(BLOG_TAGS.map((tag, index) => ({
          id: `tag-${index}`,
          label: tag.label,
          color: tag.color,
        })));
      } else {
        const loadedTags = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogTag));
        setTags(loadedTags);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tags:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les tags',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tag?: BlogTag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ label: tag.label, color: tag.color });
    } else {
      setEditingTag(null);
      setFormData({ label: '', color: '#3B82F6' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom du tag est requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      if (editingTag) {
        // Mise à jour
        const tagRef = doc(firestore, 'blogTags', editingTag.id);
        await updateDoc(tagRef, {
          label: formData.label,
          color: formData.color,
          updatedAt: Timestamp.now(),
        });

        toast({
          title: 'Succès',
          description: 'Tag mis à jour',
        });
      } else {
        // Création
        await addDoc(collection(firestore, 'blogTags'), {
          label: formData.label,
          color: formData.color,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        toast({
          title: 'Succès',
          description: 'Tag créé',
        });
      }

      setDialogOpen(false);
      await loadTags();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le tag',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tag: BlogTag) => {
    // Vérifier si des articles utilisent ce tag
    const articlesRef = collection(firestore, 'articles');
    const q = query(articlesRef, where('tag', '==', tag.label));
    const articlesSnapshot = await getDocs(q);

    if (!articlesSnapshot.empty) {
      toast({
        title: 'Impossible de supprimer',
        description: `${articlesSnapshot.size} article(s) utilisent ce tag`,
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Supprimer le tag "${tag.label}" ?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(firestore, 'blogTags', tag.id));

      toast({
        title: 'Succès',
        description: 'Tag supprimé',
      });

      await loadTags();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le tag',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gérer les tags</h2>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les tags pour catégoriser vos articles
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un tag
        </Button>
      </div>

      {/* Liste des tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <CardTitle className="text-lg">{tag.label}</CardTitle>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(tag)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tag)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-xs text-muted-foreground">
                Couleur : {tag.color}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="flex gap-3 pt-6">
          <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note :</strong> Pour ce projet, les tags sont prédéfinis dans le code (BLOG_TAGS).
            Cette interface permet de les gérer si vous souhaitez les rendre dynamiques.
          </div>
        </CardContent>
      </Card>

      {/* Dialog création/édition */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Modifier le tag' : 'Créer un tag'}
            </DialogTitle>
            <DialogDescription>
              Configurez le nom et la couleur du tag
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Nom du tag</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Foi, Grâce, Prière..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Aperçu</Label>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: formData.color,
                  color: 'white',
                }}
              >
                {formData.label || 'Nom du tag'}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {editingTag ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
