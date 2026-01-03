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
import type { Contact } from '@/types';

interface UseContactsOptions {
  letter?: string;          // Filtrer par première lettre du nom
  activeOnly?: boolean;     // Seulement les contacts actifs
  memberOnly?: boolean;     // Seulement les membres
  autoLoad?: boolean;       // Charger automatiquement au mount
}

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  getAllContacts: () => Promise<void>;
  getActiveContacts: () => Promise<Contact[]>;
  getContactsByLetter: (letter: string) => Promise<Contact[]>;
  getMemberContacts: () => Promise<Contact[]>;
  searchContacts: (query: string) => Promise<Contact[]>;
  createContact: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  toggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  importContacts: (contacts: any[]) => Promise<{ created: number; errors: number }>;
}

/**
 * Hook personnalisé pour gérer le carnet d'adresses
 *
 * @example
 * // Récupérer tous les contacts
 * const { contacts, loading, createContact } = useContacts();
 *
 * @example
 * // Filtrer par lettre et seulement les actifs
 * const { contacts, loading } = useContacts({ letter: 'A', activeOnly: true });
 */
export function useContacts(options: UseContactsOptions = {}): UseContactsReturn {
  const { letter, activeOnly = false, memberOnly = false, autoLoad = true } = options;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère tous les contacts depuis Firestore
   */
  const getAllContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construction de la query de base
      let q = query(
        collection(firestore, 'contacts'),
        orderBy('lastName', 'asc'),
        orderBy('firstName', 'asc')
      );

      // Filtre par statut actif si demandé
      if (activeOnly) {
        q = query(
          collection(firestore, 'contacts'),
          where('isActive', '==', true),
          orderBy('lastName', 'asc'),
          orderBy('firstName', 'asc')
        );
      }

      // Filtre par membre si demandé
      if (memberOnly) {
        if (activeOnly) {
          q = query(
            collection(firestore, 'contacts'),
            where('isActive', '==', true),
            where('isMember', '==', true),
            orderBy('lastName', 'asc'),
            orderBy('firstName', 'asc')
          );
        } else {
          q = query(
            collection(firestore, 'contacts'),
            where('isMember', '==', true),
            orderBy('lastName', 'asc'),
            orderBy('firstName', 'asc')
          );
        }
      }

      const snapshot = await getDocs(q);
      let data: Contact[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Contact));

      // Filtre par lettre côté client (Firestore ne supporte pas startsWith)
      if (letter && letter !== 'ALL') {
        data = data.filter(contact =>
          contact.lastName.toUpperCase().startsWith(letter.toUpperCase())
        );
      }

      setContacts(data);
    } catch (err) {
      console.error('Erreur lors du chargement des contacts:', err);
      setError('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  }, [letter, activeOnly, memberOnly]);

  /**
   * Récupère seulement les contacts actifs
   */
  const getActiveContacts = useCallback(async (): Promise<Contact[]> => {
    try {
      const q = query(
        collection(firestore, 'contacts'),
        where('isActive', '==', true),
        orderBy('lastName', 'asc'),
        orderBy('firstName', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Contact));
    } catch (err) {
      console.error('Erreur lors du chargement des contacts actifs:', err);
      throw err;
    }
  }, []);

  /**
   * Récupère les contacts par première lettre du nom
   */
  const getContactsByLetter = useCallback(async (targetLetter: string): Promise<Contact[]> => {
    try {
      let q = query(
        collection(firestore, 'contacts'),
        orderBy('lastName', 'asc'),
        orderBy('firstName', 'asc')
      );

      if (activeOnly) {
        q = query(
          collection(firestore, 'contacts'),
          where('isActive', '==', true),
          orderBy('lastName', 'asc'),
          orderBy('firstName', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      const allContacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Contact));

      // Filtre côté client par lettre
      if (targetLetter === 'ALL') {
        return allContacts;
      }

      return allContacts.filter(contact =>
        contact.lastName.toUpperCase().startsWith(targetLetter.toUpperCase())
      );
    } catch (err) {
      console.error('Erreur lors du chargement des contacts par lettre:', err);
      throw err;
    }
  }, [activeOnly]);

  /**
   * Récupère seulement les membres
   */
  const getMemberContacts = useCallback(async (): Promise<Contact[]> => {
    try {
      let q = query(
        collection(firestore, 'contacts'),
        where('isMember', '==', true),
        orderBy('lastName', 'asc')
      );

      if (activeOnly) {
        q = query(
          collection(firestore, 'contacts'),
          where('isActive', '==', true),
          where('isMember', '==', true),
          orderBy('lastName', 'asc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Contact));
    } catch (err) {
      console.error('Erreur lors du chargement des membres:', err);
      throw err;
    }
  }, [activeOnly]);

  /**
   * Recherche dans les contacts (nom, prénom, ville, email)
   */
  const searchContacts = useCallback(async (searchQuery: string): Promise<Contact[]> => {
    try {
      const q = query(
        collection(firestore, 'contacts'),
        orderBy('lastName', 'asc')
      );

      const snapshot = await getDocs(q);
      const allContacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Contact));

      // Recherche côté client (insensible à la casse)
      const lowerQuery = searchQuery.toLowerCase();
      return allContacts.filter(contact =>
        contact.firstName.toLowerCase().includes(lowerQuery) ||
        contact.lastName.toLowerCase().includes(lowerQuery) ||
        contact.city?.toLowerCase().includes(lowerQuery) ||
        contact.email?.toLowerCase().includes(lowerQuery)
      );
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      throw err;
    }
  }, []);

  /**
   * Crée un nouveau contact
   */
  const createContact = useCallback(async (
    data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = await addDoc(collection(firestore, 'contacts'), {
        ...data,
        lastName: data.lastName.toUpperCase(), // Force majuscules
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await getAllContacts();
      return docRef.id;
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur lors de la création du contact');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllContacts]);

  /**
   * Met à jour un contact
   */
  const updateContact = useCallback(async (
    id: string,
    data: Partial<Contact>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      // Force majuscules sur lastName si présent
      if (data.lastName) {
        updateData.lastName = data.lastName.toUpperCase();
      }

      const docRef = doc(firestore, 'contacts', id);
      await updateDoc(docRef, updateData);

      await getAllContacts();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour du contact');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllContacts]);

  /**
   * Supprime un contact
   */
  const deleteContact = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(firestore, 'contacts', id));
      await getAllContacts();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du contact');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllContacts]);

  /**
   * Bascule le statut actif/inactif
   */
  const toggleActive = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await updateContact(id, { isActive: !currentStatus });
    } catch (err) {
      console.error('Erreur lors du toggle:', err);
      throw err;
    }
  }, [updateContact]);

  /**
   * Import de contacts en masse avec détection de doublons
   */
  const importContacts = useCallback(async (
    contactsData: any[]
  ): Promise<{ created: number; errors: number }> => {
    try {
      setLoading(true);
      setError(null);

      // Récupère les contacts existants pour détection de doublons
      const existingSnapshot = await getDocs(collection(firestore, 'contacts'));
      const existingContacts = existingSnapshot.docs.map(doc => ({
        firstName: doc.data().firstName.toLowerCase(),
        lastName: doc.data().lastName.toLowerCase(),
      }));

      let created = 0;
      let errors = 0;

      // Import avec batch (max 500 par batch)
      const batch = writeBatch(firestore);
      let batchCount = 0;

      for (const contactData of contactsData) {
        try {
          // Détection de doublons (même nom + prénom)
          const isDuplicate = existingContacts.some(existing =>
            existing.firstName === contactData.firstName.toLowerCase() &&
            existing.lastName === contactData.lastName.toLowerCase()
          );

          if (isDuplicate) {
            console.log(`⚠️ Doublon ignoré: ${contactData.firstName} ${contactData.lastName}`);
            continue;
          }

          // Ajoute au batch
          const docRef = doc(collection(firestore, 'contacts'));
          batch.set(docRef, {
            firstName: contactData.firstName,
            lastName: contactData.lastName.toUpperCase(),
            phoneFixed: contactData.phoneFixed || null,
            phoneMobile: contactData.phoneMobile || null,
            email: contactData.email || null,
            address: contactData.address || null,
            postalCode: contactData.postalCode || null,
            city: contactData.city || null,
            birthDate: contactData.birthDate || null,
            isMember: contactData.isMember || false,
            isActive: true,
            notes: '',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          batchCount++;
          created++;

          // Commit du batch tous les 500 documents
          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }
        } catch (err) {
          console.error(`❌ Erreur pour ${contactData.firstName} ${contactData.lastName}:`, err);
          errors++;
        }
      }

      // Commit du reste
      if (batchCount > 0) {
        await batch.commit();
      }

      await getAllContacts();

      return { created, errors };
    } catch (err) {
      console.error('Erreur lors de l\'import:', err);
      setError('Erreur lors de l\'import des contacts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllContacts]);

  // Chargement automatique au montage si demandé
  useEffect(() => {
    if (autoLoad) {
      console.log('🔄 useContacts: Loading contacts', { letter, activeOnly, memberOnly });
      getAllContacts();
    }
  }, [autoLoad, letter, activeOnly, memberOnly, getAllContacts]);

  return {
    contacts,
    loading,
    error,
    getAllContacts,
    getActiveContacts,
    getContactsByLetter,
    getMemberContacts,
    searchContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleActive,
    importContacts,
  };
}
