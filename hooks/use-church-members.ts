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
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { ChurchMember, ChurchMemberStatus } from '@/types';

interface UseChurchMembersOptions {
  status?: ChurchMemberStatus;  // Filtrer par statut
  activeOnly?: boolean;         // Seulement les membres visibles
  autoLoad?: boolean;           // Charger automatiquement au mount
}

interface UseChurchMembersReturn {
  members: ChurchMember[];
  loading: boolean;
  error: string | null;
  getAllMembers: () => Promise<void>;
  getConseilMembers: () => Promise<ChurchMember[]>;
  getArchivedMembers: () => Promise<ChurchMember[]>;
  getActiveMembers: () => Promise<ChurchMember[]>;
  searchMembers: (query: string) => Promise<ChurchMember[]>;
  createMember: (data: Omit<ChurchMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateMember: (id: string, data: Partial<ChurchMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  toggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  importMembers: (members: Partial<ChurchMember>[]) => Promise<{ created: number; errors: number }>;
  getNextOrdre: (status: ChurchMemberStatus) => Promise<number>;
}

/**
 * Hook personnalisé pour gérer les membres de l'église
 * Collection Firestore: church_members
 *
 * @example
 * // Récupérer tous les membres
 * const { members, loading, createMember } = useChurchMembers();
 *
 * @example
 * // Filtrer par statut
 * const { members } = useChurchMembers({ status: 'conseil' });
 */
export function useChurchMembers(options: UseChurchMembersOptions = {}): UseChurchMembersReturn {
  const { status, activeOnly = false, autoLoad = true } = options;

  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère tous les membres depuis Firestore
   */
  const getAllMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(firestore, 'church_members'),
        orderBy('ordre', 'asc'),
        orderBy('lastName', 'asc'),
        orderBy('firstName', 'asc')
      );

      // Filtre par statut si demandé
      if (status) {
        q = query(
          collection(firestore, 'church_members'),
          where('status', '==', status),
          orderBy('ordre', 'asc'),
          orderBy('lastName', 'asc')
        );
      }

      // Filtre par visibilité si demandé
      if (activeOnly) {
        if (status) {
          q = query(
            collection(firestore, 'church_members'),
            where('status', '==', status),
            where('isActive', '==', true),
            orderBy('ordre', 'asc'),
            orderBy('lastName', 'asc')
          );
        } else {
          q = query(
            collection(firestore, 'church_members'),
            where('isActive', '==', true),
            orderBy('ordre', 'asc'),
            orderBy('lastName', 'asc')
          );
        }
      }

      const snapshot = await getDocs(q);
      const data: ChurchMember[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as ChurchMember));

