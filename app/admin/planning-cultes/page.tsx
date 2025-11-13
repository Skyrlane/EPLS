"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentPlanning } from "@/hooks/use-current-planning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlanningImporter } from "@/components/admin/PlanningImporter";
import { PlanningEditor } from "@/components/admin/PlanningEditor";
import { Loader2, Calendar } from "lucide-react";

export default function AdminPlanningCultesPage() {
  const { user, loading: authLoading } = useAuth();
  const { planning, loading: planningLoading, error } = useCurrentPlanning();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/connexion?callbackUrl=/admin/planning-cultes");
    }
  }, [user, authLoading, router]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    // Force un re-render qui va recharger le planning
    window.location.reload();
  };

  // Si en cours de chargement auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Si pas connecté
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Administration du Planning des Cultes</h1>
          <p className="text-muted-foreground">
            Importez et gérez le planning mensuel des services
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/membres">← Retour à l&apos;espace membres</Link>
        </Button>
      </div>

      <Tabs defaultValue="import" className="w-full" key={refreshKey}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Importer le Planning</TabsTrigger>
          <TabsTrigger value="current">
            Planning Actuel
            {planning && ` (${planning.title})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Importer un nouveau planning</CardTitle>
              <CardDescription>
                Collez le code HTML du planning pour l&apos;importer automatiquement.
                Le système détectera le mois et l&apos;année et remplacera l&apos;ancien planning si nécessaire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanningImporter onImportComplete={handleRefresh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning du mois en cours</CardTitle>
              <CardDescription>
                Modifiez les lignes individuellement ou supprimez le planning complet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {planningLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Chargement du planning...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Erreur lors du chargement du planning
                  </AlertDescription>
                </Alert>
              ) : !planning ? (
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    Aucun planning disponible pour le mois en cours.
                    Utilisez l&apos;onglet &quot;Importer le Planning&quot; pour en créer un.
                  </AlertDescription>
                </Alert>
              ) : (
                <PlanningEditor planning={planning} onUpdate={handleRefresh} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
