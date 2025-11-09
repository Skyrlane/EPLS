"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  FirestoreError,
  orderBy,
  Unsubscribe
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type RealtimeStatus = "idle" | "loading" | "success" | "error";

interface UseRealtimeCollectionOptions<T> {
  collectionName: string;
  idField?: keyof T;
  queryConstraints?: QueryConstraint[];
  disabled?: boolean;
  onData?: (data: T[]) => void;
  onError?: (error: FirestoreError) => void;
}

export function useRealtimeCollection<T extends DocumentData = DocumentData>(
  options: UseRealtimeCollectionOptions<T>
) {
  const {
    collectionName,
    idField = "id" as keyof T,
    queryConstraints = [],
    disabled = false,
    onData,
    onError
  } = options;

  const [status, setStatus] = useState<RealtimeStatus>(disabled ? "idle" : "loading");
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [subscription, setSubscription] = useState<Unsubscribe | null>(null);

  // Fonction pour arrêter l'abonnement
  const unsubscribe = useCallback(() => {
    if (subscription) {
      subscription();
      setSubscription(null);
    }
  }, [subscription]);

  // Fonction pour démarrer l'abonnement
  const subscribe = useCallback(() => {
    if (disabled) {
      setStatus("idle");
      return;
    }

    try {
      setStatus("loading");
      
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      
      const unsubscribeFn = onSnapshot(
        q,
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            [idField]: doc.id,
          } as T));
          
          setData(documents);
          setStatus("success");
          
          if (onData) {
            onData(documents);
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
      console.error("Erreur lors de l'abonnement à la collection:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onError) {
        onError(fsError);
      }
    }
  }, [collectionName, queryConstraints, idField, disabled, onData, onError]);

  // Démarrer/arrêter l'abonnement lors du montage/démontage ou du changement des dépendances
  useEffect(() => {
    subscribe();
    
    // Fonction de nettoyage appelée lors du démontage ou avant réexécution de l'effet
    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

  // Fonction pour mettre à jour les contraintes de requête
  const updateQueryConstraints = useCallback((newConstraints: QueryConstraint[]) => {
    // Désabonner de l'abonnement actuel
    unsubscribe();
    
    // On ne peut pas mettre à jour les options directement à cause des closures
    // Donc on recrée un nouvel abonnement avec les nouvelles contraintes
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...newConstraints);
    
    setStatus("loading");
    
    const newUnsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          [idField]: doc.id,
        } as T));
        
        setData(documents);
        setStatus("success");
        
        if (onData) {
          onData(documents);
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
    
    setSubscription(() => newUnsubscribe);
  }, [collectionName, idField, onData, onError, unsubscribe]);

  // Fonction de commodité pour récupérer un document spécifique par son ID
  const getDocumentById = useCallback((id: string): T | undefined => {
    return data.find(item => (item[idField] as unknown) === id);
  }, [data, idField]);

  return {
    // États
    data,
    status,
    error,
    
    // Contrôles de l'abonnement
    subscribe,
    unsubscribe,
    updateQueryConstraints,
    
    // Helpers
    getDocumentById,
    
    // État de l'abonnement
    isSubscribed: !!subscription,
  };
} 