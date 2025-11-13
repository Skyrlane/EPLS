import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Exemple d'Authentification | EPLS",
  description: "Démonstration des composants d'authentification pour le site de l'EPLS",
};

export default function AuthExamplePage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/exemples" className="hover:text-foreground">
            Exemples
          </Link>
          <span>/</span>
          <span>Authentification</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Système d'Authentification</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Présentation des composants et du flux d'authentification
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="p-6 bg-card rounded-lg border">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl">Vue d'ensemble</CardTitle>
            <CardDescription>
              L'authentification est gérée par Firebase Authentication, avec plusieurs méthodes disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 prose">
            <p>
              Le système d'authentification de l'EPLS est basé sur Firebase Authentication, ce qui permet
              une gestion sécurisée des utilisateurs avec plusieurs fonctionnalités essentielles :
            </p>
            
            <ul>
              <li>Connexion par email et mot de passe</li>
              <li>Récupération de mot de passe</li>
              <li>Profils utilisateurs personnalisés</li>
              <li>Gestion des rôles et permissions</li>
              <li>Session persistante ou temporaire</li>
            </ul>
            
            <h3>Architecture des composants</h3>
            
            <p>
              Le système utilise un contexte React (<code>AuthProvider</code>) qui encapsule toute la logique
              d'authentification et la rend disponible à travers l'application via un hook personnalisé (<code>useAuth</code>).
            </p>
            
            <div className="not-prose bg-muted p-4 rounded-md my-4">
              <code className="text-sm whitespace-pre">
{`// Utilisation du hook d'authentification
const { user, login, logout, isLoading } = useAuth();

// Vérification de l'état d'authentification
if (isLoading) return <Loader />;
if (!user) return <LoginForm />;

// L'utilisateur est connecté
return <UserDashboard user={user} />;`}
              </code>
            </div>
            
            <h3>Flux d'authentification</h3>
            
            <ol>
              <li>L'utilisateur accède à la page de connexion</li>
              <li>Il saisit ses identifiants (email/mot de passe)</li>
              <li>Firebase vérifie les informations d'identification</li>
              <li>Si valides, un jeton d'authentification est généré</li>
              <li>Le contexte d'authentification est mis à jour avec les informations de l'utilisateur</li>
              <li>L'utilisateur est redirigé vers la page protégée</li>
            </ol>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Composants principaux</CardTitle>
              <CardDescription>Structure des fichiers et composants clés</CardDescription>
            </CardHeader>
            <CardContent className="prose">
              <ul>
                <li><code>auth-provider.tsx</code> - Contexte d'authentification</li>
                <li><code>login-form.tsx</code> - Formulaire de connexion</li>
                <li><code>profile-card.tsx</code> - Affichage du profil utilisateur</li>
                <li><code>Reset-password.tsx</code> - Réinitialisation de mot de passe</li>
                <li><code>firebase.ts</code> - Configuration de Firebase</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité et bonnes pratiques</CardTitle>
              <CardDescription>Mesures de sécurité implémentées</CardDescription>
            </CardHeader>
            <CardContent className="prose">
              <ul>
                <li>Validation des formulaires avec Zod</li>
                <li>Protection des routes sensibles</li>
                <li>Gestion des erreurs d'authentification</li>
                <li>Déconnexion automatique (session temporaire)</li>
                <li>Mesures contre les tentatives excessives</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exemple de code</CardTitle>
            <CardDescription>Utilisation du contexte d'authentification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                <code>{`// Composant protégé nécessitant une authentification
"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/auth/login-form";
import { ProfileCard } from "@/components/auth/profile-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedPage() {
  // Récupération du contexte d'authentification
  const { user, isLoading } = useAuth();
  
  // Affichage d'un état de chargement
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
    );
  }
  
  // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    return <LoginForm callbackUrl="/membres" />;
  }
  
  // Affichage du contenu protégé si l'utilisateur est connecté
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Bienvenue, {user.displayName}!</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <ProfileCard user={user} allowEdit />
        <div>
          {/* Contenu supplémentaire protégé */}
        </div>
      </div>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/exemples" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux exemples
          </Link>
        </Button>
      </div>
    </div>
  );
} 