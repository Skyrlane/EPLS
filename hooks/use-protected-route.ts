"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { hasRole } from "@/lib/firebase-helpers";

interface UseProtectedRouteOptions {
  redirectTo?: string;
  requiredRole?: string | string[];
  checkRole?: boolean;
}

/**
 * Hook pour protéger les routes qui nécessitent une authentification
 * et éventuellement un rôle spécifique
 */
export function useProtectedRoute({
  redirectTo = "/connexion",
  requiredRole,
  checkRole = false,
}: UseProtectedRouteOptions = {}) {
  const { user, isLoading } = useAuth();
  const [roleChecked, setRoleChecked] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Rediriger si l'utilisateur n'est pas connecté
        router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      } else if (!checkRole || !requiredRole) {
        // S'il n'y a pas de vérification de rôle, l'utilisateur est autorisé
        setIsAuthorized(true);
        setIsCheckingAuth(false);
      } else {
        // Si une vérification de rôle est nécessaire, continuer à attendre
        setIsCheckingAuth(true);
      }
    }
  }, [user, isLoading, router, redirectTo, checkRole, requiredRole]);

  // Vérifier le rôle de l'utilisateur si nécessaire
  useEffect(() => {
    async function checkUserRole() {
      if (user && checkRole && requiredRole && !roleChecked) {
        try {
          const permitted = await hasRole(user.uid, requiredRole);
          setHasRequiredRole(permitted);
          setIsAuthorized(permitted);
          
          if (!permitted) {
            // Rediriger si l'utilisateur n'a pas le rôle requis
            router.push("/acces-refuse");
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du rôle:", error);
          setHasRequiredRole(false);
          setIsAuthorized(false);
          router.push("/acces-refuse");
        } finally {
          setRoleChecked(true);
          setIsCheckingAuth(false);
        }
      }
    }

    checkUserRole();
  }, [user, checkRole, requiredRole, roleChecked, router]);

  return {
    user,
    isLoading: isLoading || isCheckingAuth,
    isAuthorized,
    hasRequiredRole,
  };
} 