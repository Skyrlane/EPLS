'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactsSection } from "@/components/infos-docs/ContactsSection"
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '../components/Sidebar';

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

  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Carnet d&apos;Adresses</h1>

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
                  <span className="text-muted-foreground">Carnet d&apos;adresses</span>
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
