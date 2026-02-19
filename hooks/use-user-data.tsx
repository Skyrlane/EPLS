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
  role: 'admin' | 'member' | 'visitor';
  createdAt?: Date;
  lastLogin?: Date;
}

/**
 * Normalise les valeurs de role depuis Firestore.
 * Les documents existants peuvent avoir 'Membre', 'Admin', 'Visiteur' (casse française).
 * Cette fonction convertit vers les valeurs canoniques attendues par le code applicatif.
 */
function normalizeRole(raw: unknown): 'admin' | 'member' | 'visitor' {
  if (typeof raw !== 'string') return 'member'
  switch (raw.toLowerCase()) {
    case 'admin':
    case 'administrateur':
      return 'admin'
    case 'member':
    case 'membre':
      return 'member'
    case 'visitor':
    case 'visiteur':
      return 'visitor'
    default:
      return 'member'
  }
}

/**
 * Hook pour récupérer les données utilisateur depuis Firestore
 * isAdmin est dérivé du champ `role` (role === 'admin'), jamais lu directement depuis Firestore
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
            role: normalizeRole(data.role),
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
            role: 'member', // Par défaut, membre
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
          role: 'member',
        });
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // Valeurs calculées — isAdmin est dérivé du champ role, jamais lu directement depuis Firestore
  const isAdmin = useMemo(() => userData?.role === 'admin', [userData]);
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
