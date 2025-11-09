"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  UserCredential,
  AuthError
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

interface UseFirebaseAuthOptions {
  onAuthStateChange?: (user: User | null) => void;
  onError?: (error: AuthError) => void;
}

export function useFirebaseAuth(options: UseFirebaseAuthOptions = {}) {
  const { onAuthStateChange, onError } = options;
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // S'abonner aux changements d'état d'authentification
  useEffect(() => {
    setStatus("loading");
    setIsLoading(true);
    
    const unsubscribe = onAuthStateChanged(
      auth as Auth,
      (user) => {
        setUser(user);
        setStatus(user ? "authenticated" : "unauthenticated");
        setIsLoading(false);
        
        if (onAuthStateChange) {
          onAuthStateChange(user);
        }
      },
      (err) => {
        const authError = err as AuthError;
        setError(authError);
        setStatus("error");
        setIsLoading(false);
        
        if (onError) {
          onError(authError);
        }
      }
    );
    
    // Nettoyer l'abonnement lors du démontage
    return () => unsubscribe();
  }, [onAuthStateChange, onError]);

  // Création d'un nouvel utilisateur
  const register = useCallback(async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential | null> => {
    setStatus("loading");
    setError(null);
    setIsLoading(true);
    
    try {
      const authInstance = auth as Auth;
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      
      // Mettre à jour le profil avec le nom d'affichage si fourni
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      setStatus("error");
      
      if (onError) {
        onError(authError);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Connexion d'un utilisateur
  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<UserCredential | null> => {
    setStatus("loading");
    setError(null);
    setIsLoading(true);
    
    try {
      const authInstance = auth as Auth;
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      
      return userCredential;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      setStatus("error");
      
      if (onError) {
        onError(authError);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Déconnexion d'un utilisateur
  const logout = useCallback(async (): Promise<boolean> => {
    setStatus("loading");
    setError(null);
    setIsLoading(true);
    
    try {
      const authInstance = auth as Auth;
      await signOut(authInstance);
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      setStatus("error");
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Réinitialisation du mot de passe
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setError(null);
    
    try {
      const authInstance = auth as Auth;
      await sendPasswordResetEmail(authInstance, email);
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    }
  }, [onError]);

  // Mise à jour du profil utilisateur
  const updateUserProfile = useCallback(async (
    profile: { displayName?: string | null; photoURL?: string | null }
  ): Promise<boolean> => {
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }
    
    setError(null);
    
    try {
      await updateProfile(user, profile);
      
      // Forcer le rafraîchissement des états locaux
      setUser({ ...user });
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    }
  }, [user, onError]);

  // Mise à jour de l'email de l'utilisateur
  const updateUserEmail = useCallback(async (newEmail: string): Promise<boolean> => {
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }
    
    setError(null);
    
    try {
      await updateEmail(user, newEmail);
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    }
  }, [user, onError]);

  // Mise à jour du mot de passe de l'utilisateur
  const updateUserPassword = useCallback(async (newPassword: string): Promise<boolean> => {
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }
    
    setError(null);
    
    try {
      await updatePassword(user, newPassword);
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    }
  }, [user, onError]);

  // Suppression du compte utilisateur
  const deleteUserAccount = useCallback(async (): Promise<boolean> => {
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }
    
    setError(null);
    
    try {
      await deleteUser(user);
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    }
  }, [user, onError]);

  // Envoyer un email de vérification
  const sendVerificationEmail = useCallback(async (): Promise<boolean> => {
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }
    
    setError(null);
    
    try {
      await sendEmailVerification(user);
      
      return true;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      
      if (onError) {
        onError(authError);
      }
      
      return false;
    }
  }, [user, onError]);

  // Formater le message d'erreur pour l'affichage
  const getErrorMessage = useCallback((code?: string): string => {
    if (!code) return "Une erreur inconnue s'est produite";
    
    const errorMessages: Record<string, string> = {
      "auth/user-not-found": "Aucun utilisateur trouvé avec cet email",
      "auth/wrong-password": "Mot de passe incorrect",
      "auth/email-already-in-use": "Cette adresse email est déjà utilisée",
      "auth/weak-password": "Le mot de passe est trop faible",
      "auth/invalid-email": "L'adresse email est invalide",
      "auth/user-disabled": "Ce compte a été désactivé",
      "auth/requires-recent-login": "Veuillez vous reconnecter pour effectuer cette action",
      "auth/popup-closed-by-user": "La fenêtre de connexion a été fermée",
      "auth/operation-not-allowed": "Cette opération n'est pas autorisée",
      "auth/network-request-failed": "Problème de connexion réseau",
      "auth/too-many-requests": "Trop de tentatives échouées, veuillez réessayer plus tard",
    };
    
    return errorMessages[code] || `Erreur: ${code}`;
  }, []);

  return {
    // États
    user,
    status,
    error,
    isLoading,
    isAuthenticated: !!user,
    
    // Actions principales
    register,
    login,
    logout,
    resetPassword,
    
    // Actions sur le profil
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
    sendVerificationEmail,
    
    // Helpers
    getErrorMessage,
  };
} 