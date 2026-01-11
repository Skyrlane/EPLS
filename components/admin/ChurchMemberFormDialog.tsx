'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHURCH_MEMBER_STATUSES, CONSEIL_FUNCTIONS, type ChurchMember, type ChurchMemberStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Type pour le formulaire
export interface ChurchMemberFormData {
  firstName: string;
  lastName: string;
  status: ChurchMemberStatus;
  conseilFunction?: string;
  observations?: string;
  dateRadiation?: string;
  ordre: number;
  isActive: boolean;
}

interface ChurchMemberFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ChurchMemberFormData) => Promise<void>;
  member?: ChurchMember | null;
}

const STATUS_LABELS: Record<string, string> = {
  actif: 'Membre actif',
  conseil: 'Membre du conseil',
  archive: 'Archivé',
};

export function ChurchMemberFormDialog({
  open,
  onClose,
  onSave,
  member,
}: ChurchMemberFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!member;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ChurchMemberFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      status: 'actif',
      conseilFunction: '',
      observations: '',
      dateRadiation: '',
      ordre: 0,
      isActive: true,
    },
  });

  const watchStatus = watch('status');

  // Charger les données si mode édition
  useEffect(() => {
    if (member) {
      reset({
        firstName: member.firstName,
        lastName: member.lastName,
        status: member.status,
        conseilFunction: member.conseilFunction || '',
        observations: member.observations || '',
        dateRadiation: member.dateRadiation || '',
        ordre: member.ordre,
        isActive: member.isActive,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        status: 'actif',
        conseilFunction: '',
        observations: '',
        dateRadiation: '',
        ordre: 0,
        isActive: true,
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: ChurchMemberFormData) => {
    // Validation simple
    if (!data.firstName.trim()) {
      toast({ title: 'Erreur', description: 'Le prénom est requis', variant: 'destructive' });
      return;
    }
    if (!data.lastName.trim()) {
      toast({ title: 'Erreur', description: 'Le nom est requis', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      // Transformer les valeurs vides en undefined
      const transformed: ChurchMemberFormData = {
        ...data,
        conseilFunction: data.conseilFunction || undefined,
        observations: data.observations || undefined,
        dateRadiation: data.dateRadiation || undefined,
      };
      await onSave(transformed);
      toast({
        title: 'Succès',
        description: isEditing
          ? 'Membre mis à jour avec succès'
          : 'Membre créé avec succès',
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le membre' : 'Ajouter un membre'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations du membre'
              : 'Ajoutez un nouveau membre à la liste'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'Le prénom est requis' })}
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
                {...register('lastName', { required: 'Le nom est requis' })}
                placeholder="DUPONT"
                className="uppercase"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut *</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as ChurchMemberStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {CHURCH_MEMBER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Fonction du conseil (visible seulement si statut = conseil) */}
          {watchStatus === 'conseil' && (
            <div className="space-y-2">
              <Label htmlFor="conseilFunction">Fonction au conseil</Label>
              <Select
                value={watch('conseilFunction') || ''}
                onValueChange={(value) => setValue('conseilFunction', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une fonction" />
                </SelectTrigger>
                <SelectContent>
                  {CONSEIL_FUNCTIONS.map((fn) => (
                    <SelectItem key={fn} value={fn}>
                      {fn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Champs pour les membres archivés */}
          {watchStatus === 'archive' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  {...register('observations')}
                  placeholder="Ex: Décédée le 8 juin 2019, démission, reparti en Afrique..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateRadiation">Date/Info radiation</Label>
                <Input
                  id="dateRadiation"
                  {...register('dateRadiation')}
                  placeholder="Ex: radiée le 14 mars 2021"
                />
              </div>
            </>
          )}

          {/* Ordre */}
          <div className="space-y-2">
            <Label htmlFor="ordre">Ordre d'affichage</Label>
            <Input
              id="ordre"
              type="number"
              {...register('ordre', { valueAsNumber: true })}
              placeholder="0"
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Laissez à 0 pour un ordre automatique
            </p>
          </div>

          {/* Visible */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Visible sur le site
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
