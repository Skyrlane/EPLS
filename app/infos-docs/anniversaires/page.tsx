'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BirthdaysSection } from "@/components/infos-docs/BirthdaysSection"
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '../components/Sidebar';

export default function AnniversairesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect si non authentifié
  useEffect(() => {
    if (!loading && !user) {
      router.push('/connexion?redirect=/infos-docs/anniversaires');
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
  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Anniversaires</h1>

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
                  <span className="mx-2 text-muted-foreground">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos/Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Anniversaires</span>
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
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Anniversaires des Membres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground mb-6">
                      Découvrez les dates d'anniversaire des membres de notre église. 
                      Sélectionnez un mois pour voir tous les anniversaires de cette période.
                    </p>
                  </CardContent>
                </Card>

                {/* Section des anniversaires */}
                <BirthdaysSection />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
