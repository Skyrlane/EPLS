'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact';
import type { Contact } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ContactFormData) => Promise<void>;
  contact?: Contact | null;
}

export function ContactFormDialog({
  open,
  onClose,
  onSave,
  contact,
}: ContactFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!contact;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneFixed: '',
      phoneMobile: '',
      email: '',
      address: '',
      postalCode: '',
      city: '',
      birthDate: '',
      isMember: false,
      isActive: true,
      notes: '',
    },
  });

  // Charger les données si mode édition
  useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneFixed: contact.phoneFixed || '',
        phoneMobile: contact.phoneMobile || '',
        email: contact.email || '',
        address: contact.address || '',
        postalCode: contact.postalCode || '',
        city: contact.city || '',
        birthDate: contact.birthDate || '',
        isMember: contact.isMember,
        isActive: contact.isActive,
        notes: contact.notes || '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        phoneFixed: '',
        phoneMobile: '',
        email: '',
        address: '',
        postalCode: '',
        city: '',
        birthDate: '',
        isMember: false,
        isActive: true,
        notes: '',
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
      toast({
        title: 'Succès',
        description: isEditing
          ? 'Contact mis à jour avec succès'
          : 'Contact créé avec succès',
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le contact' : 'Ajouter un contact'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations du contact'
              : 'Ajoutez un nouveau contact au carnet d\'adresses'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Jean"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="DUPONT"
                className="uppercase"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Téléphones */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneFixed">Téléphone fixe</Label>
              <Input
                id="phoneFixed"
                {...register('phoneFixed')}
                placeholder="03 88 62 08 29"
              />
              {errors.phoneFixed && (
                <p className="text-sm text-red-600">{errors.phoneFixed.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneMobile">Téléphone mobile</Label>
              <Input
                id="phoneMobile"
                {...register('phoneMobile')}
                placeholder="06 52 60 99 90"
              />
              {errors.phoneMobile && (
                <p className="text-sm text-red-600">{errors.phoneMobile.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contact@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="2 place du Docteur Nessmann"
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Code postal et Ville */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                placeholder="67000"
                maxLength={5}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-600">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Strasbourg"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Date de naissance */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance (JJ/MM/AAAA)</Label>
            <Input
              id="birthDate"
              {...register('birthDate')}
              placeholder="23/01/1948"
            />
            {errors.birthDate && (
              <p className="text-sm text-red-600">{errors.birthDate.message}</p>
            )}
          </div>

          {/* Membre actif */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isMember"
              checked={watch('isMember')}
              onCheckedChange={(checked) => setValue('isMember', checked)}
            />
            <Label htmlFor="isMember" className="cursor-pointer">
              Membre actif de l'église
            </Label>
          </div>

          {/* Visible publiquement */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Visible publiquement
            </Label>
          </div>

          {/* Notes privées */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes privées (admin uniquement)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notes internes..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
