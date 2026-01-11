'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Users, Shield, Archive, Upload } from 'lucide-react';
import { ChurchMemberFormDialog } from '@/components/admin/ChurchMemberFormDialog';
import { ChurchMemberTable } from '@/components/admin/ChurchMemberTable';
import { useChurchMembers } from '@/hooks/use-church-members';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CONSEIL_FUNCTIONS, type ChurchMember, type ChurchMemberStatus } from '@/types';
import { type ChurchMemberFormData } from '@/components/admin/ChurchMemberFormDialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminMembresPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const {
    members,
    loading,
    getAllMembers,
    createMember,
    updateMember,
    deleteMember,
    toggleActive,
    importMembers,
  } = useChurchMembers({ autoLoad: true });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ChurchMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [defaultStatus, setDefaultStatus] = useState<ChurchMemberStatus>('actif');

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?callbackUrl=/admin/membres');
    }
  }, [user, authLoading, router]);

  // Filtrage des membres
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Filtre par recherche
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.firstName.toLowerCase().includes(lowerSearch) ||
          member.lastName.toLowerCase().includes(lowerSearch)
      );
    }

    // Filtre par onglet
    if (activeTab !== 'all') {
      filtered = filtered.filter((member) => member.status === activeTab);
    }

    return filtered;
  }, [members, searchTerm, activeTab]);

  // Compteurs par catégorie
  const counts = useMemo(() => ({
    all: members.length,
    conseil: members.filter((m) => m.status === 'conseil').length,
    actif: members.filter((m) => m.status === 'actif').length,
    archive: members.filter((m) => m.status === 'archive').length,
  }), [members]);

  const handleCreate = (status: ChurchMemberStatus = 'actif') => {
    setEditingMember(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEdit = (member: ChurchMember) => {
    setEditingMember(member);
    setDefaultStatus(member.status);
    setDialogOpen(true);
  };

  const handleSave = async (data: ChurchMemberFormData) => {
    // Préparer les données pour Firestore
    const memberData = {
      firstName: data.firstName,
      lastName: data.lastName,
      status: data.status || defaultStatus,
      conseilFunction: data.conseilFunction as typeof CONSEIL_FUNCTIONS[number] | undefined,
      observations: data.observations,
      dateRadiation: data.dateRadiation,
      ordre: data.ordre,
      isActive: data.isActive,
    };

    if (editingMember) {
      await updateMember(editingMember.id, memberData);
    } else {
      await createMember({
        ...memberData,
        createdBy: user?.uid,
      });
    }
  };

  // Import des données existantes (une seule fois)
  const handleImportInitialData = async () => {
    // Données du conseil
    const conseilData = [
      { lastName: 'SCHNEIDER', firstName: 'Clairette', status: 'conseil' as const, conseilFunction: 'Secrétaire' as const, ordre: 1 },
      { lastName: 'SIEGRIST', firstName: 'Miriam', status: 'conseil' as const, conseilFunction: 'Président' as const, ordre: 2 },
      { lastName: 'DUMAY', firstName: 'Wisler', status: 'conseil' as const, conseilFunction: 'Trésorier' as const, ordre: 3 },
      { lastName: 'THOBOIS', firstName: 'Christophe', status: 'conseil' as const, conseilFunction: 'Vice-Président' as const, ordre: 4 },
    ];

    // Données des archives
    const archiveData = [
      { lastName: 'THOMAS', firstName: 'Marion', status: 'archive' as const, observations: 'Décédée le 8 juin 2019', dateRadiation: 'radiée', ordre: 1 },
      { lastName: 'FRANTZ', firstName: 'Christine', status: 'archive' as const, observations: 'Décédée le 18 janvier 2021', dateRadiation: '', ordre: 2 },
      { lastName: 'HERRENSCHMIDT', firstName: 'Patrice', status: 'archive' as const, observations: 'démission', dateRadiation: 'radiée le 14 mars 2021', ordre: 3 },
      { lastName: 'HERRENSCHMIDT', firstName: 'Y-Lê', status: 'archive' as const, observations: 'démission', dateRadiation: 'radiée le 14 mars 2021', ordre: 4 },
      { lastName: 'MBUAKI', firstName: 'Dédé', status: 'archive' as const, observations: 'reparti en Afrique', dateRadiation: 'radiée le 14 mars 2021', ordre: 5 },
      { lastName: 'RAPHAËL', firstName: 'Monalise', status: 'archive' as const, observations: 'veut rester membre', dateRadiation: 'contactée après le 14 mars 2021', ordre: 6 },
      { lastName: 'GUILLEMOT', firstName: 'Denise', status: 'archive' as const, observations: 'démission', dateRadiation: 'datée du 28/08/2021', ordre: 7 },
    ];

    // Tous les membres actifs
    const membresActifs = [
      { lastName: 'BAUER', firstName: 'Pierre', ordre: 1 },
      { lastName: 'BEZ', firstName: 'Claude', ordre: 2 },
      { lastName: 'BEZ', firstName: 'Margrit', ordre: 3 },
      { lastName: 'CARDOSO', firstName: 'Maria', ordre: 4 },
      { lastName: 'CHAPELLE', firstName: 'Christiane', ordre: 5 },
      { lastName: 'CLAVER', firstName: 'Sylvain', ordre: 6 },
      { lastName: 'DUMAY', firstName: 'Anne', ordre: 7 },
      { lastName: 'DUMAY', firstName: 'Derissaint', ordre: 8 },
      { lastName: 'DUMAY', firstName: 'Gladinia', ordre: 9 },
      { lastName: 'DUMAY', firstName: 'Jacqueline', ordre: 10 },
      { lastName: 'DUMAY', firstName: 'Rico', ordre: 11 },
      { lastName: 'DUMAY', firstName: 'Wilsaint', ordre: 12 },
      { lastName: 'DUMAY', firstName: 'Wisler', ordre: 13 },
      { lastName: 'DUMAY', firstName: 'Zillamise', ordre: 14 },
      { lastName: 'DUMAY-KUHN', firstName: 'Aline', ordre: 15 },
      { lastName: 'FRANTZ', firstName: 'Christine', ordre: 16 },
      { lastName: 'GAENTZLER', firstName: 'Eric', ordre: 17 },
      { lastName: 'HAESSIG', firstName: 'Daniel', ordre: 18 },
      { lastName: 'HUREY', firstName: 'Liliane', ordre: 19 },
      { lastName: 'KUHN', firstName: 'Bernadette', ordre: 20 },
      { lastName: 'KUHN-PASTANT', firstName: 'Agathe', ordre: 21 },
      { lastName: 'LHERMENAULT', firstName: 'Mireille', ordre: 22 },
      { lastName: 'LHERMENAULT', firstName: 'Philippe', ordre: 23 },
      { lastName: 'OLHAGARAY', firstName: 'Catherine', ordre: 24 },
      { lastName: 'OLHAGARAY', firstName: 'Marie', ordre: 25 },
      { lastName: 'SCHLOSSER', firstName: 'Daphnée', ordre: 26 },
      { lastName: 'SCHLOSSER', firstName: 'Esther', ordre: 27 },
      { lastName: 'SCHLOSSER', firstName: 'Fabrice', ordre: 28 },
      { lastName: 'SCHLOSSER', firstName: 'Pierre', ordre: 29 },
      { lastName: 'SCHNEIDER', firstName: 'André', ordre: 30 },
      { lastName: 'SCHNEIDER', firstName: 'Clairette', ordre: 31 },
      { lastName: 'SIEGRIST', firstName: 'Jean-Pierre', ordre: 32 },
      { lastName: 'SIEGRIST', firstName: 'Miriam', ordre: 33 },
      { lastName: 'THOBOIS', firstName: 'Christophe', ordre: 34 },
      { lastName: 'THOBOIS', firstName: 'David', ordre: 35 },
      { lastName: 'WENTZ', firstName: 'Isabelle', ordre: 36 },
      { lastName: 'YA', firstName: 'Xialy', ordre: 37 },
      { lastName: 'LOUX', firstName: 'Benoit', ordre: 38 },
      { lastName: 'WANNER', firstName: 'Christiane', ordre: 39 },
    ].map((m) => ({ ...m, status: 'actif' as const }));

    try {
      const allData = [...conseilData, ...archiveData, ...membresActifs];
      const result = await importMembers(allData);
      toast({
        title: 'Import terminé',
        description: `${result.created} membres importés, ${result.errors} erreurs`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'import des données',
        variant: 'destructive',
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
          <h1 className="text-3xl font-bold mb-2">Gestion des Membres</h1>
          <p className="text-muted-foreground">
            Gérez la liste des membres de l'église EPLS
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">← Retour à l'administration</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts.all}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts.conseil}</p>
                  <p className="text-sm text-muted-foreground">Conseil</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts.actif}</p>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-500/10">
                  <Archive className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts.archive}</p>
                  <p className="text-sm text-muted-foreground">Archivés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions et filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Ajoutez ou modifiez des membres
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => handleCreate('actif')}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un membre
              </Button>
              <Button variant="outline" onClick={() => handleCreate('conseil')}>
                <Shield className="mr-2 h-4 w-4" />
                Ajouter au conseil
              </Button>
              <Button variant="outline" onClick={() => handleCreate('archive')}>
                <Archive className="mr-2 h-4 w-4" />
                Ajouter aux archives
              </Button>
              {members.length === 0 && (
                <Button variant="secondary" onClick={handleImportInitialData}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importer les données initiales
                </Button>
              )}
            </div>

            {/* Recherche */}
            <div className="pt-4 border-t">
              <div className="relative max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des membres avec onglets */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des membres</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  Tous ({counts.all})
                </TabsTrigger>
                <TabsTrigger value="conseil">
                  Conseil ({counts.conseil})
                </TabsTrigger>
                <TabsTrigger value="actif">
                  Membres ({counts.actif})
                </TabsTrigger>
                <TabsTrigger value="archive">
                  Archives ({counts.archive})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Chargement des membres...</p>
                  </div>
                ) : (
                  <ChurchMemberTable
                    members={filteredMembers}
                    onEdit={handleEdit}
                    onDelete={deleteMember}
                    onToggleActive={toggleActive}
                    showStatus={true}
                  />
                )}
              </TabsContent>

              <TabsContent value="conseil">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Chargement...</p>
                  </div>
                ) : (
                  <ChurchMemberTable
                    members={filteredMembers}
                    onEdit={handleEdit}
                    onDelete={deleteMember}
                    onToggleActive={toggleActive}
                    showStatus={false}
                  />
                )}
              </TabsContent>

              <TabsContent value="actif">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Chargement...</p>
                  </div>
                ) : (
                  <ChurchMemberTable
                    members={filteredMembers}
                    onEdit={handleEdit}
                    onDelete={deleteMember}
                    onToggleActive={toggleActive}
                    showStatus={false}
                  />
                )}
              </TabsContent>

              <TabsContent value="archive">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Chargement...</p>
                  </div>
                ) : (
                  <ChurchMemberTable
                    members={filteredMembers}
                    onEdit={handleEdit}
                    onDelete={deleteMember}
                    onToggleActive={toggleActive}
                    showStatus={false}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de formulaire */}
      <ChurchMemberFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSave}
        member={editingMember}
      />
    </div>
  );
}
