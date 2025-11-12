"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useAuth } from "@/hooks/use-auth";
import { setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Schéma de validation Zod pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  rememberMe: z.boolean().optional(),
});

// Type inféré à partir du schéma Zod
type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin?: (values: LoginFormValues) => Promise<void>;
  callbackUrl?: string;
}

export function LoginForm({ onLogin, callbackUrl = "/membres" }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { validate, getFieldError, clearErrors } = useFormValidation(loginSchema);

  // Initialisation du formulaire avec React Hook Form et Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: LoginFormValues) => {
    console.log('🔵 LoginForm.handleSubmit appelé avec:', { email: values.email });
    console.log('🔵 Firebase auth:', typeof auth, 'app' in auth ? 'Auth réel' : 'Mock Auth');
    console.log('🔵 Env vars:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'PRÉSENT' : 'MANQUANT',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'PRÉSENT' : 'MANQUANT',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'PRÉSENT' : 'MANQUANT'
    });
    clearErrors();
    setErrorMessage(null);
    console.log('🔵 Validation et nettoyage des erreurs effectués');
    setIsLoading(true);

    try {
      // Configurer la persistance selon l'option "Se souvenir de moi"
      if (values.rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }

      if (onLogin) {
        console.log('🔵 Utilisation de la fonction onLogin personnalisée');
        await onLogin(values);
      } else {
        // Connexion Firebase directe
        console.log('🔵 Appel de signInWithEmailAndPassword...');
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log('🔵 signInWithEmailAndPassword réussi');
        const user = userCredential.user;
        
        console.log('✅ Connexion réussie:', user.uid);

        // Attendre que onAuthStateChanged confirme l'utilisateur
        console.log('🔵 Attente confirmation onAuthStateChanged...');
        await new Promise<void>((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              console.log('✅ onAuthStateChanged confirmé:', authUser.uid);
              unsubscribe();
              resolve();
            }
          });
          
          // Timeout de sécurité : si pas de confirmation après 5s, on redirige quand même
          setTimeout(() => {
            console.warn('⏱️ Timeout onAuthStateChanged, redirection forcée');
            unsubscribe();
            resolve();
          }, 5000);
        });

        // Redirection avec router (pas de rechargement complet)
        console.log('🚀 Redirection vers:', callbackUrl);
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      // Messages d'erreur améliorés et plus spécifiques
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrorMessage("Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Trop de tentatives de connexion. Votre compte a été temporairement bloqué. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Format d'email invalide.");
      } else if (error.code === "auth/user-disabled") {
        setErrorMessage("Ce compte a été désactivé. Veuillez contacter un administrateur.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Problème de connexion réseau. Veuillez vérifier votre connexion internet.");
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la connexion. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion à votre compte</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre espace membre.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" aria-label="Formulaire de connexion">
            {errorMessage && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Adresse email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      disabled={isLoading}
                      aria-describedby="email-error"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        disabled={isLoading}
                        aria-describedby="password-error"
                        autoComplete="current-password"
                        {...field}
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
                  </FormControl>
                  <FormMessage id="password-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="rememberMe">
                      Se souvenir de moi
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-live="polite"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </Form>
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