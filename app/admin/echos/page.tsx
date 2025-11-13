"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, getDocs, query, orderBy, where, addDoc, Timestamp } from "firebase/firestore";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EchoUploader } from "@/components/admin/EchoUploader";
import { EchoListAdmin } from "@/components/admin/EchoListAdmin";
import { useToast } from "@/hooks/use-toast";
import type { Echo } from "@/types";
import { Loader2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminEchosPage() {
  const [echos, setEchos] = useState<Echo[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    total: number;
    imported: number;
    skipped: number;
    errors: number;
  } | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/connexion?callbackUrl=/admin/echos");
    }
  }, [user, authLoading, router]);

  // Charger les échos depuis Firestore
  useEffect(() => {
    if (user) {
      loadEchos();
    }
  }, [user]);

  const loadEchos = async () => {
    try {
      setLoading(true);
      const echosQuery = query(
        collection(firestore, "echos"),
        orderBy("year", "desc"),
        orderBy("month", "desc")
      );
      
      const querySnapshot = await getDocs(echosQuery);
      const loadedEchos: Echo[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedEchos.push({
          id: doc.id,
          title: data.title,
          description: data.description || undefined,
          month: data.month,
          year: data.year,
          edition: data.edition,
          pdfUrl: data.pdfUrl,
          pdfFileName: data.pdfFileName,
          coverUrl: data.coverUrl,
          coverImageUrl: data.coverImageUrl,
          fileSize: data.fileSize,
          isActive: data.isActive ?? true,
          publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
          status: data.status || "published",
        });
      });

      setEchos(loadedEchos);
    } catch (error) {
      console.error("Erreur lors du chargement des échos:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les échos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'import depuis Storage
  const importFromStorage = async () => {
    setImporting(true);
    setImportStatus({ total: 0, imported: 0, skipped: 0, errors: 0 });

    try {
      // 1. Lister tous les fichiers dans /echos
      const echosRef = ref(storage, "echos");
      const result = await listAll(echosRef);

      setImportStatus((prev) => ({ ...prev!, total: result.items.length }));

      const MONTH_NAMES = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
      ];

      // 2. Pour chaque fichier
      for (const itemRef of result.items) {
        const fileName = itemRef.name;

        // Parser le nom : 2025-01-echo.pdf
        const match = fileName.match(/(\d{4})-(\d{2})-echo\.pdf/);
        if (!match) {
          setImportStatus((prev) => ({ ...prev!, skipped: prev!.skipped + 1 }));
          continue;
        }

        const year = parseInt(match[1]);
        const month = parseInt(match[2]);

        // Vérifier si existe déjà
        const existingQuery = query(
          collection(firestore, "echos"),
          where("year", "==", year),
          where("month", "==", month)
        );
        const existingSnap = await getDocs(existingQuery);

        if (!existingSnap.empty) {
          setImportStatus((prev) => ({ ...prev!, skipped: prev!.skipped + 1 }));
          continue;
        }

        try {
          // Récupérer URL et métadonnées
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);

          // Créer document Firestore
          const title = `L'Écho - ${MONTH_NAMES[month - 1]} ${year}`;

          await addDoc(collection(firestore, "echos"), {
            title,
            month,
            year,
            pdfUrl: url,
            pdfFileName: fileName,
            fileSize: metadata.size,
            isActive: true,
            status: "published",
            publishedAt: Timestamp.now(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          setImportStatus((prev) => ({ ...prev!, imported: prev!.imported + 1 }));
        } catch (error) {
          console.error(`Erreur pour ${fileName}:`, error);
          setImportStatus((prev) => ({ ...prev!, errors: prev!.errors + 1 }));
        }
      }

      toast({
        title: "Succès",
        description: `Import terminé ! ${importStatus?.imported || 0} échos importés`,
      });

      // Rafraîchir la liste
      await loadEchos();
    } catch (error: any) {
      console.error("Erreur import:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'import",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
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
          <h1 className="text-3xl font-bold mb-2">Administration des Échos</h1>
          <p className="text-muted-foreground">
            Gérez les numéros de l&apos;Écho EPLS (journal mensuel)
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/membres">← Retour à l&apos;espace membres</Link>
        </Button>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Ajouter un Écho</TabsTrigger>
          <TabsTrigger value="list">
            Échos Existants ({echos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Publier un nouvel Écho</CardTitle>
              <CardDescription>
                Uploadez le fichier PDF et les informations du nouveau numéro.
                Le système détectera automatiquement les doublons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EchoUploader />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Échos existants</CardTitle>
                  <CardDescription>
                    Gérez les échos : modifier, activer/désactiver, supprimer
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={importFromStorage}
                    disabled={importing || loading}
                    title="Synchronise les PDFs déjà présents dans Firebase Storage vers Firestore"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Import...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Importer depuis Storage
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={loadEchos}
                    disabled={loading || importing}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      "Actualiser"
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress pendant l'import */}
              {importing && importStatus && (
                <Alert className="mb-4">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Import en cours : {importStatus.total} fichiers trouvés</p>
                      <Progress 
                        value={
                          importStatus.total > 0
                            ? ((importStatus.imported + importStatus.skipped + importStatus.errors) / importStatus.total) * 100
                            : 0
                        } 
                      />
                      <div className="text-sm text-muted-foreground flex gap-4">
                        <span>✅ Importés : {importStatus.imported}</span>
                        <span>⏭️ Ignorés : {importStatus.skipped}</span>
                        <span>❌ Erreurs : {importStatus.errors}</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Chargement des échos...</p>
                </div>
              ) : echos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucun écho pour le moment.</p>
                  <p className="text-sm mt-2">
                    Utilisez l&apos;onglet &quot;Ajouter un Écho&quot; pour publier le premier numéro.
                  </p>
                </div>
              ) : (
                <EchoListAdmin echos={echos} onUpdate={loadEchos} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
