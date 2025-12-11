'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Sidebar from '../components/Sidebar';
import { 
  Users, 
  User, 
  ShieldCheck, 
  UserCheck, 
  Archive, 
  Lock,
  Search
} from 'lucide-react';

// Types
interface ConseilMember {
  nom: string;
  prenom: string;
  fonction: string;
}

interface ConseilOnlyMember {
  nom: string;
  prenom: string;
  observations: string;
  radiee: string;
}

interface AllMember {
  num: number;
  nom: string;
  prenom: string;
}

// Données - Membres du Conseil de l'EPLS
const conseilMembers: ConseilMember[] = [
  { nom: 'SCHNEIDER', prenom: 'Clairette', fonction: 'Secrétaire' },
  { nom: 'SIEGRIST', prenom: 'Miriam', fonction: 'Présidente' },
  { nom: 'DUMAY', prenom: 'Wisler', fonction: 'Trésorier' },
  { nom: 'THOBOIS', prenom: 'Christophe', fonction: 'Vice-Président' },
];

// Données - Visible par le conseil uniquement
const conseilOnly: ConseilOnlyMember[] = [
  { nom: 'THOMAS', prenom: 'Marion', observations: 'Décédée le 8 juin 2019', radiee: 'radiée' },
  { nom: 'FRANTZ', prenom: 'Christine', observations: 'Décédée le 18 janvier 2021', radiee: '' },
  { nom: 'HERRENSCHMIDT', prenom: 'Patrice', observations: 'démission', radiee: 'radiée le 14 mars 2021' },
  { nom: 'HERRENSCHMIDT', prenom: 'Y-Lê', observations: 'démission', radiee: 'radiée le 14 mars 2021' },
  { nom: 'MBUAKI', prenom: 'Dédé', observations: 'reparti en Afrique', radiee: 'radiée le 14 mars 2021' },
  { nom: 'RAPHAËL', prenom: 'Monalise', observations: 'veut rester membre', radiee: 'contactée après le 14 mars 2021' },
  { nom: 'GUILLEMOT', prenom: 'Denise', observations: 'démission', radiee: 'datée du 28/08/2021' },
];

// Données - Tous les membres de l'EPLS (39 personnes)
const allMembers: AllMember[] = [
  { num: 1, nom: 'BAUER', prenom: 'Pierre' },
  { num: 2, nom: 'BEZ', prenom: 'Claude' },
  { num: 3, nom: 'BEZ', prenom: 'Margrit' },
  { num: 4, nom: 'CARDOSO', prenom: 'Maria' },
  { num: 5, nom: 'CHAPELLE', prenom: 'Christiane' },
  { num: 6, nom: 'CLAVER', prenom: 'Sylvain' },
  { num: 7, nom: 'DUMAY', prenom: 'Anne' },
  { num: 8, nom: 'DUMAY', prenom: 'Derissaint' },
  { num: 9, nom: 'DUMAY', prenom: 'Gladinia' },
  { num: 10, nom: 'DUMAY', prenom: 'Jacqueline' },
  { num: 11, nom: 'DUMAY', prenom: 'Rico' },
  { num: 12, nom: 'DUMAY', prenom: 'Wilsaint' },
  { num: 13, nom: 'DUMAY', prenom: 'Wisler' },
  { num: 14, nom: 'DUMAY', prenom: 'Zillamise' },
  { num: 15, nom: 'DUMAY-KUHN', prenom: 'Aline' },
  { num: 16, nom: 'FRANTZ', prenom: 'Christine' },
  { num: 17, nom: 'GAENTZLER', prenom: 'Eric' },
  { num: 18, nom: 'HAESSIG', prenom: 'Daniel' },
  { num: 19, nom: 'HUREY', prenom: 'Liliane' },
  { num: 20, nom: 'KUHN', prenom: 'Bernadette' },
  { num: 21, nom: 'KUHN-PASTANT', prenom: 'Agathe' },
  { num: 22, nom: 'LHERMENAULT', prenom: 'Mireille' },
  { num: 23, nom: 'LHERMENAULT', prenom: 'Philippe' },
  { num: 24, nom: 'OLHAGARAY', prenom: 'Catherine' },
  { num: 25, nom: 'OLHAGARAY', prenom: 'Marie' },
  { num: 26, nom: 'SCHLOSSER', prenom: 'Daphnée' },
  { num: 27, nom: 'SCHLOSSER', prenom: 'Esther' },
  { num: 28, nom: 'SCHLOSSER', prenom: 'Fabrice' },
  { num: 29, nom: 'SCHLOSSER', prenom: 'Pierre' },
  { num: 30, nom: 'SCHNEIDER', prenom: 'André' },
  { num: 31, nom: 'SCHNEIDER', prenom: 'Clairette' },
  { num: 32, nom: 'SIEGRIST', prenom: 'Jean-Pierre' },
  { num: 33, nom: 'SIEGRIST', prenom: 'Miriam' },
  { num: 34, nom: 'THOBOIS', prenom: 'Christophe' },
  { num: 35, nom: 'THOBOIS', prenom: 'David' },
  { num: 36, nom: 'WENTZ', prenom: 'Isabelle' },
  { num: 37, nom: 'YA', prenom: 'Xialy' },
  { num: 38, nom: 'LOUX', prenom: 'Benoit' },
  { num: 39, nom: 'WANNER', prenom: 'Christiane' },
];

export default function MembresPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect si non authentifié
  useEffect(() => {
    if (!loading && !user) {
      router.push('/connexion?redirect=/infos-docs/membres');
    }
  }, [user, loading, router]);

  // Filtrer les membres selon le terme de recherche
  const filteredMembers = allMembers.filter(
    (member) =>
      member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
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

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Liste des membres</h1>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-primary hover:text-primary/80">
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos/Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">Liste des membres</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

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
                          <p className="text-3xl font-bold">{allMembers.length}</p>
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
                          <p className="text-3xl font-bold">{conseilOnly.length}</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {conseilMembers.map((member, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {member.prenom} {member.nom}
                              </h3>
                              {member.fonction && (
                                <Badge variant="secondary" className="mt-1">
                                  {member.fonction}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Section 2 : Visible par le conseil uniquement */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6" />
                    Visible par le conseil uniquement
                  </h2>

                  <Card>
                    <CardContent className="p-0">
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
                            {conseilOnly.map((member, index) => (
                              <tr key={index} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                  {member.nom}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {member.prenom}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                  {member.observations}
                                </td>
                                <td className="px-6 py-4 text-destructive">
                                  {member.radiee}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
                            {filteredMembers.length > 0 ? (
                              filteredMembers.map((member) => (
                                <tr key={member.num} className="hover:bg-muted/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                                    {member.num}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {member.nom}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {member.prenom}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                  Aucun membre trouvé pour "{searchTerm}"
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
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