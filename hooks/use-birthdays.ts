import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Birthday } from '@/types';

interface UseBirthdaysOptions {
  month?: number;           // Filtrer par mois (1-12)
  activeOnly?: boolean;     // Seulement les anniversaires actifs
  autoLoad?: boolean;       // Charger automatiquement au mount
}

interface UseBirthdaysReturn {
  birthdays: Birthday[];
  loading: boolean;
  error: string | null;
  getAllBirthdays: () => Promise<void>;
  getBirthdaysByMonth: (month: number) => Promise<Birthday[]>;
  createBirthday: (data: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBirthday: (id: string, data: Partial<Birthday>) => Promise<void>;
  deleteBirthday: (id: string) => Promise<void>;
  toggleActive: (id: string, currentStatus: boolean) => Promise<void>;
}

/**
 * Hook personnalisé pour gérer les anniversaires
 * 
 * @example
 * // Récupérer tous les anniversaires
 * const { birthdays, loading, createBirthday } = useBirthdays();
 * 
 * @example
 * // Filtrer par mois et seulement les actifs
 * const { birthdays, loading } = useBirthdays({ month: 1, activeOnly: true });
 */
export function useBirthdays(options: UseBirthdaysOptions = {}): UseBirthdaysReturn {
  const { month, activeOnly = false, autoLoad = true } = options;
  
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère tous les anniversaires depuis Firestore
   */
  const getAllBirthdays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construction de la query
      let q = query(
        collection(firestore, 'birthdays'),
        orderBy('month', 'asc'),
        orderBy('day', 'asc')
      );

      // Filtre par statut si demandé
      if (activeOnly) {
        q = query(
          collection(firestore, 'birthdays'),
          where('isActive', '==', true),
          orderBy('month', 'asc'),
          orderBy('day', 'asc')
        );
      }

      // Filtre par mois si spécifié
      if (month !== undefined) {
        if (activeOnly) {
          q = query(
            collection(firestore, 'birthdays'),
            where('isActive', '==', true),
            where('month', '==', month),
            orderBy('day', 'asc')
          );
        } else {
          q = query(
            collection(firestore, 'birthdays'),
            where('month', '==', month),
            orderBy('day', 'asc')
          );
        }
      }

      const snapshot = await getDocs(q);
      const data: Birthday[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Birthday));

      setBirthdays(data);
    } catch (err) {
      console.error('Erreur lors du chargement des anniversaires:', err);
      setError('Erreur lors du chargement des anniversaires');
    } finally {
      setLoading(false);
    }
  }, [month, activeOnly]);

  /**
   * Récupère les anniversaires d'un mois spécifique
   */
  const getBirthdaysByMonth = useCallback(async (targetMonth: number): Promise<Birthday[]> => {
    try {
      let q = query(
        collection(firestore, 'birthdays'),
        where('month', '==', targetMonth),
        orderBy('day', 'asc')
      );

      if (activeOnly) {
        q = query(
          collection(firestore, 'birthdays'),
          where('isActive', '==', true),
          where('month', '==', targetMonth),
          orderBy('day', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Birthday));
    } catch (err) {
      console.error('Erreur lors du chargement des anniversaires du mois:', err);
      throw err;
    }
  }, [activeOnly]);

  /**
   * Crée un nouvel anniversaire
   */
  const createBirthday = useCallback(async (
    data: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setLoading(true);
      setError(null);

      await addDoc(collection(firestore, 'birthdays'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await getAllBirthdays();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur lors de la création de l\'anniversaire');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllBirthdays]);

  /**
   * Met à jour un anniversaire
   */
  const updateBirthday = useCallback(async (
    id: string,
    data: Partial<Birthday>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(firestore, 'birthdays', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      await getAllBirthdays();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour de l\'anniversaire');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllBirthdays]);

  /**
   * Supprime un anniversaire
   */
  const deleteBirthday = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(firestore, 'birthdays', id));
      await getAllBirthdays();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'anniversaire');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllBirthdays]);

  /**
   * Bascule le statut actif/inactif
   */
  const toggleActive = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await updateBirthday(id, { isActive: !currentStatus });
    } catch (err) {
      console.error('Erreur lors du toggle:', err);
      throw err;
    }
  }, [updateBirthday]);

  // Chargement automatique au montage si demandé
  useEffect(() => {
    if (autoLoad) {
      console.log('🔄 useBirthdays: Loading birthdays', { month, activeOnly });
      getAllBirthdays();
    }
  }, [autoLoad, month, activeOnly, getAllBirthdays]); // ← Ajout de month et activeOnly

  return {
    birthdays,
    loading,
    error,
    getAllBirthdays,
    getBirthdaysByMonth,
    createBirthday,
    updateBirthday,
    deleteBirthday,
    toggleActive,
  };
}
