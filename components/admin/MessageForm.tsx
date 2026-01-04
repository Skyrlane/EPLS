'use client';

import { useState, useEffect } from 'react';
import type { MessageItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, YoutubeIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { extractYouTubeId, getYouTubeEmbedUrl } from '@/lib/youtube-utils';
import { useYouTubeMetadata } from '@/hooks/use-youtube-metadata';
import { uploadMessageThumbnail, compressImage } from '@/lib/upload-message-thumbnail';
import { ImageIcon, XIcon } from 'lucide-react';
import { cleanFirestoreData } from '@/lib/firestore-utils';

interface MessageFormProps {
  message?: MessageItem | null;
  onSaved?: () => void;
  onCancel?: () => void;
}

const TAG_OPTIONS = [
  { label: 'Foi', color: '#3B82F6' },
  { label: 'Grâce', color: '#10B981' },
  { label: 'Évangile', color: '#8B5CF6' },
  { label: 'Prière', color: '#F59E0B' },
  { label: 'Espérance', color: '#EC4899' },
  { label: 'Amour', color: '#EF4444' },
  { label: 'Sagesse', color: '#6366F1' },
  { label: 'Témoignage', color: '#14B8A6' },
  { label: 'Enseignement', color: '#06B6D4' },
  { label: 'Autre', color: '#6B7280' }
];

export function MessageForm({ message, onSaved, onCancel }: MessageFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // États du formulaire
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pastor, setPastor] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('Foi');
  const [tagColor, setTagColor] = useState('#3B82F6');
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [customThumbnailFile, setCustomThumbnailFile] = useState<File | null>(null);
  const [customThumbnailPreview, setCustomThumbnailPreview] = useState<string>('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Auto-fetch YouTube metadata
  const { metadata, loading: fetchingMetadata, error: fetchError } = useYouTubeMetadata(youtubeId);

  // Remplir le formulaire si on édite
  useEffect(() => {
    if (message) {
      setYoutubeUrl(message.youtubeUrl);
      setYoutubeId(message.youtubeId);
      setTitle(message.title);
      setDescription(message.description);
      setPastor(message.pastor);
      
      const d = new Date(message.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      setDate(dateStr);
      
      setTag(message.tag);
      setTagColor(message.tagColor);
      setIsActive(message.isActive);
      setStatus(message.status);
      
      // Charger la miniature personnalisée si elle existe
      if (message.coverImageUrl) {
        setCustomThumbnailPreview(message.coverImageUrl);
      }
    }
  }, [message]);

  // Extraire l'ID YouTube quand l'URL change
  useEffect(() => {
    if (youtubeUrl && !message) {
      const id = extractYouTubeId(youtubeUrl);
      if (id) {
        setYoutubeId(id);
      } else {
        setYoutubeId('');
      }
    }
  }, [youtubeUrl, message]);

  // Auto-remplir avec les métadonnées YouTube
  useEffect(() => {
    if (metadata && !message) {
      if (metadata.title && !title) setTitle(metadata.title);
      if (metadata.description && !description) setDescription(metadata.description);
    }
  }, [metadata, message, title, description]);

  // Gérer le changement de miniature
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type
    if (!file.type.startsWith('image/')) {
      toast({ 
        title: 'Erreur', 
        description: 'Veuillez sélectionner une image', 
        variant: 'destructive' 
      });
      return;
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: 'Erreur', 
        description: 'Image trop grande (max 5MB)', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      // Compresser l'image si nécessaire
      let processedFile = file;
      if (file.size > 1024 * 1024) { // Si > 1MB, compresser
        toast({ 
          title: 'Compression', 
          description: 'Compression de l\'image en cours...' 
        });
        processedFile = await compressImage(file);
      }

      setCustomThumbnailFile(processedFile);

      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(processedFile);

      toast({ 
        title: 'Succès', 
        description: 'Miniature sélectionnée' 
      });
    } catch (error) {
      console.error('Erreur traitement image:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Erreur lors du traitement de l\'image', 
        variant: 'destructive' 
      });
    }
  };

  // Supprimer la miniature personnalisée
  const handleRemoveCustomThumbnail = () => {
    setCustomThumbnailFile(null);
    setCustomThumbnailPreview('');
    toast({ 
      title: 'Succès', 
      description: 'La miniature YouTube sera utilisée' 
    });
  };

  // Changer tag color quand le tag change
  const handleTagChange = (newTag: string) => {
    setTag(newTag);
    const option = TAG_OPTIONS.find(opt => opt.label === newTag);
    if (option) setTagColor(option.color);
  };

  // Validation
  const validate = () => {
    if (!youtubeUrl.trim()) {
      toast({ title: "Erreur", description: 'L\'URL YouTube est requise', variant: "destructive" });
      return false;
    }
    if (!youtubeId) {
      toast({ title: "Erreur", description: 'URL YouTube invalide', variant: "destructive" });
      return false;
    }
    if (!title.trim()) {
      toast({ title: "Erreur", description: 'Le titre est requis', variant: "destructive" });
      return false;
    }
    if (!pastor.trim()) {
      toast({ title: "Erreur", description: 'Le nom du pasteur est requis', variant: "destructive" });
      return false;
    }
    if (!date) {
      toast({ title: "Erreur", description: 'La date est requise', variant: "destructive" });
      return false;
    }
    return true;
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      // Upload de la miniature personnalisée si elle existe
      let coverImageUrl = message?.coverImageUrl; // Garder l'ancienne si elle existe
      
      if (customThumbnailFile) {
        setUploadingThumbnail(true);
        toast({ 
          title: 'Upload', 
          description: 'Upload de la miniature en cours...' 
        });
        
        try {
          // Créer un ID temporaire si c'est un nouveau message
          const messageIdForUpload = message?.id || `temp-${Date.now()}`;
          coverImageUrl = await uploadMessageThumbnail(messageIdForUpload, customThumbnailFile);
          
          toast({ 
            title: 'Succès', 
            description: 'Miniature uploadée avec succès' 
          });
        } catch (uploadError) {
          console.error('Erreur upload miniature:', uploadError);
          toast({ 
            title: 'Avertissement', 
            description: 'Erreur lors de l\'upload de la miniature, la miniature YouTube sera utilisée', 
            variant: 'destructive' 
          });
          coverImageUrl = undefined;
        } finally {
          setUploadingThumbnail(false);
        }
      } else if (!customThumbnailPreview && message?.coverImageUrl) {
        // L'utilisateur a supprimé la miniature personnalisée
        coverImageUrl = undefined;
      }
      
      const embedUrl = getYouTubeEmbedUrl(youtubeId);
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      
      console.log('💾 === SAUVEGARDE MESSAGE ===');
      console.log('  - youtubeId:', youtubeId);
      console.log('  - thumbnailUrl:', thumbnailUrl);
      console.log('  - coverImageUrl:', coverImageUrl || 'NON DÉFINI');
      
      const [year, month, day] = date.split('-').map(Number);
      const messageDate = new Date(year, month - 1, day);

      // Construire l'objet data brut (peut contenir des undefined)
      const rawData = {
        title: title.trim(),
        description: description.trim(),
        youtubeUrl: youtubeUrl.trim(),
        youtubeId,
        embedUrl,
        thumbnailUrl,
        coverImageUrl,
        duration: metadata?.duration,
        date: Timestamp.fromDate(messageDate),
        pastor: pastor.trim(),
        tag,
        tagColor,
        isActive,
        status,
        views: message?.views || 0,
        updatedAt: Timestamp.now()
      };

      // Nettoyer les champs undefined (Firestore ne les accepte pas)
      const data = cleanFirestoreData(rawData);

      if (message) {
        // Mise à jour
        const docRef = doc(firestore, 'messages', message.id);
        await updateDoc(docRef, data);
        toast({ title: "Succès", description: 'Message mis à jour avec succès' });
      } else {
        // Création
        const createData = cleanFirestoreData({
          ...rawData,
          createdAt: Timestamp.now()
        });
        await addDoc(collection(firestore, 'messages'), createData);
        toast({ title: "Succès", description: 'Message créé avec succès' });
        
        // Réinitialiser le formulaire
        setYoutubeUrl('');
        setYoutubeId('');
        setTitle('');
        setDescription('');
        setPastor('');
        setDate('');
        setCustomThumbnailFile(null);
        setCustomThumbnailPreview('');
      }

      onSaved?.();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({ title: "Erreur", description: 'Erreur lors de la sauvegarde', variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL YouTube */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <YoutubeIcon className="h-5 w-5 text-red-600" />
            Vidéo YouTube
          </CardTitle>
          <CardDescription>
            Collez l'URL de la vidéo YouTube pour récupérer automatiquement les informations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">URL YouTube *</Label>
            <Input
              id="youtube-url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={!!message}
            />
          </div>

          {/* Status de validation */}
          {youtubeId && !fetchingMetadata && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>URL YouTube valide</span>
            </div>
          )}

          {youtubeUrl && !youtubeId && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>URL YouTube invalide</span>
            </div>
          )}

          {fetchingMetadata && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Récupération des métadonnées...</span>
            </div>
          )}

          {fetchError && (
            <div className="text-sm text-secondary-foreground">
              {fetchError}
            </div>
          )}

          {/* Métadonnées récupérées */}
          {metadata && youtubeId && !fetchingMetadata && (
            <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
              <p className="text-sm font-semibold mb-3">📺 Métadonnées récupérées :</p>
              <div className="space-y-1.5 text-sm">
                {metadata.duration && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Durée :</span>
                    <span className="font-medium">{metadata.duration}</span>
                  </div>
                )}
                {metadata.title && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Titre YouTube :</span>
                    <span className="font-medium text-xs break-all">{metadata.title}</span>
                  </div>
                )}
                {metadata.description && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Description YouTube :</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {metadata.description}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Ces informations ont été remplies automatiquement ci-dessous
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Miniature personnalisée */}
      {youtubeId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Miniature personnalisée (optionnelle)
            </CardTitle>
            <CardDescription>
              Par défaut, la miniature YouTube est utilisée. Uploadez une image personnalisée si nécessaire.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prévisualisation */}
            <div className="space-y-2">
              <Label>Aperçu de la miniature</Label>
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-muted">
                <img
                  src={
                    customThumbnailPreview ||
                    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                  }
                  alt="Aperçu miniature"
                  className="w-full h-full object-cover"
                />
                {customThumbnailPreview && (
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRemoveCustomThumbnail}
                      title="Supprimer la miniature personnalisée"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {customThumbnailPreview && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Miniature personnalisée sélectionnée
                </p>
              )}
            </div>

            {/* Input file */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail-upload">
                {customThumbnailPreview ? 'Changer la miniature' : 'Ajouter une miniature personnalisée'}
              </Label>
              <Input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={uploadingThumbnail}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés : JPG, PNG, WebP. Taille max : 5MB. 
                Dimensions recommandées : 1280x720px (16:9).
              </p>
            </div>

            {/* Info */}
            {!customThumbnailPreview && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-foreground">
                  💡 Si vous n'uploadez pas de miniature personnalisée,
                  la miniature YouTube sera utilisée automatiquement.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informations du message */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du message"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du message"
              rows={4}
            />
          </div>

          {/* Pasteur et Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pastor">Pasteur / Prédicateur *</Label>
              <Input
                id="pastor"
                value={pastor}
                onChange={(e) => setPastor(e.target.value)}
                placeholder="Pasteur Robert"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Tag */}
          <div className="space-y-2">
            <Label htmlFor="tag">Catégorie / Tag</Label>
            <Select value={tag} onValueChange={handleTagChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAG_OPTIONS.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paramètres */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Statut de publication</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'published' | 'draft')}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Actif (visible sur le site)</Label>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Annuler
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSaving || fetchingMetadata || uploadingThumbnail}>
          {(isSaving || uploadingThumbnail) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploadingThumbnail ? 'Upload miniature...' : (message ? 'Mettre à jour' : 'Créer le message')}
        </Button>
      </div>
    </div>
  );
}
