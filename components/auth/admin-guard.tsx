"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/use-user-data";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Composant de protection pour les pages admin
 * Vérifie que l'utilisateur est connecté ET administrateur
 * Redirige automatiquement sinon
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, userData, loading, isAdmin } = useUserData();
  const router = useRouter();

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (loading) return;

    // Si pas connecté, rediriger vers login avec returnUrl
    if (!user) {
      router.replace("/connexion?callbackUrl=/admin");
      return;
    }

    // Si connecté mais pas admin, rediriger vers accueil
    if (!isAdmin) {
      router.replace("/");
      return;
    }
  }, [user, isAdmin, loading, router]);

  // État de chargement
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Vérification des permissions...
          </p>
        </div>
      </div>
    );
  }

  // Si pas connecté ou pas admin, ne rien afficher (redirection en cours)
  if (!user || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Accès refusé</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette page est réservée aux administrateurs.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Redirection en cours...
          </p>
        </div>
      </div>
    );
  }

  // Utilisateur admin, afficher le contenu
  return <>{children}</>;
}
