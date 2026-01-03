"use client";

import { useEffect, useState, useMemo } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

/**
 * Interface pour les données utilisateur stockées dans Firestore
 */
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}

/**
 * Hook pour récupérer les données utilisateur depuis Firestore
 * Inclut le champ isAdmin pour différencier admins et membres
 */
export function useUserData() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si l'auth est en chargement, on attend
    if (authLoading) {
      return;
    }

    // Si pas d'utilisateur connecté, on reset
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    // Écouter les changements du document utilisateur en temps réel
    const userDocRef = doc(firestore, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData({
            uid: user.uid,
            email: user.email || data.email || "",
            displayName: data.displayName || user.displayName || user.email?.split("@")[0] || "Utilisateur",
            photoURL: data.photoURL || user.photoURL,
            isAdmin: data.isAdmin === true,
            createdAt: data.createdAt?.toDate?.() || undefined,
            lastLogin: data.lastLogin?.toDate?.() || undefined,
          });
        } else {
          // Document n'existe pas dans Firestore, créer les données de base
          setUserData({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || user.email?.split("@")[0] || "Utilisateur",
            photoURL: user.photoURL || undefined,
            isAdmin: false, // Par défaut, pas admin
          });
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Erreur lors de la récupération des données utilisateur:", err);
        setError(err as Error);
        setLoading(false);
        // En cas d'erreur, utiliser les données de Firebase Auth
        setUserData({
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || user.email?.split("@")[0] || "Utilisateur",
          photoURL: user.photoURL || undefined,
          isAdmin: false,
        });
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // Valeurs calculées
  const isAdmin = useMemo(() => userData?.isAdmin === true, [userData]);
  const isMember = useMemo(() => !!user, [user]);
  const isAuthenticated = useMemo(() => !!user && !authLoading, [user, authLoading]);

  return {
    user,
    userData,
    loading: authLoading || loading,
    error,
    isAdmin,
    isMember,
    isAuthenticated,
  };
}

/**
 * Hook simplifié pour vérifier si l'utilisateur est membre (connecté)
 */
export function useIsMember(): boolean {
  const { isMember, loading } = useUserData();
  return !loading && isMember;
}

/**
 * Hook simplifié pour vérifier si l'utilisateur est administrateur
 */
export function useIsAdmin(): boolean {
  const { isAdmin, loading } = useUserData();
  return !loading && isAdmin;
}
