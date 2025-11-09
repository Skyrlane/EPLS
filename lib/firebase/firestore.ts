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
  DocumentData,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
  WithFieldValue,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './index';

// Types génériques pour faciliter l'utilisation
export type CollectionType<T = DocumentData> = CollectionReference<T>;
export type DocumentType<T = DocumentData> = DocumentReference<T>;

// Créer une référence à une collection
export const getCollection = <T = DocumentData>(path: string): CollectionType<T> => {
  return collection(db, path) as CollectionType<T>;
};

// Créer une référence à un document
export const getDocument = <T = DocumentData>(path: string, id: string): DocumentType<T> => {
  return doc(db, path, id) as DocumentType<T>;
};

// Ajouter un document avec un ID généré automatiquement
export const addDocument = async <T>(
  collectionPath: string,
  data: WithFieldValue<T>
): Promise<DocumentReference<T>> => {
  return addDoc(collection(db, collectionPath), data) as Promise<DocumentReference<T>>;
};

// Définir un document avec un ID spécifique
export const setDocument = async <T>(
  collectionPath: string,
  id: string,
  data: WithFieldValue<T>,
  options = { merge: true }
): Promise<void> => {
  return setDoc(doc(db, collectionPath, id), data, options);
};

// Mettre à jour un document existant
export const updateDocument = async <T>(
  collectionPath: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  return updateDoc(doc(db, collectionPath, id), data as DocumentData);
};

// Supprimer un document
export const deleteDocument = async (
  collectionPath: string,
  id: string
): Promise<void> => {
  return deleteDoc(doc(db, collectionPath, id));
};

// Récupérer un seul document
export const getDocumentById = async <T>(
  collectionPath: string,
  id: string
): Promise<T | null> => {
  const docSnap = await getDoc(doc(db, collectionPath, id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

// Récupérer tous les documents d'une collection
export const getAllDocuments = async <T>(
  collectionPath: string
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionPath));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

// Construire une requête Firestore
export const createQuery = <T>(
  collectionPath: string,
  conditions: Array<{
    field: string;
    operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
    value: any;
  }> = [],
  sortBy?: { field: string; direction: 'asc' | 'desc' },
  limitTo?: number
) => {
  const collectionRef = collection(db, collectionPath);
  
  // Appliquer les conditions
  let queryRef = query(collectionRef);
  
  if (conditions.length > 0) {
    conditions.forEach(condition => {
      queryRef = query(queryRef, where(condition.field, condition.operator, condition.value));
    });
  }
  
  // Appliquer le tri
  if (sortBy) {
    queryRef = query(queryRef, orderBy(sortBy.field, sortBy.direction));
  }
  
  // Appliquer la limite
  if (limitTo) {
    queryRef = query(queryRef, limit(limitTo));
  }
  
  return queryRef;
};

// Obtenir les résultats d'une requête
export const getQueryResults = async <T>(queryRef: any): Promise<T[]> => {
  const querySnapshot = await getDocs(queryRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

// Observer les changements en temps réel sur un document
export const onDocumentChange = <T>(
  collectionPath: string,
  id: string,
  callback: (data: T | null) => void
): (() => void) => {
  const docRef = doc(db, collectionPath, id);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as T);
    } else {
      callback(null);
    }
  });
};

// Observer les changements en temps réel sur une collection
export const onCollectionChange = <T>(
  collectionPath: string,
  callback: (data: T[]) => void
): (() => void) => {
  const collectionRef = collection(db, collectionPath);
  
  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    callback(data);
  });
};

// Convertir un timestamp Firestore en Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Obtenir un timestamp serveur
export const getServerTimestamp = () => {
  return serverTimestamp();
}; 