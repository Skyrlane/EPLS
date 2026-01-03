'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Smartphone, MapPin, Search, BookUser } from 'lucide-react';
import { useContacts } from '@/hooks/use-contacts';

const LETTERS = [
  'ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

export function ContactsSection() {
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Le hook se recharge automatiquement
  const { contacts, loading, error } = useContacts({
    activeOnly: true,
    autoLoad: true,
  });

  // Filtrage côté client par lettre et recherche
  const filteredContacts = contacts.filter((contact) => {
    // Filtre par lettre
    const matchesLetter =
      selectedLetter === 'ALL' ||
      contact.lastName.toUpperCase().startsWith(selectedLetter);

    // Filtre par recherche
    const matchesSearch =
      searchTerm === '' ||
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.city?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesLetter && matchesSearch;
  });

  // Debug logs
  useEffect(() => {
    console.log('📇 ContactsSection mounted/updated', {
      selectedLetter,
      searchTerm,
      contactsCount: contacts.length,
      filteredCount: filteredContacts.length,
      loading,
      error,
    });
  }, [selectedLetter, searchTerm, contacts, filteredContacts, loading, error]);

  return (
    <section id="carnet-adresses" className="scroll-mt-20">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookUser className="h-6 w-6 text-primary" />
            Carnet d&apos;Adresses
          </h2>

          {/* Recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, prénom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Navigation alphabétique */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Navigation alphabétique
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {LETTERS.map((letter) => {
                const isSelected = selectedLetter === letter;

                return (
                  <Button
                    key={letter}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLetter(letter)}
                    className="whitespace-nowrap min-w-[40px]"
                  >
                    {letter === 'ALL' ? 'Tous' : letter}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Liste des contacts */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <BookUser className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Aucun contact trouvé pour cette recherche'
                  : selectedLetter !== 'ALL'
                  ? `Aucun contact pour la lettre ${selectedLetter}`
                  : 'Aucun contact disponible'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grouper par lettre si "Tous" est sélectionné */}
              {selectedLetter === 'ALL' ? (
                LETTERS.slice(1).map((letter) => {
                  const contactsForLetter = filteredContacts.filter((c) =>
                    c.lastName.toUpperCase().startsWith(letter)
                  );

                  if (contactsForLetter.length === 0) return null;

                  return (
                    <div key={letter} className="space-y-3">
                      <h3 className="text-2xl font-bold text-primary border-b border-primary pb-2">
                        {letter}
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {contactsForLetter.map((contact) => (
                          <ContactCard key={contact.id} contact={contact} />
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Statistiques */}
          {!loading && filteredContacts.length > 0 && (
            <div className="mt-6 text-sm text-muted-foreground text-center">
              {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''}{' '}
              {searchTerm && 'trouvé(s)'}
              {selectedLetter !== 'ALL' && `pour la lettre ${selectedLetter}`}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// Composant pour afficher une carte de contact
function ContactCard({ contact }: { contact: any }) {
  return (
    <Card className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Nom complet */}
          <div>
            <p className="font-semibold text-lg uppercase">
              {contact.lastName}
            </p>
            <p className="text-base text-muted-foreground">
              {contact.firstName}
            </p>
          </div>

          {/* Badge membre */}
          {contact.isMember && (
            <Badge variant="default" className="bg-green-600">
              Membre
            </Badge>
          )}

          {/* Coordonnées */}
          <div className="space-y-1.5 pt-2 text-sm">
            {/* Email */}
            {contact.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary hover:underline break-all"
                >
                  {contact.email}
                </a>
              </div>
            )}

            {/* Téléphone fixe */}
            {contact.phoneFixed && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`tel:${contact.phoneFixed.replace(/\s/g, '')}`}
                  className="text-primary hover:underline"
                >
                  {contact.phoneFixed}
                </a>
              </div>
            )}

            {/* Téléphone mobile */}
            {contact.phoneMobile && (
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`tel:${contact.phoneMobile.replace(/\s/g, '')}`}
                  className="text-primary hover:underline"
                >
                  {contact.phoneMobile}
                </a>
              </div>
            )}

            {/* Adresse */}
            {(contact.address || contact.city) && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  {contact.address && <div>{contact.address}</div>}
                  {(contact.postalCode || contact.city) && (
                    <div>
                      {contact.postalCode} {contact.city}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