      setMembers(data);
    } catch (err) {
      console.error('Erreur lors du chargement des membres:', err);
      setError('Erreur lors du chargement des membres');
    } finally {
      setLoading(false);
    }
  }, [status, activeOnly]);

  /**
   * Récupère les membres du conseil
   */
  const getConseilMembers = useCallback(async (): Promise<ChurchMember[]> => {
    try {
      const q = query(
        collection(firestore, 'church_members'),
        where('status', '==', 'conseil'),
        where('isActive', '==', true),
        orderBy('ordre', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as ChurchMember));
    } catch (err) {
      console.error('Erreur lors du chargement du conseil:', err);
      throw err;
    }
  }, []);

  /**
   * Récupère les membres archivés (pour le conseil uniquement)
   */
  const getArchivedMembers = useCallback(async (): Promise<ChurchMember[]> => {
    try {
      const q = query(
        collection(firestore, 'church_members'),
        where('status', '==', 'archive'),
        orderBy('ordre', 'asc'),
        orderBy('lastName', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as ChurchMember));
    } catch (err) {
      console.error('Erreur lors du chargement des membres archivés:', err);
      throw err;
    }
  }, []);

  /**
   * Récupère les membres actifs (tous sauf archivés)
   */
  const getActiveMembers = useCallback(async (): Promise<ChurchMember[]> => {
    try {
      const q = query(
        collection(firestore, 'church_members'),
        where('status', 'in', ['actif', 'conseil']),
        where('isActive', '==', true),
        orderBy('ordre', 'asc'),
        orderBy('lastName', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as ChurchMember));
    } catch (err) {
      console.error('Erreur lors du chargement des membres actifs:', err);
      throw err;
    }
  }, []);

  /**
   * Recherche dans les membres (nom, prénom)
   */
  const searchMembers = useCallback(async (searchQuery: string): Promise<ChurchMember[]> => {
    try {
      const q = query(
        collection(firestore, 'church_members'),
        orderBy('lastName', 'asc')
      );

      const snapshot = await getDocs(q);
      const allMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as ChurchMember));

      // Recherche côté client (insensible à la casse)
      const lowerQuery = searchQuery.toLowerCase();
      return allMembers.filter(member =>
        member.firstName.toLowerCase().includes(lowerQuery) ||
        member.lastName.toLowerCase().includes(lowerQuery)
      );
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      throw err;
    }
  }, []);

  /**
   * Calcule le prochain numéro d'ordre pour un statut donné
   */
  const getNextOrdre = useCallback(async (memberStatus: ChurchMemberStatus): Promise<number> => {
    try {
      const q = query(
        collection(firestore, 'church_members'),
        where('status', '==', memberStatus),
        orderBy('ordre', 'desc')
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return 1;

      const maxOrdre = snapshot.docs[0].data().ordre || 0;
      return maxOrdre + 1;
    } catch (err) {
      console.error('Erreur lors du calcul de l\'ordre:', err);
      return 1;
    }
  }, []);

  /**
   * Crée un nouveau membre
   */
  const createMember = useCallback(async (
    data: Omit<ChurchMember, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      // Calcul automatique de l'ordre si non fourni
      let ordre = data.ordre;
      if (!ordre || ordre === 0) {
        ordre = await getNextOrdre(data.status);
      }

      // Préparer les données en convertissant undefined en null
      const memberData: Record<string, unknown> = {
        firstName: data.firstName,
        lastName: data.lastName.toUpperCase(),
        status: data.status,
        conseilFunction: data.conseilFunction || null,
        observations: data.observations || null,
        dateRadiation: data.dateRadiation || null,
        ordre,
        isActive: data.isActive ?? true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: data.createdBy || null,
      };

      const docRef = await addDoc(collection(firestore, 'church_members'), memberData);

      await getAllMembers();
      return docRef.id;
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur lors de la création du membre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllMembers, getNextOrdre]);

  /**
   * Met à jour un membre
   */
  const updateMember = useCallback(async (
    id: string,
    data: Partial<ChurchMember>
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Filtrer les valeurs undefined (Firestore ne les accepte pas)
      const updateData: Record<string, unknown> = {
        updatedAt: Timestamp.now(),
      };

      // Copier seulement les valeurs définies (convertir undefined en null)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          updateData[key] = value === undefined ? null : value;
        }
      });

      // Force majuscules sur lastName si présent
      if (data.lastName) {
        updateData.lastName = data.lastName.toUpperCase();
      }

      const docRef = doc(firestore, 'church_members', id);
      await updateDoc(docRef, updateData);

      await getAllMembers();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du membre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllMembers]);

  /**
   * Supprime un membre
   */
  const deleteMember = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(firestore, 'church_members', id));
      await getAllMembers();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du membre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllMembers]);

  /**
   * Bascule le statut actif/inactif
   */
  const toggleActive = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await updateMember(id, { isActive: !currentStatus });
    } catch (err) {
      console.error('Erreur lors du toggle:', err);
      throw err;
    }
  }, [updateMember]);

  /**
   * Import de membres en masse avec détection de doublons
   */
  const importMembers = useCallback(async (
    membersData: Partial<ChurchMember>[]
  ): Promise<{ created: number; errors: number }> => {
    try {
      setLoading(true);
      setError(null);

      // Récupère les membres existants pour détection de doublons
      const existingSnapshot = await getDocs(collection(firestore, 'church_members'));
      const existingMembers = existingSnapshot.docs.map(doc => ({
        firstName: doc.data().firstName.toLowerCase(),
        lastName: doc.data().lastName.toLowerCase(),
      }));

      let created = 0;
      let errors = 0;

      const batch = writeBatch(firestore);
      let batchCount = 0;

      for (const memberData of membersData) {
        try {
          if (!memberData.firstName || !memberData.lastName) {
            errors++;
            continue;
          }

          // Détection de doublons
          const isDuplicate = existingMembers.some(existing =>
            existing.firstName === memberData.firstName!.toLowerCase() &&
            existing.lastName === memberData.lastName!.toLowerCase()
          );

          if (isDuplicate) {
            console.log(`⚠️ Doublon ignoré: ${memberData.firstName} ${memberData.lastName}`);
            continue;
          }

          const docRef = doc(collection(firestore, 'church_members'));
          batch.set(docRef, {
            firstName: memberData.firstName,
            lastName: memberData.lastName!.toUpperCase(),
            status: memberData.status || 'actif',
            conseilFunction: memberData.conseilFunction || null,
            observations: memberData.observations || null,
            dateRadiation: memberData.dateRadiation || null,
            ordre: memberData.ordre || created + 1,
            isActive: memberData.isActive !== undefined ? memberData.isActive : true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          batchCount++;
          created++;

          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }
        } catch (err) {
          console.error(`❌ Erreur pour ${memberData.firstName} ${memberData.lastName}:`, err);
          errors++;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      await getAllMembers();

      return { created, errors };
    } catch (err) {
      console.error('Erreur lors de l\'import:', err);
      setError('Erreur lors de l\'import des membres');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllMembers]);

  // Chargement automatique au montage
  useEffect(() => {
    if (autoLoad) {
      getAllMembers();
    }
  }, [autoLoad, getAllMembers]);

  return {
    members,
    loading,
    error,
    getAllMembers,
    getConseilMembers,
    getArchivedMembers,
    getActiveMembers,
    searchMembers,
    createMember,
    updateMember,
    deleteMember,
    toggleActive,
    importMembers,
    getNextOrdre,
  };
}
