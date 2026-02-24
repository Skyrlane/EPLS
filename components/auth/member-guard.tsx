"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/use-user-data";
import { Loader2 } from "lucide-react";

/**
 * Niveau de permission par rôle — miroir du roleLevel() Firestore côté client.
 * Ordre croissant : ami (1) < membre (2) < conseil (3) < admin (4)
 */
const ROLE_LEVEL: Record<string, number> = {
  admin: 4,
  conseil: 3,
  membre: 2,
  member: 2,   // backward compat
  ami: 1,
  visitor: 1,  // backward compat
};

interface MemberGuardProps {
  children: React.ReactNode;
  minRole: 'ami' | 'membre' | 'conseil' | 'admin';
}

/**
 * Composant de protection pour les pages membres avec vérification de rôle.
 * Redirige vers /connexion si non authentifié, vers /acces-refuse si rôle insuffisant.
 *
 * Utilise useUserData() (pas useAuth) pour combiner auth loading + chargement Firestore
 * en un seul flag `loading`, évitant les redirections prématurées.
 */
export function MemberGuard({ children, minRole }: MemberGuardProps) {
  const { user, userData, loading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    // Attendre que auth + Firestore soient tous deux chargés
    if (loading) return;

    // Si pas connecté, rediriger vers connexion avec callbackUrl
    if (!user) {
      router.replace(
        `/connexion?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    // Si connecté mais rôle insuffisant, rediriger vers accès refusé
    const userLevel = ROLE_LEVEL[userData?.role ?? 'ami'] ?? 1;
    const requiredLevel = ROLE_LEVEL[minRole] ?? 1;
    if (userLevel < requiredLevel) {
      router.replace('/acces-refuse');
      return;
    }
  }, [user, userData, loading, minRole, router]);

  // État de chargement — attendre auth + Firestore
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

  // Pas connecté — redirection en cours
  if (!user) {
    return null;
  }

  // Rôle insuffisant — redirection en cours
  const userLevel = ROLE_LEVEL[userData?.role ?? 'ami'] ?? 1;
  const requiredLevel = ROLE_LEVEL[minRole] ?? 1;
  if (userLevel < requiredLevel) {
    return null;
  }

  // Accès autorisé — afficher le contenu
  return <>{children}</>;
}
