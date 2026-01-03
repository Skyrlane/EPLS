'use client';

import { useState, useEffect } from 'react';
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
import { ContactFormDialog } from '@/components/admin/ContactFormDialog';
import { ContactTable } from '@/components/admin/ContactTable';
import { ContactImportButton } from '@/components/admin/ContactImportButton';
import { useContacts } from '@/hooks/use-contacts';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Contact } from '@/types';
import type { ContactFormData } from '@/lib/validations/contact';

const LETTERS = [
  'ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'inactive', label: 'Inactifs' },
];

const MEMBER_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'members', label: 'Membres' },
  { value: 'non-members', label: 'Non-membres' },
];

export default function AdminCarnetAdressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    contacts,
    loading,
    getAllContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleActive,
    importContacts,
  } = useContacts({ autoLoad: true });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?callbackUrl=/admin/carnet-adresses');
    }
  }, [user, authLoading, router]);

  // Filtrage des contacts
  const filteredContacts = contacts.filter((contact) => {
    // Filtre par recherche
    const matchesSearch =
      searchTerm === '' ||
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par lettre
    const matchesLetter =
      selectedLetter === 'ALL' ||
      contact.lastName.toUpperCase().startsWith(selectedLetter);

    // Filtre par statut
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && contact.isActive) ||
      (selectedStatus === 'inactive' && !contact.isActive);

    // Filtre par membre
    const matchesMember =
      selectedMemberFilter === 'all' ||
      (selectedMemberFilter === 'members' && contact.isMember) ||
      (selectedMemberFilter === 'non-members' && !contact.isMember);

    return matchesSearch && matchesLetter && matchesStatus && matchesMember;
  });

  const handleCreate = () => {
    setEditingContact(null);
    setDialogOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleSave = async (data: ContactFormData) => {
    if (editingContact) {
      // Mode édition
      await updateContact(editingContact.id, data);
    } else {
      // Mode création
      await createContact({
        ...data,
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
          <h1 className="text-3xl font-bold mb-2">Gestion du Carnet d'Adresses</h1>
          <p className="text-muted-foreground">
            Gérez les coordonnées des membres de l'église EPLS
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
              Ajoutez ou importez des contacts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un contact
              </Button>
              <ContactImportButton
                onImportComplete={getAllContacts}
                existingContacts={contacts}
                onImport={importContacts}
              />
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom, ville, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lettre</label>
                <Select
                  value={selectedLetter}
                  onValueChange={setSelectedLetter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LETTERS.map((letter) => (
                      <SelectItem key={letter} value={letter}>
                        {letter === 'ALL' ? 'Toutes' : letter}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={selectedMemberFilter}
                  onValueChange={setSelectedMemberFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBER_OPTIONS.map((option) => (
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

        {/* Tableau des contacts */}
        <Card>
          <CardHeader>
            <CardTitle>
              Liste des contacts ({filteredContacts.length})
            </CardTitle>
            <CardDescription>
              {selectedLetter !== 'ALL'
                ? `Contacts commençant par ${selectedLetter}`
                : 'Tous les contacts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Chargement des contacts...</p>
              </div>
            ) : (
              <ContactTable
                contacts={filteredContacts}
                onEdit={handleEdit}
                onDelete={deleteContact}
                onToggleActive={toggleActive}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de formulaire */}
      <ContactFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSave}
        contact={editingContact}
      />
    </div>
  );
}
