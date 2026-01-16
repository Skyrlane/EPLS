'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useChurchMembers } from '@/hooks/use-church-members';
import { useContacts } from '@/hooks/use-contacts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Sidebar from '../components/Sidebar';
import { PageHeader } from '@/components/ui/page-header';
import { BreadcrumbItem } from '@/components/ui/breadcrumbs';
import {
  Users,
  User,
  ShieldCheck,
  UserCheck,
  Archive,
  Search
} from 'lucide-react';
import type { ChurchMember, Contact } from '@/types';

export default function MembresPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { members: churchMembers, loading: membersLoading } = useChurchMembers({ autoLoad: true });
  const { contacts, loading: contactsLoading } = useContacts({ autoLoad: true });
  const [searchTerm, setSearchTerm] = useState('');

  // Fusionner les membres ChurchMember avec les contacts ayant isMember = true
  const members = useMemo(() => {
    // Transformer les contacts membres en format ChurchMember
    // Note: on utilise === true pour gérer le cas où isMember serait undefined
    const contactsAsMembers: ChurchMember[] = contacts
      .filter((contact: Contact) => contact.isMember === true && contact.isActive !== false)
      .map((contact: Contact) => ({
        id: `contact-${contact.id}`,
        lastName: contact.lastName,
        firstName: contact.firstName,
        status: 'actif' as const,
        ordre: 9999, // Les mettre après les membres manuels
        isActive: true,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      }));

    // Combiner les deux listes
    return [...churchMembers, ...contactsAsMembers];
  }, [churchMembers, contacts]);

  // Redirect si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?redirect=/infos-docs/membres');
    }
  }, [user, authLoading, router]);

  // Séparer les membres par catégorie
  const { conseilMembers, archivedMembers, allActiveMembers } = useMemo(() => {
    const conseil = members
      .filter((m) => m.status === 'conseil' && m.isActive)
      .sort((a, b) => a.ordre - b.ordre);

    const archived = members
      .filter((m) => m.status === 'archive')
      .sort((a, b) => a.ordre - b.ordre);

    // Tous les membres actifs (statut 'actif' ou 'conseil'), dédupliqués par nom+prénom
    const activeAndConseil = members
      .filter((m) => (m.status === 'actif' || m.status === 'conseil') && m.isActive)
      .sort((a, b) => a.ordre - b.ordre || a.lastName.localeCompare(b.lastName));
    
    // Dédupliquer par nom + prénom (garder la première occurrence)
    const seen = new Set<string>();
    const active = activeAndConseil.filter((m) => {
      const key = `${m.lastName.toUpperCase()}-${m.firstName.toUpperCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      conseilMembers: conseil,
      archivedMembers: archived,
      allActiveMembers: active,
    };
  }, [members]);

  // Filtrer les membres selon le terme de recherche
  const filteredMembers = useMemo(() => {
    if (!searchTerm) return allActiveMembers;
    const lowerSearch = searchTerm.toLowerCase();
    return allActiveMembers.filter(
      (member) =>
        member.lastName.toLowerCase().includes(lowerSearch) ||
        member.firstName.toLowerCase().includes(lowerSearch)
    );
  }, [allActiveMembers, searchTerm]);

  // Loading state
  if (authLoading || membersLoading || contactsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié (ne devrait jamais arriver grâce au useEffect)
  if (!user) {
    return null;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "Membres", href: "/infos-docs/membres", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Liste des membres"
        breadcrumbs={breadcrumbItems}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Membres du Conseil</p>
                          <p className="text-3xl font-bold">{conseilMembers.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-primary opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Membres</p>
                          <p className="text-3xl font-bold">{allActiveMembers.length}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-primary opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Membres archivés</p>
                          <p className="text-3xl font-bold">{archivedMembers.length}</p>
                        </div>
                        <Archive className="h-8 w-8 text-primary opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Section 1 : Membres du Conseil */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Membres du Conseil de l&apos;EPLS
                  </h2>

                  {conseilMembers.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Aucun membre du conseil enregistré
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {conseilMembers.map((member) => (
                        <Card key={member.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate">
                                  {member.firstName} {member.lastName}
                                </h3>
                                {member.conseilFunction && (
                                  <Badge variant="secondary" className="mt-1">
                                    {member.conseilFunction}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2 : Visible par le conseil uniquement */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6" />
                    Visible par le conseil uniquement
                  </h2>

                  <Card>
                    <CardContent className="p-0">
                      {archivedMembers.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          Aucun membre archivé
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Prénom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Observations
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Radiée
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {archivedMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {member.lastName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {member.firstName}
                                  </td>
                                  <td className="px-6 py-4 text-muted-foreground">
                                    {member.observations || '-'}
                                  </td>
                                  <td className="px-6 py-4 text-destructive">
                                    {member.dateRadiation || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Section 3 : Tous les membres */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Membres de l&apos;EPLS ({filteredMembers.length})
                  </h2>

                  {/* Barre de recherche */}
                  <div className="mb-4">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un membre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      {filteredMembers.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          {searchTerm
                            ? `Aucun membre trouvé pour "${searchTerm}"`
                            : 'Aucun membre enregistré'}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                                  #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Prénom
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {filteredMembers.map((member, index) => (
                                <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                                    {index + 1}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {member.lastName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {member.firstName}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
