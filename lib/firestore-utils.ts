/**
 * Utilitaires pour Firestore
 */

/**
 * Nettoie un objet en supprimant tous les champs undefined
 * Firestore n'accepte pas les valeurs undefined
 * 
 * @param obj - Objet à nettoyer
 * @returns Nouvel objet sans les champs undefined
 * 
 * @example
 * const data = { name: 'John', age: undefined, city: 'Paris' };
 * const cleaned = cleanFirestoreData(data);
 * // { name: 'John', city: 'Paris' }
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      // Ne pas inclure les valeurs undefined
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned as Partial<T>;
}
