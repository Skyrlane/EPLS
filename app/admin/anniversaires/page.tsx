'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { BirthdayFormDialog } from '@/components/admin/BirthdayFormDialog';
import { BirthdayTable } from '@/components/admin/BirthdayTable';
import { BirthdayImportButton } from '@/components/admin/BirthdayImportButton';
import { useBirthdays } from '@/hooks/use-birthdays';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Birthday } from '@/types';
import type { BirthdayFormData } from '@/lib/birthday-validation';

const MONTHS = [
  { value: 0, label: 'Tous les mois' },
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

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'inactive', label: 'Inactifs' },
];

export default function AdminAnniversairesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    birthdays,
    loading,
    getAllBirthdays,
    createBirthday,
    updateBirthday,
    deleteBirthday,
    toggleActive,
  } = useBirthdays({ autoLoad: true });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?callbackUrl=/admin/anniversaires');
    }
  }, [user, authLoading, router]);

  // Filtrage des anniversaires
  const filteredBirthdays = birthdays.filter((birthday) => {
    // Filtre par recherche
    const matchesSearch =
      searchTerm === '' ||
      birthday.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      birthday.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par mois
    const matchesMonth = selectedMonth === 0 || birthday.month === selectedMonth;

    // Filtre par statut
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && birthday.isActive) ||
      (selectedStatus === 'inactive' && !birthday.isActive);

    return matchesSearch && matchesMonth && matchesStatus;
  });

  const handleCreate = () => {
    setEditingBirthday(null);
    setDialogOpen(true);
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setDialogOpen(true);
  };

  const handleSave = async (data: BirthdayFormData) => {
    if (editingBirthday) {
      // Mode édition
      await updateBirthday(editingBirthday.id, data);
    } else {
      // Mode création
      await createBirthday({
        ...data,
        createdBy: user?.uid,
      });
    }
  };

  const handleImport = async (
    data: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    for (const item of data) {
      await addDoc(collection(firestore, 'birthdays'), {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user?.uid,
      });
    }
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
          <h1 className="text-3xl font-bold mb-2">Administration des Anniversaires</h1>
          <p className="text-muted-foreground">
            Gérez les anniversaires des membres de l'église EPLS
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">← Retour à l'administration</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Actions et filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Ajoutez ou importez des anniversaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un anniversaire
              </Button>
              <BirthdayImportButton
                onImportComplete={getAllBirthdays}
                existingBirthdays={birthdays}
                onImport={handleImport}
              />
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mois</label>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des anniversaires */}
        <Card>
          <CardHeader>
            <CardTitle>
              Liste des anniversaires ({filteredBirthdays.length})
            </CardTitle>
            <CardDescription>
              {selectedMonth > 0
                ? `Anniversaires du mois de ${MONTHS[selectedMonth].label}`
                : 'Tous les anniversaires'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Chargement des anniversaires...</p>
              </div>
            ) : (
              <BirthdayTable
                birthdays={filteredBirthdays}
                onEdit={handleEdit}
                onDelete={deleteBirthday}
                onToggleActive={toggleActive}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de formulaire */}
      <BirthdayFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingBirthday(null);
        }}
        onSave={handleSave}
        birthday={editingBirthday}
      />
    </div>
  );
}
