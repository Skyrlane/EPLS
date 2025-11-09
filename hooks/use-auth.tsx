import {
  useCallback,
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
  UserCredential
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Types pour l'authentification
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setError: (error: Error | null) => void;
}

// Contexte par défaut
const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  error: null,
  signUp: async () => {
    throw new Error("AuthContext not initialized");
  },
  signIn: async () => {
    throw new Error("AuthContext not initialized");
  },
  signOut: async () => {
    throw new Error("AuthContext not initialized");
  },
  updateUserProfile: async () => {
    throw new Error("AuthContext not initialized");
  },
  resetPassword: async () => {
    throw new Error("AuthContext not initialized");
  },
  setError: () => {},
});

/**
 * Convertit un utilisateur Firebase en notre modèle d'utilisateur simplifié
 */
function formatUser(user: User | null): AuthUser | null {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Fournisseur du contexte d'authentification
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Observer le changement d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(formatUser(user));
        setLoading(false);
      },
      (error) => {
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Inscription avec email et mot de passe
   */
  const signUp = useCallback(
    async (email: string, password: string): Promise<UserCredential> => {
      setLoading(true);
      setError(null);
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Connexion avec email et mot de passe
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<UserCredential> => {
      setLoading(true);
      setError(null);
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
      } catch (error) {
        setError(error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Déconnexion
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, []);

  /**
   * Mise à jour du profil utilisateur
   */
  const updateUserProfile = useCallback(
    async (displayName?: string, photoURL?: string): Promise<void> => {
      if (!auth.currentUser) {
        throw new Error("No user is signed in");
      }

      try {
        const updateData: {
          displayName?: string;
          photoURL?: string;
        } = {};

        if (displayName !== undefined) updateData.displayName = displayName;
        if (photoURL !== undefined) updateData.photoURL = photoURL;

        await updateProfile(auth.currentUser, updateData);
        
        // Mettre à jour l'utilisateur local
        setUser(formatUser(auth.currentUser));
      } catch (error) {
        setError(error as Error);
        throw error;
      }
    },
    []
  );

  /**
   * Réinitialisation du mot de passe
   */
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        updateUserProfile,
        resetPassword,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser l'authentification
 */
export function useAuth() {
  return useContext(AuthContext);
} 