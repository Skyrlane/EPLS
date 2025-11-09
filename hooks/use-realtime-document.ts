"use client";

import { useState, useEffect, useCallback } from "react";
import {
  doc,
  onSnapshot,
  DocumentData,
  DocumentReference,
  FirestoreError,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Unsubscribe,
  serverTimestamp,
  WithFieldValue
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type RealtimeStatus = "idle" | "loading" | "success" | "error";

interface UseRealtimeDocumentOptions<T> {
  collectionName: string;
  documentId?: string;
  disabled?: boolean;
  idField?: keyof T;
  onData?: (data: T | null) => void;
  onError?: (error: FirestoreError) => void;
}

export function useRealtimeDocument<T extends DocumentData = DocumentData>(
  options: UseRealtimeDocumentOptions<T>
) {
  const {
    collectionName,
    documentId,
    disabled = false,
    idField = "id" as keyof T,
    onData,
    onError
  } = options;

  const [status, setStatus] = useState<RealtimeStatus>(
    disabled || !documentId ? "idle" : "loading"
  );
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [subscription, setSubscription] = useState<Unsubscribe | null>(null);

  // Obtenir une référence au document
  const getDocumentRef = useCallback((id?: string): DocumentReference | null => {
    if (!id) return null;
    return doc(firestore, collectionName, id);
  }, [collectionName]);

  // Fonction pour arrêter l'abonnement
  const unsubscribe = useCallback(() => {
    if (subscription) {
      subscription();
      setSubscription(null);
    }
  }, [subscription]);

  // Fonction pour démarrer l'abonnement
  const subscribe = useCallback((id?: string) => {
    const docId = id || documentId;

    // Si désactivé ou pas d'ID, ne pas s'abonner
    if (disabled || !docId) {
      setStatus("idle");
      return;
    }

    try {
      setStatus("loading");
      
      const docRef = getDocumentRef(docId);
      
      if (!docRef) {
        throw new Error("Référence de document invalide");
      }
      
      const unsubscribeFn = onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const docData = {
              ...docSnapshot.data(),
              [idField]: docSnapshot.id,
            } as T;
            
            setData(docData);
            setStatus("success");
            
            if (onData) {
              onData(docData);
            }
          } else {
            setData(null);
            setStatus("success");
            
            if (onData) {
              onData(null);
            }
          }
        },
        (err: FirestoreError) => {
          setError(err);
          setStatus("error");
          
          if (onError) {
            onError(err);
          }
        }
      );
      
      setSubscription(() => unsubscribeFn);
      
      // Fonction de nettoyage
      return unsubscribeFn;
    } catch (err) {
      console.error("Erreur lors de l'abonnement au document:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onError) {
        onError(fsError);
      }
    }
  }, [collectionName, documentId, disabled, idField, onData, onError, getDocumentRef]);

  // Démarrer/arrêter l'abonnement lors du montage/démontage ou du changement des dépendances
  useEffect(() => {
    subscribe();
    
    // Fonction de nettoyage appelée lors du démontage ou avant réexécution de l'effet
    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

  // Récupérer manuellement le document (sans abonnement)
  const fetchDocument = useCallback(async (id?: string): Promise<T | null> => {
    const docId = id || documentId;
    
    if (!docId) {
      return null;
    }
    
    setStatus("loading");
    
    try {
      const docRef = getDocumentRef(docId);
      
      if (!docRef) {
        throw new Error("Référence de document invalide");
      }
      
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        const docData = {
          ...docSnapshot.data(),
          [idField]: docSnapshot.id,
        } as T;
        
        setData(docData);
        setStatus("success");
        
        return docData;
      } else {
        setData(null);
        setStatus("success");
        
        return null;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du document:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onError) {
        onError(fsError);
      }
      
      return null;
    }
  }, [documentId, idField, onError, getDocumentRef]);

  // Créer ou mettre à jour un document
  const saveDocument = useCallback(async (
    data: WithFieldValue<Partial<T>>,
    id?: string,
    merge: boolean = true
  ): Promise<T | null> => {
    const docId = id || documentId;
    
    if (!docId) {
      throw new Error("ID de document requis");
    }
    
    setStatus("loading");
    
    try {
      const docRef = getDocumentRef(docId);
      
      if (!docRef) {
        throw new Error("Référence de document invalide");
      }
      
      const timestampedData = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      
      // Si merge est true et que le document existe déjà, simplement le mettre à jour
      // Sinon, le créer avec les horodatages complets
      if (!merge) {
        await setDoc(docRef, {
          ...timestampedData,
          createdAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, timestampedData, { merge: true });
      }
      
      // Récupérer le document mis à jour (l'abonnement va mettre à jour les données automatiquement si actif)
      if (!subscription) {
        return await fetchDocument(docId);
      }
      
      return data as unknown as T;
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du document:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onError) {
        onError(fsError);
      }
      
      return null;
    }
  }, [documentId, fetchDocument, onError, subscription, getDocumentRef]);

  // Mettre à jour partiellement un document
  const updateDocument = useCallback(async (
    data: WithFieldValue<Partial<T>>,
    id?: string
  ): Promise<T | null> => {
    const docId = id || documentId;
    
    if (!docId) {
      throw new Error("ID de document requis");
    }
    
    setStatus("loading");
    
    try {
      const docRef = getDocumentRef(docId);
      
      if (!docRef) {
        throw new Error("Référence de document invalide");
      }
      
      const timestampedData = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(docRef, timestampedData);
      
      // Récupérer le document mis à jour (l'abonnement va mettre à jour les données automatiquement si actif)
      if (!subscription) {
        return await fetchDocument(docId);
      }
      
      return data as unknown as T;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du document:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onError) {
        onError(fsError);
      }
      
      return null;
    }
  }, [documentId, fetchDocument, onError, subscription, getDocumentRef]);

  // Supprimer un document
  const deleteDocument = useCallback(async (id?: string): Promise<boolean> => {
    const docId = id || documentId;
    
    if (!docId) {
      throw new Error("ID de document requis");
    }
    
    setStatus("loading");
    
    try {
      const docRef = getDocumentRef(docId);
      
      if (!docRef) {
        throw new Error("Référence de document invalide");
      }
      
      await deleteDoc(docRef);
      
      setData(null);
      setStatus("success");
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression du document:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onError) {
        onError(fsError);
      }
      
      return false;
    }
  }, [documentId, onError, getDocumentRef]);

  return {
    // États
    data,
    status,
    error,
    
    // Actions
    fetchDocument,
    saveDocument,
    updateDocument,
    deleteDocument,
    
    // Abonnement
    subscribe,
    unsubscribe,
    isSubscribed: !!subscription,
  };
} 