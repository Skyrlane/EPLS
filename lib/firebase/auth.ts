import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from './config';

/**
 * Connecte un utilisateur avec son email et mot de passe
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise avec les informations utilisateur
 */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    return await firebaseSignIn(auth, email, password);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
}

/**
 * Crée un nouvel utilisateur avec email et mot de passe
 * @param email - Email du nouvel utilisateur
 * @param password - Mot de passe du nouvel utilisateur
 * @param displayName - Nom d'affichage du nouvel utilisateur
 * @returns Promise avec l'utilisateur créé
 */
export async function signUp(email: string, password: string, displayName: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Mettre à jour le profil avec le nom d'affichage
    await updateProfile(user, { displayName });
    
    return user;
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    throw error;
  }
}

// Connexion avec Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

/**
 * Déconnecte l'utilisateur actuel
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw error;
  }
}

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param email - Email de l'utilisateur
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Erreur d\'envoi d\'email de réinitialisation:', error);
    throw error;
  }
}

// Mise à jour du profil utilisateur
export const updateUserProfile = async (user: User, data: { displayName?: string; photoURL?: string }): Promise<void> => {
  return updateProfile(user, data);
};

// Observer l'état d'authentification
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Obtenir l'utilisateur courant
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 