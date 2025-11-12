"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useMemo, useSyncExternalStore } from "react";
import { 
  User, 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  Unsubscribe,
  UserCredential
} from "firebase/auth";
import { auth, MockAuthInterface } from "../firebase";
import { useToast } from "@/hooks/use-toast";
import { authState } from "../auth-state";

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (newDisplayName: string) => Promise<void>;
}

// Valeur par défaut du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur de contexte d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, forceUpdate] = useState(0);
  const { toast } = useToast();
  
  // Déterminer si l'instance auth est Auth ou MockAuthInterface
  const authInstance = auth as Auth | MockAuthInterface;
  
  useEffect(() => {

    // Timeout de sécurité : si Firebase ne répond pas après 3 secondes, on arrête le loading
    const timeoutId = setTimeout(() => {
      authState.setLoading(false);
      setLoading(false);
    }, 3000);

    // Écouter les changements d'état de l'authentification
    let unsubscribe: Unsubscribe;

    try {
      // Vérifier si c'est le mock (pas de propriété 'app') ou la vraie instance Firebase (a 'app')
      const isMock = !('app' in authInstance);

      if (isMock) {
        // Pour le mock
        unsubscribe = (authInstance as MockAuthInterface).onAuthStateChanged((user) => {
          clearTimeout(timeoutId);
          authState.setUser(user);
          authState.setLoading(false);
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        // Pour l'authentification Firebase réelle
        unsubscribe = onAuthStateChanged(authInstance as Auth, (user) => {
          clearTimeout(timeoutId);
          authState.setUser(user);
          authState.setLoading(false);
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      setLoading(false);
    }

    // Nettoyer l'écouteur au démontage
    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Connexion utilisateur
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   */
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        authInstance as Auth,
        email,
        password
      );
      setUser(userCredential.user);
      toast({
        title: "Connexion réussie",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la connexion";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion utilisateur
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(authInstance as Auth);
      setUser(null);
      toast({
        title: "Déconnexion réussie",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la déconnexion";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription utilisateur
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   */
  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        authInstance as Auth,
        email,
        password
      );
      setUser(userCredential.user);
      toast({
        title: "Compte créé avec succès",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'inscription";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Réinitialisation du mot de passe
   * @param email - Email de l'utilisateur
   */
  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(authInstance as Auth, email);
      toast({
        title: "Instructions envoyées",
        description: "Un email de réinitialisation de mot de passe a été envoyé",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la réinitialisation du mot de passe";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mise à jour du nom d'affichage
   * @param newDisplayName - Nouveau nom d'affichage
   */
  const updateDisplayName = async (newDisplayName: string): Promise<void> => {
    setLoading(true);
    if (!user) {
      toast({
        title: "Erreur",
        description: "Aucun utilisateur connecté",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await updateProfile(user, {
        displayName: newDisplayName,
      });
      // Mettre à jour l'état local
      setUser({ ...user });
      toast({
        title: "Profil mis à jour",
        description: "Nom d'affichage modifié avec succès",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la mise à jour du nom d'affichage";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = useMemo(() => {
    return {
      user,
      loading,
      login,
      logout,
      register,
      resetPassword,
      updateDisplayName,
    };
  }, [user, loading]); // IMPORTANT : Dépendances explicites pour forcer le re-render

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns Le contexte d'authentification
 */
export function useAuth(): AuthContextType {
  // Utiliser useSyncExternalStore pour se synchroniser avec le store global
  const globalUser = useSyncExternalStore(
    (callback) => {
      return authState.subscribe((user, loading) => {
        callback();
      });
    },
    () => {
      return authState.getUser();
    },
    () => {
      // getServerSnapshot pour SSR : retourne null côté serveur
      return null;
    }
  );
  const globalLoading = useSyncExternalStore(
    (callback) => {
      return authState.subscribe(() => callback());
    },
    () => {
      return authState.isLoading();
    },
    () => {
      // getServerSnapshot pour SSR : retourne true côté serveur (en chargement)
      return true;
    }
  );
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }

  // Retourner le state global au lieu du Context (évite les problèmes de synchronisation)
  return {
    ...context,
    user: globalUser,
    loading: globalLoading,
  };
} 