'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import type { GalleryTag } from '@/types';
import { collection, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface TagManagerProps {
  tags: GalleryTag[];
  onUpdate: () => void;
}

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#6B7280', '#14B8A6', '#EF4444'
];

export function TagManager({ tags, onUpdate }: TagManagerProps) {
  const { toast } = useToast();
  const [newTag, setNewTag] = useState({ name: '', color: PRESET_COLORS[0] });

  const addTag = async () => {
    if (!newTag.name.trim()) {
      toast({ title: 'Erreur', description: 'Nom requis', variant: 'destructive' });
      return;
    }

    try {
      const slug = newTag.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-');

      await addDoc(collection(firestore, 'gallery_tags'), {
        name: newTag.name,
        slug,
        color: newTag.color,
        count: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast({ title: 'Succès', description: 'Tag créé' });
      setNewTag({ name: '', color: PRESET_COLORS[0] });
      onUpdate();
    } catch (error) {
      console.error('Erreur création tag:', error);
      toast({ title: 'Erreur', description: 'Impossible de créer', variant: 'destructive' });
    }
  };

  const deleteTag = async (tagId: string) => {
    if (!confirm('Supprimer ce tag ?')) return;

    try {
      await deleteDoc(doc(firestore, 'gallery_tags', tagId));
      toast({ title: 'Succès', description: 'Tag supprimé' });
      onUpdate();
    } catch (error) {
      console.error('Erreur suppression tag:', error);
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire nouveau tag */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold">Créer un nouveau tag</h3>
        
        <div>
          <Label htmlFor="tag-name">Nom du tag</Label>
          <Input
            id="tag-name"
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            placeholder="Ex: Culte, Baptême..."
          />
        </div>

        <div>
          <Label>Couleur</Label>
          <div className="flex gap-2 mt-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                className={`w-10 h-10 rounded border-2 ${
                  newTag.color === color ? 'border-black' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTag({ ...newTag, color })}
              />
            ))}
          </div>
        </div>

        <Button onClick={addTag}>
          <Plus className="mr-2 h-4 w-4" />
          Créer le tag
        </Button>
      </div>

      {/* Liste des tags */}
      <div>
        <h3 className="font-semibold mb-4">Tags existants ({tags.length})</h3>
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between border rounded p-3">
              <div className="flex items-center gap-3">
                <Badge style={{ backgroundColor: tag.color }}>{tag.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  {tag.count || 0} photo(s)
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteTag(tag.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
