"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const subscriptionRef = useRef<Unsubscribe | null>(null);
  
  // Utiliser des refs pour les callbacks et queryConstraints pour éviter les re-renders
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);
  const queryConstraintsRef = useRef(queryConstraints);
  
  // Mettre à jour les refs quand les valeurs changent
  useEffect(() => {
    onDataRef.current = onData;
    onErrorRef.current = onError;
    queryConstraintsRef.current = queryConstraints;
  }, [onData, onError, queryConstraints]);
  
  // Créer une clé stable pour queryConstraints afin d'éviter les re-renders inutiles
  const queryKey = useMemo(() => JSON.stringify(queryConstraints), [queryConstraints]);

  // Fonction pour arrêter l'abonnement
  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current();
      subscriptionRef.current = null;
      setIsSubscribed(false);
    }
  }, []); // Plus de dépendances - useRef ne nécessite pas de re-création

  // Effet principal pour gérer l'abonnement Firestore
  useEffect(() => {
    if (disabled) {
      setStatus("idle");
      return;
    }

    try {
      setStatus("loading");
      
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, ...queryConstraintsRef.current);
      
      const unsubscribeFn = onSnapshot(
        q,
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            [idField]: doc.id,
          } as T));
          
          setData(documents);
          setStatus("success");
          
          if (onDataRef.current) {
            onDataRef.current(documents);
          }
        },
        (err: FirestoreError) => {
          setError(err);
          setStatus("error");
          
          if (onErrorRef.current) {
            onErrorRef.current(err);
          }
        }
      );
      
      subscriptionRef.current = unsubscribeFn;
      setIsSubscribed(true);
      
      // Fonction de nettoyage
      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current();
          subscriptionRef.current = null;
          setIsSubscribed(false);
        }
      };
    } catch (err) {
      console.error("Erreur lors de l'abonnement à la collection:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onErrorRef.current) {
        onErrorRef.current(fsError);
      }
    }
  }, [collectionName, queryKey, idField, disabled]);

  // Fonction pour démarrer l'abonnement manuellement (API publique)
  // Cette fonction ignore le flag 'disabled' pour permettre un abonnement manuel forcé
  const subscribe = useCallback(() => {
    try {
      setStatus("loading");
      
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, ...queryConstraintsRef.current);
      
      const unsubscribeFn = onSnapshot(
        q,
        (querySnapshot) => {
          const documents = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            [idField]: doc.id,
          } as T));
          
          setData(documents);
          setStatus("success");
          
          if (onDataRef.current) {
            onDataRef.current(documents);
          }
        },
        (err: FirestoreError) => {
          setError(err);
          setStatus("error");
          
          if (onErrorRef.current) {
            onErrorRef.current(err);
          }
        }
      );
      
      subscriptionRef.current = unsubscribeFn;
      setIsSubscribed(true);
      
      return unsubscribeFn;
    } catch (err) {
      console.error("Erreur lors de l'abonnement à la collection:", err);
      const fsError = err as FirestoreError;
      setError(fsError);
      setStatus("error");
      
      if (onErrorRef.current) {
        onErrorRef.current(fsError);
      }
    }
  }, [collectionName, idField]);

  // Fonction pour mettre à jour les contraintes de requête
  const updateQueryConstraints = useCallback((newConstraints: QueryConstraint[]) => {
    // Désabonner de l'abonnement actuel
    unsubscribe();
    
    // Créer un nouvel abonnement avec les nouvelles contraintes
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
        
        if (onDataRef.current) {
          onDataRef.current(documents);
        }
      },
      (err: FirestoreError) => {
        setError(err);
        setStatus("error");
        
        if (onErrorRef.current) {
          onErrorRef.current(err);
        }
      }
    );
    
    subscriptionRef.current = newUnsubscribe;
    setIsSubscribed(true);
  }, [collectionName, idField, unsubscribe]);

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
    isSubscribed,
  };
} 