'use client';

import { useState, useEffect } from 'react';
import type { Announcement } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Loader2 } from 'lucide-react';
import { doc, updateDoc, Timestamp, deleteField } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AnnouncementEditModalProps {
  announcement: Announcement | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const EVENT_TYPES = {
  concert: { tag: 'Concert', color: '#10B981' },
  culte: { tag: 'Culte', color: '#3B82F6' },
  spectacle: { tag: 'Spectacle', color: '#8B5CF6' },
  reunion: { tag: 'Réunion', color: '#F59E0B' },
  formation: { tag: 'Formation', color: '#6366F1' },
  autre: { tag: 'Événement', color: '#6B7280' }
} as const;

export function AnnouncementEditModal({
  announcement,
  open,
  onClose,
  onSaved
}: AnnouncementEditModalProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Formulaire
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [type, setType] = useState<keyof typeof EVENT_TYPES>('autre');
  const [details, setDetails] = useState('');
  const [pricingFree, setPricingFree] = useState('');
  const [pricingChild, setPricingChild] = useState('');
  const [pricingStudent, setPricingStudent] = useState('');
  const [pricingAdult, setPricingAdult] = useState('');

  // Remplir le formulaire quand l'annonce change
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);

      // Convertir la date au format "YYYY-MM-DD"
      const d = new Date(announcement.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      setDate(dateStr);

      setTime(announcement.time);
      setLocationName(announcement.location.name);
      setLocationAddress(announcement.location.address || '');
      setType(announcement.type);
      setDetails(announcement.details?.join('\n') || '');

      setPricingFree(announcement.pricing?.free || '');
      setPricingChild(announcement.pricing?.child || '');
      setPricingStudent(announcement.pricing?.student || '');
      setPricingAdult(announcement.pricing?.adult || '');
    }
  }, [announcement]);

  // Sauvegarder
  const handleSave = async () => {
    if (!announcement) return;

    // Validation basique
    if (!title.trim()) {
      toast({ title: "Erreur", description: 'Le titre est requis', variant: "destructive" });
      return;
    }
    if (!date) {
      toast({ title: "Erreur", description: 'La date est requise', variant: "destructive" });
      return;
    }
    if (!time.trim()) {
      toast({ title: "Erreur", description: 'L\'heure est requise', variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      // Parser la date
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.replace('h', ':').split(':').map(Number);
      const eventDate = new Date(year, month - 1, day, hour, minute);

      // Préparer les détails
      const detailsArray = details
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      // Préparer le pricing
      const pricing: any = {};
      if (pricingFree.trim()) pricing.free = pricingFree.trim();
      if (pricingChild.trim()) pricing.child = pricingChild.trim();
      if (pricingStudent.trim()) pricing.student = pricingStudent.trim();
      if (pricingAdult.trim()) pricing.adult = pricingAdult.trim();

      const hasPricing = Object.keys(pricing).length > 0;

      // Préparer les données
      const typeConfig = EVENT_TYPES[type];

      const updateData: Record<string, any> = {
        title: title.trim(),
        date: Timestamp.fromDate(eventDate),
        time: time.trim(),
        location: {
          name: locationName.trim(),
          address: locationAddress.trim()
        },
        type,
        tag: typeConfig.tag,
        tagColor: typeConfig.color,
        details: detailsArray.length > 0 ? detailsArray : deleteField(),
        pricing: hasPricing ? pricing : deleteField(),
        updatedAt: Timestamp.now()
      };

      // Mettre à jour dans Firestore
      const docRef = doc(firestore, 'announcements', announcement.id);
      await updateDoc(docRef, updateData);

      toast({ title: "Succès", description: 'Annonce mise à jour avec succès' });
      onSaved();
      onClose();
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      const errorMessage = error?.message || error?.code || 'Erreur lors de la sauvegarde';
      toast({ title: "Erreur", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'annonce</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'annonce ci-dessous
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'annonce"
            />
          </div>

          {/* Date et Heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure * (format: 20h00)</Label>
              <Input
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="20h00"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type d'événement</Label>
            <Select value={type} onValueChange={(value) => setType(value as keyof typeof EVENT_TYPES)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_TYPES).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lieu */}
          <div className="space-y-2">
            <Label htmlFor="location-name">Nom du lieu</Label>
            <Input
              id="location-name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Centre Culturel de Brumath"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-address">Adresse du lieu</Label>
            <Input
              id="location-address"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="29 Rue André Malraux, 67380 Brumath"
            />
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <Label htmlFor="details">Détails (un par ligne)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Chants&#10;Prédication&#10;École du dimanche"
              rows={4}
            />
          </div>

          {/* Tarification */}
          <div className="space-y-3">
            <Label>Tarification (optionnel)</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricing-free" className="text-sm text-muted-foreground">
                  Gratuit
                </Label>
                <Input
                  id="pricing-free"
                  value={pricingFree}
                  onChange={(e) => setPricingFree(e.target.value)}
                  placeholder="Gratuit jusqu'à 8 ans"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing-child" className="text-sm text-muted-foreground">
                  Enfants
                </Label>
                <Input
                  id="pricing-child"
                  value={pricingChild}
                  onChange={(e) => setPricingChild(e.target.value)}
                  placeholder="9-17 ans : 5 €"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing-student" className="text-sm text-muted-foreground">
                  Étudiants
                </Label>
                <Input
                  id="pricing-student"
                  value={pricingStudent}
                  onChange={(e) => setPricingStudent(e.target.value)}
                  placeholder="Étudiants : 10 €"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing-adult" className="text-sm text-muted-foreground">
                  Adultes
                </Label>
                <Input
                  id="pricing-adult"
                  value={pricingAdult}
                  onChange={(e) => setPricingAdult(e.target.value)}
                  placeholder="Adultes : 15 €"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
