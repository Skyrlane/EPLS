"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  onAuthStateChanged,
  onIdTokenChanged,
  User,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  Auth
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth/session";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { MockAuthInterface } from "@/lib/firebase";

export type AuthUser = User;

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
};

const initialState: AuthContextType = {
  user: null,
  isLoading: true,
  isConfigured: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  updateDisplayName: async () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Vérifier si Firebase est correctement configuré
  useEffect(() => {
    // Vérification plus stricte pour déterminer si Firebase est correctement configuré
    const configuredProperly = 
      !!auth && 
      !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    setIsConfigured(configuredProperly);
    
    // Si Firebase n'est pas configuré, ne pas rester en état de chargement
    if (!configuredProperly) {
      setIsLoading(false);
    }
  }, []);

  // Écouter les changements d'état d'authentification et les renouvellements de token
  useEffect(() => {
    if (!isConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    try {
      const unsubscribe = onIdTokenChanged(auth as Auth, async (firebaseUser: User | null) => {
        setUser(firebaseUser);
        setIsLoading(false);

        if (firebaseUser) {
          // Rafraîchir le cookie à chaque changement de token (connexion + renouvellement horaire)
          const idToken = await firebaseUser.getIdToken();
          await setAuthCookie(idToken);
        } else {
          // Utilisateur déconnecté — supprimer le cookie
          await clearAuthCookie();
        }
      });

      // Timeout de sécurité pour éviter un état de chargement infini
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'authentification:", error);
      setIsLoading(false);
    }
  }, [isConfigured]);

  // Fonctions d'authentification
  const login = async (email: string, password: string): Promise<void> => {
    if (!isConfigured || !auth) {
      throw new Error("Le système d'authentification n'est pas configuré");
    }
    
    try {
      // Utiliser l'instance comme any pour éviter les erreurs de typage
      const authInstance = auth as any;
      
      if (typeof authInstance.signInWithEmailAndPassword !== 'function') {
        throw new Error("L'API d'authentification n'est pas disponible");
      }
      
      await authInstance.signInWithEmailAndPassword(email, password);
      toast({
        title: "Connexion réussie",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      const errorMessage = 
        error.code === "auth/invalid-credential" 
          ? "Identifiants incorrects" 
          : error.code === "auth/too-many-requests"
          ? "Trop de tentatives échouées, veuillez réessayer plus tard"
          : "Erreur lors de la connexion";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    if (!isConfigured || !auth) return;
    
    try {
      // Utiliser l'instance comme any pour éviter les erreurs de typage
      const authInstance = auth as any;
      
      if (typeof authInstance.signOut !== 'function') {
        throw new Error("L'API d'authentification n'est pas disponible");
      }
      
      await authInstance.signOut();
      toast({
        title: "Déconnexion réussie",
        variant: "default",
      });
      router.push("/");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName?: string): Promise<void> => {
    if (!isConfigured) {
      throw new Error("Le système d'authentification n'est pas configuré");
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      toast({
        title: "Compte créé avec succès",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      const errorMessage = 
        error.code === "auth/email-already-in-use" 
          ? "Cette adresse email est déjà utilisée" 
          : error.code === "auth/weak-password"
          ? "Le mot de passe est trop faible"
          : "Erreur lors de la création du compte";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!isConfigured) {
      throw new Error("Le système d'authentification n'est pas configuré");
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Instructions de réinitialisation envoyées par email",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erreur de réinitialisation:", error);
      const errorMessage = 
        error.code === "auth/user-not-found" 
          ? "Aucun compte associé à cette adresse email" 
          : "Erreur lors de l'envoi des instructions";
          
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDisplayName = async (displayName: string): Promise<void> => {
    if (!user || !isConfigured) {
      throw new Error("Utilisateur non connecté ou système non configuré");
    }
    
    try {
      await updateProfile(user, { displayName });
      toast({
        title: "Nom d'affichage mis à jour",
        variant: "default",
      });
      // Force refresh the user object
      setUser({ ...user, displayName });
    } catch (error) {
      console.error("Erreur de mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mémoriser la valeur du contexte pour éviter les re-rendus inutiles
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isConfigured,
      login,
      logout,
      register,
      resetPassword,
      updateDisplayName,
    }),
    [user, isLoading, isConfigured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext); 