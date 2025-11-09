"use server"

import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import { 
  signIn, 
  signUp, 
  resetPassword, 
  signOut, 
  signInWithGoogle 
} from "@/lib/firebase/auth"
import { cookies } from "next/headers"

// Création du client d'action sécurisée
const action = createSafeActionClient({
  // Middleware qui s'exécute avant chaque action
  middleware: async () => {
    // Vous pouvez ajouter des vérifications ici
    return { user: null } // Contexte accessible dans les actions
  },
})

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  rememberMe: z.boolean().optional(),
})

/**
 * Action sécurisée pour la connexion d'utilisateur
 */
export const loginAction = action(
  // Validateur zod
  loginSchema,
  // Fonction d'action sécurisée
  async ({ email, password }, { user }) => {
    try {
      const userCredential = await signIn(email, password)
      
      // Récupération du token pour le stocker dans un cookie sécurisé
      const token = await userCredential.user.getIdToken()
      
      // Définition d'un cookie pour la session
      cookies().set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // Durée plus longue si "Se souvenir de moi" est activé
        maxAge: 60 * 60 * 24 * (30), // 30 jours
      })
      
      return { 
        success: true, 
        data: { 
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
        } 
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error)
      
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      }
    }
  }
)

/**
 * Action sécurisée pour la déconnexion
 */
export const logoutAction = action(
  // Pas de validation nécessaire pour la déconnexion
  z.object({}),
  // Fonction d'action sécurisée
  async (_, { user }) => {
    try {
      await signOut()
      
      // Suppression du cookie d'authentification
      cookies().delete("auth-token")
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: "Erreur lors de la déconnexion" 
      }
    }
  }
)

// Schéma de validation pour la réinitialisation du mot de passe
const resetPasswordSchema = z.object({
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
})

/**
 * Action sécurisée pour la réinitialisation du mot de passe
 */
export const resetPasswordAction = action(
  // Validateur zod
  resetPasswordSchema,
  // Fonction d'action sécurisée
  async ({ email }, { user }) => {
    try {
      await resetPassword(email)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      }
    }
  }
)

/**
 * Fonction pour traduire les codes d'erreur Firebase en messages utilisateur
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.";
    case "auth/too-many-requests":
      return "Trop de tentatives de connexion. Votre compte a été temporairement bloqué. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.";
    case "auth/invalid-email":
      return "Format d'email invalide.";
    case "auth/user-disabled":
      return "Ce compte a été désactivé. Veuillez contacter un administrateur.";
    case "auth/network-request-failed":
      return "Problème de connexion réseau. Veuillez vérifier votre connexion internet.";
    case "auth/email-already-in-use":
      return "Cette adresse email est déjà utilisée par un autre compte.";
    case "auth/weak-password":
      return "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
    default:
      return "Une erreur est survenue. Veuillez réessayer plus tard.";
  }
} 