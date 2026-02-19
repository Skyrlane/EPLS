import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

// Authentification
export async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logOut(): Promise<void> {
  return signOut(auth);
}

export async function updateUserProfile(user: User, displayName?: string, photoURL?: string) {
  const updateData: { displayName?: string; photoURL?: string } = {};
  
  if (displayName) updateData.displayName = displayName;
  if (photoURL) updateData.photoURL = photoURL;
  
  return updateProfile(user, updateData);
}

// Firestore
export async function getDocuments<T = DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

export async function getDocumentById<T = DocumentData>(
  collectionPath: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionPath, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as T;
  }
  
  return null;
}

export async function addDocument<T extends object>(
  collectionPath: string,
  data: T
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionPath), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return docRef.id;
}

export async function updateDocument<T extends object>(
  collectionPath: string,
  documentId: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, collectionPath, documentId);
  return updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteDocument(
  collectionPath: string,
  documentId: string
): Promise<void> {
  const docRef = doc(db, collectionPath, documentId);
  return deleteDoc(docRef);
}

// Storage
export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
}

// Utilitaires
export function createOrderByConstraint(field: string, direction: "asc" | "desc" = "desc") {
  return orderBy(field, direction);
}

export function createWhereConstraint(field: string, operator: string, value: any) {
  return where(field, operator, value);
}

export function createLimitConstraint(limitCount: number) {
  return limit(limitCount);
}

export type FirestoreTimestamp = Timestamp;

/**
 * Convertit un objet Firestore en objet utilisable dans l'application
 * en transformant les Timestamps en Date et en ajoutant l'id du document
 */
export function formatDoc<T>(doc: DocumentData): T {
  return {
    id: doc.id,
    ...doc.data(),
    // Convertir les Timestamps en Date
    ...Object.entries(doc.data()).reduce((acc, [key, value]) => {
      if (value instanceof Timestamp) {
        acc[key] = value.toDate();
      }
      return acc;
    }, {} as Record<string, any>),
  } as T;
}

/**
 * Récupère un document par son ID
 */
export async function getDocById<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return formatDoc<T>(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du document ${id}:`, error);
    throw error;
  }
}

/**
 * Récupère tous les documents d'une collection
 */
export async function getAllDocs<T>(
  collectionName: string,
  sortBy: string = "createdAt",
  sortDirection: "asc" | "desc" = "desc",
  limitCount?: number
): Promise<T[]> {
  try {
    let q = query(collection(db, collectionName), orderBy(sortBy, sortDirection));
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => formatDoc<T>(doc));
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents de ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Récupère les documents d'une collection qui correspondent à une condition
 */
export async function getDocsByField<T>(
  collectionName: string,
  field: string,
  value: any,
  sortBy: string = "createdAt",
  sortDirection: "asc" | "desc" = "desc"
): Promise<T[]> {
  try {
    const q = query(
      collection(db, collectionName),
      where(field, "==", value),
      orderBy(sortBy, sortDirection)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => formatDoc<T>(doc));
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents par ${field}:`, error);
    throw error;
  }
}

/**
 * Récupère les informations utilisateur étendues depuis Firestore
 */
export async function getUserProfile<T>(userId: string): Promise<T | null> {
  return getDocById<T>("users", userId);
}

/**
 * Crée ou met à jour un profil utilisateur dans Firestore
 * Utilise setDoc avec merge pour fonctionner sur les documents inexistants (nouveaux utilisateurs)
 * @deprecated Use saveUserProfile from lib/firebase-helpers.ts instead
 */
export async function saveUserProfile(user: User, additionalData?: Record<string, any>) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: additionalData?.role ?? 'member',
        updatedAt: serverTimestamp(),
        ...(userSnap.exists() ? {} : { createdAt: serverTimestamp() }),
        ...additionalData,
      },
      { merge: true }
    );

    return userRef.id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du profil utilisateur:", error);
    throw error;
  }
}

/**
 * Télécharge un fichier vers Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string,
  metadata?: Record<string, any>
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error);
    throw error;
  }
}

/**
 * Supprime un fichier de Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error);
    throw error;
  }
} 