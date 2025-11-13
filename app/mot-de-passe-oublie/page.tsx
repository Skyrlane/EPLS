"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from "@/hooks/use-auth"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFormValidation } from "@/hooks/use-form-validation"

// Schéma de validation pour le formulaire de réinitialisation
const resetPasswordSchema = z.object({
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function MotDePasseOubliePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { resetPassword, isConfigured } = useAuth()
  const { validate, clearErrors } = useFormValidation(resetPasswordSchema)
  
  // Initialisation du formulaire avec React Hook Form et Zod
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    clearErrors()
    setError("")
    setSuccess(false)
    setIsLoading(true)
    
    if (!isConfigured) {
      setError("Le système d'authentification n'est pas disponible pour le moment. Veuillez réessayer plus tard.")
      setIsLoading(false)
      return
    }

    try {
      await resetPassword(values.email)
      setSuccess(true)
      form.reset() // Réinitialiser le formulaire après succès
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error)

      if (error.code === "auth/user-not-found") {
        setError("Aucun compte n'est associé à cette adresse email.")
      } else if (error.code === "auth/invalid-email") {
        setError("Format d'email invalide.")
      } else if (error.code === "auth/network-request-failed") {
        setError("Problème de connexion réseau. Veuillez vérifier votre connexion internet.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Veuillez réessayer plus tard.")
      } else {
        setError("Une erreur est survenue. Veuillez réessayer plus tard.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Mot de passe oublié</h1>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-primary hover:text-primary/80">
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/connexion" className="text-primary hover:text-primary/80">
                    Connexion
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700">Mot de passe oublié</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Réinitialisation du mot de passe</CardTitle>
                <CardDescription>
                  Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4" role="alert">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200" role="status">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <AlertDescription>
                      Un email de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et
                      suivre les instructions.
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4" aria-label="Formulaire de réinitialisation de mot de passe">
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
                              placeholder="votre.email@exemple.com"
                              disabled={isLoading || success}
                              aria-describedby="email-error"
                              autoComplete="email"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage id="email-error" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || success || !isConfigured}
                      aria-live="polite"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        "Envoyer le lien de réinitialisation"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {success && (
                  <Button 
                    onClick={() => router.push("/connexion")} 
                    variant="outline" 
                    className="w-full"
                  >
                    Retour à la page de connexion
                  </Button>
                )}
                
                {!success && (
                  <Link href="/connexion" className="text-sm text-primary hover:underline">
                    Retour à la page de connexion
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
} 