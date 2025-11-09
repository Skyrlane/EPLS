"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
  WithFieldValue,
  QuerySnapshot,
  serverTimestamp,
  FirestoreError
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type FirestoreStatus = "idle" | "loading" | "success" | "error";

interface UseFirestoreOptions<T> {
  collectionName: string;
  idField?: keyof T;
}

/**
 * Hook personnalisé pour interagir avec Firestore
 * Fournit une interface complète pour les opérations CRUD sur une collection Firestore
 * avec typage générique, gestion des erreurs et support des timestamps.
 * 
 * @template T Type de données stockées dans la collection Firestore
 * @param {UseFirestoreOptions<T>} options Configuration du hook
 * @returns {Object} Méthodes et états pour interagir avec Firestore
 */
export function useFirestore<T extends DocumentData = DocumentData>(
  options: UseFirestoreOptions<T>
) {
  const { collectionName, idField = "id" as keyof T } = options;
  const [status, setStatus] = useState<FirestoreStatus>("idle");
  const [data, setData] = useState<T | null>(null);
  const [dataList, setDataList] = useState<T[]>([]);
  const [error, setError] = useState<FirestoreError | null>(null);

  /**
   * Obtient une référence à la collection Firestore
   * 
   * @returns {CollectionReference<DocumentData>} Référence à la collection
   */
  const getCollectionRef = useCallback((): CollectionReference<DocumentData> => {
    return collection(firestore, collectionName);
  }, [collectionName]);

  /**
   * Obtient une référence à un document spécifique dans la collection
   * 
   * @param {string} id Identifiant du document
   * @returns {DocumentReference<DocumentData>} Référence au document
   */
  const getDocumentRef = useCallback((id: string): DocumentReference<DocumentData> => {
    return doc(firestore, collectionName, id);
  }, [collectionName]);

  /**
   * Récupère un document par son ID
   * 
   * @param {string} id Identifiant du document à récupérer
   * @returns {Promise<T | null>} Document trouvé ou null si inexistant
   */
  const getDocument = useCallback(async (id: string): Promise<T | null> => {
    setStatus("loading");
    try {
      const docRef = getDocumentRef(id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const docData = { 
          ...(docSnap.data() as Object), 
          [idField]: docSnap.id 
        } as unknown as T;
        
        setData(docData);
        setStatus("success");
        return docData;
      } else {
        setData(null);
        setStatus("success");
        return null;
      }
    } catch (err) {
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
      return null;
    }
  }, [getDocumentRef, idField]);

  /**
   * Récupère plusieurs documents de la collection avec filtrage optionnel
   * 
   * @param {QueryConstraint[]} queryConstraints Contraintes de requête (where, orderBy, limit...)
   * @returns {Promise<T[]>} Liste des documents correspondants
   */
  const getDocuments = useCallback(async (
    queryConstraints: QueryConstraint[] = []
  ): Promise<T[]> => {
    setStatus("loading");
    try {
      const collectionRef = getCollectionRef();
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => {
        return {
          ...(doc.data() as Object),
          [idField]: doc.id
        } as unknown as T;
      });
      
      setDataList(documents);
      setStatus("success");
      return documents;
    } catch (err) {
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
      return [];
    }
  }, [getCollectionRef, idField]);

  /**
   * Crée ou remplace un document avec un ID spécifique
   * 
   * @param {string} id Identifiant du document à créer/remplacer
   * @param {WithFieldValue<Omit<T, typeof idField>>} data Données du document
   * @param {boolean} merge Si true, fusionne avec un document existant au lieu de le remplacer
   * @returns {Promise<T | null>} Document créé ou null en cas d'erreur
   */
  const setDocument = useCallback(async (
    id: string,
    data: WithFieldValue<Omit<T, typeof idField>>,
    merge: boolean = false
  ): Promise<T | null> => {
    setStatus("loading");
    try {
      const docRef = getDocumentRef(id);
      const timestampedData = {
        ...data as object,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
      
      await setDoc(docRef, timestampedData, { merge });
      
      const newDoc = { 
        ...data as object, 
        [idField]: id 
      } as unknown as T;
      
      setData(newDoc);
      setStatus("success");
      return newDoc;
    } catch (err) {
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
      return null;
    }
  }, [getDocumentRef, idField]);

  /**
   * Crée un document avec un ID généré automatiquement
   * 
   * @param {WithFieldValue<Omit<T, typeof idField>>} data Données du document
   * @returns {Promise<T | null>} Document créé ou null en cas d'erreur
   */
  const addDocument = useCallback(async (
    data: WithFieldValue<Omit<T, typeof idField>>
  ): Promise<T | null> => {
    setStatus("loading");
    try {
      const collectionRef = getCollectionRef();
      const timestampedData = {
        ...data as object,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collectionRef, timestampedData);
      
      const newDoc = { 
        ...data as object, 
        [idField]: docRef.id 
      } as unknown as T;
      
      setData(newDoc);
      setStatus("success");
      return newDoc;
    } catch (err) {
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
      return null;
    }
  }, [getCollectionRef, idField]);

  /**
   * Met à jour partiellement un document existant
   * 
   * @param {string} id Identifiant du document à mettre à jour
   * @param {WithFieldValue<Partial<Omit<T, typeof idField>>>} data Données partielles à mettre à jour
   * @returns {Promise<T | null>} Document mis à jour ou null en cas d'erreur
   */
  const updateDocument = useCallback(async (
    id: string,
    data: WithFieldValue<Partial<Omit<T, typeof idField>>>
  ): Promise<T | null> => {
    setStatus("loading");
    try {
      const docRef = getDocumentRef(id);
      const timestampedData = {
        ...(data as object),
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, timestampedData);
      
      // Récupérer le document mis à jour
      const updatedDoc = await getDocument(id);
      return updatedDoc;
    } catch (err) {
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
      return null;
    }
  }, [getDocumentRef, getDocument]);

  /**
   * Supprime un document
   * 
   * @param {string} id Identifiant du document à supprimer
   * @returns {Promise<boolean>} True si la suppression a réussi, false sinon
   */
  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    setStatus("loading");
    try {
      const docRef = getDocumentRef(id);
      await deleteDoc(docRef);
      
      setData(null);
      setStatus("success");
      return true;
    } catch (err) {
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
      return false;
    }
  }, [getDocumentRef]);

  /**
   * S'abonne aux changements d'un document spécifique en temps réel
   * 
   * @param {string} id Identifiant du document à observer
   * @param {(data: T | null) => void} callback Fonction appelée à chaque changement
   * @returns {() => void} Fonction de désabonnement
   */
  const subscribeToDocument = useCallback((
    id: string,
    callback: (data: T | null) => void
  ): (() => void) => {
    const docRef = getDocumentRef(id);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const docData = { ...docSnap.data(), [idField]: docSnap.id } as T;
          callback(docData);
          setData(docData);
        } else {
          callback(null);
          setData(null);
        }
      },
      (err) => {
        setError(err);
        setStatus("error");
      }
    );
  }, [getDocumentRef, idField]);

  /**
   * S'abonne aux changements d'une collection en temps réel avec filtrage optionnel
   * 
   * @param {QueryConstraint[]} queryConstraints Contraintes de requête (where, orderBy, limit...)
   * @param {(data: T[]) => void} callback Fonction appelée à chaque changement
   * @returns {() => void} Fonction de désabonnement
   */
  const subscribeToCollection = useCallback((
    queryConstraints: QueryConstraint[] = [],
    callback: (data: T[]) => void
  ): (() => void) => {
    const collectionRef = getCollectionRef();
    const q = query(collectionRef, ...queryConstraints);
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          [idField]: doc.id
        } as T));
        
        callback(documents);
        setDataList(documents);
      },
      (err) => {
        setError(err);
        setStatus("error");
      }
    );
  }, [getCollectionRef, idField]);

  /**
   * Crée une contrainte de requête de type where
   * 
   * @param {string} field Champ sur lequel appliquer la contrainte
   * @param {string} operator Opérateur de comparaison
   * @param {any} value Valeur de comparaison
   * @returns {QueryConstraint} Contrainte de requête
   */
  const createWhereConstraint = useCallback((field: string, operator: "==" | "!=" | "<" | "<=" | ">" | ">=" | "array-contains" | "in" | "array-contains-any" | "not-in", value: any): QueryConstraint => {
    return where(field, operator, value);
  }, []);

  /**
   * Crée une contrainte de requête de type orderBy
   * 
   * @param {string} field Champ sur lequel appliquer le tri
   * @param {string} direction Direction du tri (asc ou desc)
   * @returns {QueryConstraint} Contrainte de tri
   */
  const createOrderConstraint = useCallback((field: string, direction: "asc" | "desc" = "asc"): QueryConstraint => {
    return orderBy(field, direction);
  }, []);

  /**
   * Crée une contrainte de requête de type limit
   * 
   * @param {number} limitCount Nombre maximum de résultats
   * @returns {QueryConstraint} Contrainte de limite
   */
  const createLimitConstraint = useCallback((limitCount: number): QueryConstraint => {
    return limit(limitCount);
  }, []);

  return {
    // États
    status,
    data,
    dataList,
    error,
    
    // Actions
    getDocument,
    getDocuments,
    setDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    
    // Abonnements
    subscribeToDocument,
    subscribeToCollection,
    
    // Helpers
    createWhereConstraint,
    createOrderConstraint,
    createLimitConstraint,
  };
} 