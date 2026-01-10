'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactsSection } from "@/components/infos-docs/ContactsSection"
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '../components/Sidebar';
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

export default function CarnetAdressesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect si non authentifié
  useEffect(() => {
    if (!loading && !user) {
      router.push('/connexion?redirect=/infos-docs/carnet-adresses');
    }
  }, [user, loading, router]);

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

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "Carnet d'adresses", href: "/infos-docs/carnet-adresses", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Carnet d'Adresses"
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
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Coordonnées des Membres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground mb-4">
                      Accédez aux coordonnées des membres de notre communauté.
                      Utilisez la navigation alphabétique ou la recherche pour trouver rapidement un contact.
                    </p>
                    <div className="bg-secondary/20 border border-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-secondary-foreground">
                        <strong>Note :</strong> Ces informations sont confidentielles et réservées aux membres connectés.
                        Merci de ne pas les partager en dehors de notre communauté.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section des contacts */}
                <ContactsSection />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
