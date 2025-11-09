import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Schéma de validation du formulaire
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: "L'objet doit comporter au moins 2 caractères" }),
  message: z.string().min(10, { message: "Le message doit comporter au moins 10 caractères" }),
});

// Type du formulaire basé sur le schéma zod
type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
  });

  // Fonction pour gérer l'envoi du formulaire
  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Ici, vous pouvez implémenter l'envoi du formulaire par email
      // par exemple avec un Server Action Next.js qui pourrait utiliser nodemailer
      console.log("Données du formulaire:", data);
      
      // Simuler un délai d'envoi pour démonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire après succès
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSubmitSuccessful && (
        <div className="p-4 mb-4 text-sm rounded-lg bg-green-50 text-green-800">
          Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom complet <span className="text-red-500">*</span></Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone (optionnel)</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Objet <span className="text-red-500">*</span></Label>
        <Input id="subject" {...register("subject")} />
        {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
        <textarea
          id="message"
          {...register("message")}
          rows={5}
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
} 