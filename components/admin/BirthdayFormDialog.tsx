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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { birthdaySchema, type BirthdayFormData } from '@/lib/birthday-validation';
import type { Birthday } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface BirthdayFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BirthdayFormData) => Promise<void>;
  birthday?: Birthday | null;
}

const MONTHS = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];

export function BirthdayFormDialog({
  open,
  onClose,
  onSave,
  birthday,
}: BirthdayFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!birthday;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BirthdayFormData>({
    resolver: zodResolver(birthdaySchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      day: 1,
      month: 1,
      isActive: true,
    },
  });

  // Charger les données si mode édition
  useEffect(() => {
    if (birthday) {
      reset({
        firstName: birthday.firstName,
        lastName: birthday.lastName,
        day: birthday.day,
        month: birthday.month,
        isActive: birthday.isActive,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        day: 1,
        month: 1,
        isActive: true,
      });
    }
  }, [birthday, reset]);

  const onSubmit = async (data: BirthdayFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
      toast({
        title: 'Succès',
        description: isEditing 
          ? 'Anniversaire mis à jour avec succès'
          : 'Anniversaire créé avec succès',
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

  const selectedMonth = watch('month');
  const selectedDay = watch('day');

  // Calcul du nombre de jours dans le mois sélectionné
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = daysInMonth[selectedMonth - 1];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l\'anniversaire' : 'Ajouter un anniversaire'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de l\'anniversaire'
              : 'Ajoutez un nouvel anniversaire à la liste'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Prénom */}
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

            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Jour */}
            <div className="space-y-2">
              <Label htmlFor="day">Jour *</Label>
              <Input
                id="day"
                type="number"
                min={1}
                max={maxDay}
                {...register('day', { valueAsNumber: true })}
              />
              {errors.day && (
                <p className="text-sm text-red-600">{errors.day.message}</p>
              )}
            </div>

            {/* Mois */}
            <div className="space-y-2">
              <Label htmlFor="month">Mois *</Label>
              <Select
                value={selectedMonth?.toString()}
                onValueChange={(value) => setValue('month', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && (
                <p className="text-sm text-red-600">{errors.month.message}</p>
              )}
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Actif (visible publiquement)
            </Label>
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
