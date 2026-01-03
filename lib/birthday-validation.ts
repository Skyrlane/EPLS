import { z } from 'zod';

/**
 * Schéma de validation Zod pour les anniversaires
 */
export const birthdaySchema = z.object({
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom est trop long"),
    
  lastName: z.string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom est trop long"),
    
  day: z.number()
    .int()
    .min(1, "Le jour doit être entre 1 et 31")
    .max(31, "Le jour doit être entre 1 et 31"),
    
  month: z.number()
    .int()
    .min(1, "Le mois doit être entre 1 et 12")
    .max(12, "Le mois doit être entre 1 et 12"),
    
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    // Validation jour/mois (ex: pas 31 février)
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return data.day <= daysInMonth[data.month - 1];
  },
  {
    message: "Jour invalide pour ce mois",
    path: ["day"],
  }
);

/**
 * Type TypeScript inféré depuis le schéma Zod
 */
export type BirthdayFormData = z.infer<typeof birthdaySchema>;
