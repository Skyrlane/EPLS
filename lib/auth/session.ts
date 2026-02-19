"use server"

import { cookies } from "next/headers"

/**
 * Définit le cookie httpOnly auth-token après connexion Firebase.
 * Appelé depuis les Client Components (login-form, auth-provider) après
 * que Firebase ait authentifié l'utilisateur côté client.
 */
export async function setAuthCookie(idToken: string): Promise<void> {
  cookies().set({
    name: "auth-token",
    value: idToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 heure — Firebase renouvelle les tokens toutes les heures
  })
}

/**
 * Supprime le cookie auth-token lors de la déconnexion.
 */
export async function clearAuthCookie(): Promise<void> {
  cookies().delete("auth-token")
}
