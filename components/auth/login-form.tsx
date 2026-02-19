"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { auth, firestore } from "@/lib/firebase";
import { setAuthCookie } from "@/lib/auth/session";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Auth } from "firebase/auth";

export function LoginForm() {
  const [identifier, setIdentifier] = useState(""); // "identifier" au lieu de "email"
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Logique hybride : détection automatique email vs identifiant
      const email = identifier.includes("@")
        ? identifier // C'est déjà un email
        : `${identifier}@epls.local`; // C'est un identifiant → ajoute le domaine

      // Connexion Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth as Auth,
        email,
        password
      );

      // Définir le cookie auth-token pour les Server Actions
      const idToken = await userCredential.user.getIdToken()
      await setAuthCookie(idToken)

      // Récupérer les infos utilisateur depuis Firestore
      const userDoc = await getDoc(doc(firestore, "users", userCredential.user.uid));
      const userData = userDoc.data();

      // Redirection intelligente selon le rôle
      if (userData?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);

      // Messages d'erreur en français
      if (err.code === "auth/user-not-found") {
        setError("Identifiant ou email inconnu.");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format d'identifiant invalide.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Identifiants incorrects. Vérifiez votre identifiant et mot de passe.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Compte temporairement bloqué.");
      } else if (err.code === "auth/user-disabled") {
        setError("Ce compte a été désactivé.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Problème de connexion réseau.");
      } else {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion à votre compte</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre espace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="identifier">Identifiant ou Email</Label>
            <Input
              id="identifier"
              type="text" // "text" au lieu de "email" pour accepter les identifiants
              placeholder="membre01 ou votre@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
            <p className="text-xs text-muted-foreground">
              Membres : tapez votre identifiant (ex: membre01)
              <br />
              Admins : tapez votre email complet
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button variant="link" asChild className="px-0">
          <Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
        </Button>
        <div className="flex justify-center text-sm mt-4">
          <p className="text-muted-foreground">
            Vous n&apos;avez pas de compte?{" "}
            <Link
              href="/inscription"
              className="underline text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
