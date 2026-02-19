// Utilitaires avances pour Firebase

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
    limit,
    orderBy,
    DocumentData,
    WhereFilterOp,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import type { User } from "firebase/auth";

export interface UserProfile {
    id: string;
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'member' | 'admin' | 'visitor';
    createdAt: Date;
    updatedAt: Date;
    phoneNumber?: string;
    lastLogin?: Date;
    preferences?: Record<string, any>;
    [key: string]: any;
}

/**
 * Convertit un objet Firestore en objet utilisable dans l'application
 * en transformant les Timestamps en Date et en ajoutant l'id du document
 */
export function formatDocument<T>(doc: DocumentData): T {
    if (!doc.exists()) return null as unknown as T;

    const data = doc.data();

    // Convertir les Timestamps en Date
    const formattedData = Object.entries(data).reduce(
        (result, [key, value]) => {
            if (value instanceof Timestamp) {
                result[key] = value.toDate();
            } else {
                result[key] = value;
            }
            return result;
        },
        {} as Record<string, any>
    );

    return {
        id: doc.id,
        ...formattedData,
    } as T;
}

/**
 * Verifie si l'utilisateur a le role requis
 */
export async function hasRole(userId: string, role: string | string[]): Promise<boolean> {
    try {
        const profile = await getUserProfile(userId);

        if (!profile) return false;

        if (Array.isArray(role)) {
            return role.includes(profile.role);
        }

        return profile.role === role;
    } catch (error) {
        console.error("Erreur lors de la verification du role:", error);
        return false;
    }
}

/**
 * Recupere le profil utilisateur complet depuis Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return null;
        }

        return formatDocument<UserProfile>(userSnap);
    } catch (error) {
        console.error(`Erreur lors de la recuperation du profil utilisateur ${userId}:`, error);
        throw error;
    }
}

/**
 * Cree ou met a jour un profil utilisateur dans Firestore
 * Utilise setDoc avec merge pour fonctionner sur les documents inexistants (nouveaux utilisateurs)
 */
export async function saveUserProfile(
    user: User,
    additionalData?: Partial<UserProfile>
): Promise<string> {
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
 * Recupere les documents d'une collection avec filtrage avance
 */
export async function getFilteredDocuments<T>(
    collectionName: string,
    filters: Array<{
        field: string;
        operator: WhereFilterOp;
        value: any;
    }>,
    sortField: string = "createdAt",
    sortDir: "asc" | "desc" = "desc",
    limitCount?: number
): Promise<T[]> {
    try {
        // Creer une requete de base
        let q = query(collection(db, collectionName));

        // Ajouter les filtres
        filters.forEach((filter) => {
            q = query(q, where(filter.field, filter.operator, filter.value));
        });

        // Ajouter le tri
        q = query(q, orderBy(sortField, sortDir));

        // Ajouter une limite si specifiee
        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => formatDocument<T>(doc));
    } catch (error) {
        console.error(`Erreur lors de la recuperation des documents filtres de ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Telecharge un fichier vers Firebase Storage avec un nom unique
 */
export async function uploadFileWithUniqueFileName(
    file: File,
    storageFolder: string
): Promise<{ url: string; path: string }> {
    try {
        // Generer un nom de fichier unique avec timestamp
        const fileExtension = file.name.split('.').pop();
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
        const storagePath = `${storageFolder}/${uniqueFileName}`;

        // Reference au fichier dans Firebase Storage
        const storageRef = ref(storage, storagePath);

        // Televerser le fichier
        await uploadBytes(storageRef, file);

        // Recuperer l'URL de telechargement
        const downloadURL = await getDownloadURL(storageRef);

        return {
            url: downloadURL,
            path: storagePath
        };
    } catch (error) {
        console.error("Erreur lors du telechargement du fichier:", error);
        throw error;
    }
}
