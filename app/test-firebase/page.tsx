'use client';

import { useRealtimeCollection } from '@/hooks/use-realtime-collection';
import { where } from 'firebase/firestore';
import type { Echo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

/**
 * Page de test pour diagnostiquer les problèmes Firebase avec la collection 'echos'
 *
 * Accéder à : http://localhost:3000/test-firebase
 */
export default function TestFirebasePage() {
  // Test 1 : Query simple sur la collection 'echos'
  const { data: echos, loading, error } = useRealtimeCollection<Echo>({
    collectionName: 'echos',
    queryConstraints: [
      where('status', '==', 'published')
    ]
  });

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Test Firebase - Collection Echos</h1>

      <div className="space-y-6">
        {/* État de chargement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {!loading && !error && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {error && <XCircle className="h-5 w-5 text-red-500" />}
              État de la connexion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Chargement :</strong> {loading ? '⏳ En cours...' : '✅ Terminé'}
              </p>
              <p>
                <strong>Erreur :</strong> {error ? '❌ Oui' : '✅ Non'}
              </p>
              <p>
                <strong>Données reçues :</strong> {echos ? `✅ ${echos.length} document(s)` : '⏳ En attente...'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Détails de l'erreur */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erreur détectée</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p className="font-mono text-sm bg-red-950/20 p-3 rounded">
                  {error?.message || String(error)}
                </p>

                <div className="mt-4 text-sm space-y-1">
                  <p><strong>Causes possibles :</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>La collection 'echos' n'existe pas dans Firestore</li>
                    <li>Les règles Firestore bloquent la lecture</li>
                    <li>Firebase n'est pas correctement configuré (.env.local)</li>
                    <li>Problème de connexion réseau</li>
                  </ul>
                </div>

                <div className="mt-4 text-sm space-y-1">
                  <p><strong>Solutions :</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Vérifier que Firebase est configuré dans .env.local</li>
                    <li>Créer la collection 'echos' dans Firestore (voir SETUP_ECHOS.md)</li>
                    <li>Vérifier les règles Firestore : allow read: if true;</li>
                    <li>Ouvrir la console navigateur (F12) pour plus de détails</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Données reçues */}
        {!loading && !error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Données récupérées avec succès
              </CardTitle>
            </CardHeader>
            <CardContent>
              {echos && echos.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-green-600 font-semibold">
                    ✅ {echos.length} écho(s) trouvé(s) dans Firestore !
                  </p>

                  <div className="space-y-3">
                    {echos.map((echo) => (
                      <div key={echo.id} className="border rounded p-4 bg-gray-50 dark:bg-gray-900">
                        <h3 className="font-bold text-lg mb-2">{echo.title}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><strong>Mois :</strong> {echo.month}</p>
                          <p><strong>Année :</strong> {echo.year}</p>
                          <p><strong>Status :</strong> {echo.status}</p>
                          <p><strong>PDF URL :</strong>
                            <a href={echo.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                              Voir
                            </a>
                          </p>
                        </div>
                        {echo.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {echo.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTitle>Aucun écho trouvé</AlertTitle>
                  <AlertDescription>
                    <p className="mb-3">
                      La collection 'echos' existe mais ne contient aucun document avec status="published".
                    </p>
                    <p className="text-sm">
                      <strong>Pour ajouter des échos de test :</strong> Consultez le fichier SETUP_ECHOS.md
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informations sur la configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Firebase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Project ID :</strong>{' '}
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Non configuré'}
              </p>
              <p>
                <strong>Collection :</strong> echos
              </p>
              <p>
                <strong>Query :</strong> where('status', '==', 'published')
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle>📖 Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>1. Si vous voyez une erreur :</strong> Vérifiez la configuration Firebase dans .env.local
            </p>
            <p>
              <strong>2. Si "Aucun écho trouvé" :</strong> Ajoutez des données de test en suivant SETUP_ECHOS.md
            </p>
            <p>
              <strong>3. Si tout fonctionne :</strong> Les échos s'afficheront automatiquement sur la page d'accueil et /echo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
