import { z } from 'zod';

/**
 * Schéma de validation Zod pour les contacts du carnet d'adresses
 */
export const contactSchema = z.object({
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom est trop long"),

  lastName: z.string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom est trop long"),

  phoneFixed: z.string()
    .optional()
    .or(z.literal('')),

  phoneMobile: z.string()
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),

  address: z.string()
    .optional()
    .or(z.literal('')),

  postalCode: z.string()
    .regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)')
    .optional()
    .or(z.literal('')),

  city: z.string()
    .optional()
    .or(z.literal('')),

  birthDate: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Format: JJ/MM/AAAA')
    .optional()
    .or(z.literal('')),

  isMember: z.boolean().default(false),

  isActive: z.boolean().default(true),

  notes: z.string()
    .optional()
    .or(z.literal('')),
});

/**
 * Type TypeScript inféré depuis le schéma Zod
 */
export type ContactFormData = z.infer<typeof contactSchema>;
