'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cake } from 'lucide-react';
import { useBirthdays } from '@/hooks/use-birthdays';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function BirthdaysSection() {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  // Le hook se recharge automatiquement quand selectedMonth change
  const { birthdays, loading, error, getAllBirthdays } = useBirthdays({
    month: selectedMonth,
    activeOnly: false,
    autoLoad: true, // ← Chargement automatique activé
  });

  // Debug logs
  useEffect(() => {
    console.log('🎂 BirthdaysSection mounted/updated', {
      selectedMonth,
      birthdaysCount: birthdays.length,
      loading,
      error
    });
  }, [selectedMonth, birthdays, loading, error]);

  return (
    <section id="anniversaires" className="scroll-mt-20">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Cake className="h-6 w-6 text-primary" />
            Anniversaires des Membres
          </h2>

          {/* Navigation par mois */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Sélectionnez un mois pour voir les anniversaires
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {MONTHS.map((month, index) => {
                const monthValue = index + 1;
                const isSelected = selectedMonth === monthValue;
                const isCurrent = currentMonth === monthValue;

                return (
                  <Button
                    key={monthValue}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMonth(monthValue)}
                    className={`
                      whitespace-nowrap
                      ${isCurrent && !isSelected ? 'border-primary' : ''}
                    `}
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Liste des anniversaires */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : birthdays.length === 0 ? (
            <div className="text-center py-8">
              <Cake className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Aucun anniversaire ce mois-ci
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {birthdays.map((birthday) => (
                <Card
                  key={birthday.id}
                  className="bg-muted/50 border-l-4 border-l-primary"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">
                          {birthday.firstName} {birthday.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {birthday.day} {MONTHS[birthday.month - 1]}
                        </p>
                      </div>
                      <Cake className="h-6 w-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistiques */}
          {!loading && birthdays.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {birthdays.length} anniversaire{birthdays.length > 1 ? 's' : ''} en{' '}
              {MONTHS[selectedMonth - 1]}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
