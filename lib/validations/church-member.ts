import { z } from 'zod';
import { CHURCH_MEMBER_STATUSES, CONSEIL_FUNCTIONS } from '@/types';

/**
 * Schéma de validation Zod pour les membres de l'église
 */
export const churchMemberSchema = z.object({
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom est trop long"),

  lastName: z.string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom est trop long"),

  status: z.enum(CHURCH_MEMBER_STATUSES, {
    errorMap: () => ({ message: "Statut invalide" })
  }),

  conseilFunction: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val as typeof CONSEIL_FUNCTIONS[number];
    }),

  observations: z.string()
    .optional()
    .transform((val) => val === '' ? undefined : val),

  dateRadiation: z.string()
    .optional()
    .transform((val) => val === '' ? undefined : val),

  ordre: z.coerce.number()
    .int("L'ordre doit être un entier")
    .min(0, "L'ordre doit être positif")
    .default(0),

  isActive: z.boolean().default(true),
});

/**
 * Type TypeScript inféré depuis le schéma Zod
 */
export type ChurchMemberFormData = z.infer<typeof churchMemberSchema>;
