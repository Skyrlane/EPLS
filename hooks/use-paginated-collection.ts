"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  QueryConstraint,
  DocumentData,
  FirestoreError,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
  endBefore,
  limitToLast
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type PaginationStatus = "idle" | "loading" | "success" | "error" | "empty";

interface UsePaginatedCollectionOptions<T> {
  collectionName: string;
  idField?: keyof T;
  pageSize?: number;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  filterField?: string;
  filterOperator?: "==" | "!=" | "<" | "<=" | ">" | ">=";
  filterValue?: any;
  enabled?: boolean;
}

export function usePaginatedCollection<T extends DocumentData = DocumentData>(
  options: UsePaginatedCollectionOptions<T>
) {
  const {
    collectionName,
    idField = "id" as keyof T,
    pageSize = 10,
    orderByField = "createdAt",
    orderDirection = "desc",
    filterField,
    filterOperator,
    filterValue,
    enabled = true
  } = options;

  const [status, setStatus] = useState<PaginationStatus>("idle");
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Créer les contraintes de requête
  const createQueryConstraints = useCallback((): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [
      orderBy(orderByField, orderDirection),
      limit(pageSize)
    ];

    // Ajouter le filtre si tous les paramètres nécessaires sont fournis
    if (filterField && filterOperator && filterValue !== undefined) {
      constraints.unshift(where(filterField, filterOperator, filterValue));
    }

    return constraints;
  }, [orderByField, orderDirection, pageSize, filterField, filterOperator, filterValue]);

  // Extraire les données d'un instantané de requête
  const extractData = useCallback((querySnapshot: QuerySnapshot): T[] => {
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      [idField]: doc.id
    } as T));
  }, [idField]);

  // Charger la première page
  const loadFirstPage = useCallback(async (): Promise<void> => {
    if (!enabled) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setIsRefreshing(true);

    try {
      const collectionRef = collection(firestore, collectionName);
      const constraints = createQueryConstraints();
      const q = query(collectionRef, ...constraints);
      
      const querySnapshot = await getDocs(q);
      const documents = extractData(querySnapshot);
      
      setData(documents);
      setFirstVisible(querySnapshot.docs[0] || null);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === pageSize);
      setHasPrevious(false);
      setCurrentPage(1);
      setStatus(documents.length > 0 ? "success" : "empty");
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
    } finally {
      setIsRefreshing(false);
    }
  }, [collectionName, pageSize, enabled, createQueryConstraints, extractData]);

  // Charger la page suivante
  const loadNextPage = useCallback(async (): Promise<void> => {
    if (!lastVisible || !hasMore) {
      return;
    }

    setStatus("loading");

    try {
      const collectionRef = collection(firestore, collectionName);
      const constraints = [...createQueryConstraints(), startAfter(lastVisible)];
      const q = query(collectionRef, ...constraints);
      
      const querySnapshot = await getDocs(q);
      const documents = extractData(querySnapshot);
      
      if (documents.length > 0) {
        setData(documents);
        setFirstVisible(querySnapshot.docs[0] || null);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        setHasMore(querySnapshot.docs.length === pageSize);
        setHasPrevious(true);
        setCurrentPage(prev => prev + 1);
        setStatus("success");
      } else {
        setHasMore(false);
        setStatus("empty");
      }
    } catch (err) {
      console.error("Erreur lors du chargement de la page suivante:", err);
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
    }
  }, [collectionName, lastVisible, hasMore, createQueryConstraints, extractData, pageSize]);

  // Charger la page précédente
  const loadPreviousPage = useCallback(async (): Promise<void> => {
    if (!firstVisible || !hasPrevious) {
      return;
    }

    setStatus("loading");

    try {
      const collectionRef = collection(firestore, collectionName);
      const constraints = [
        ...createQueryConstraints().filter(c => !(c instanceof limit)), // Retirer la contrainte de limite
        endBefore(firstVisible),
        limitToLast(pageSize)
      ];
      const q = query(collectionRef, ...constraints);
      
      const querySnapshot = await getDocs(q);
      const documents = extractData(querySnapshot);
      
      if (documents.length > 0) {
        setData(documents);
        setFirstVisible(querySnapshot.docs[0] || null);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        setHasPrevious(currentPage > 2);
        setHasMore(true);
        setCurrentPage(prev => prev - 1);
        setStatus("success");
      } else {
        setHasPrevious(false);
        setStatus("empty");
      }
    } catch (err) {
      console.error("Erreur lors du chargement de la page précédente:", err);
      const firestoreError = err as FirestoreError;
      setError(firestoreError);
      setStatus("error");
    }
  }, [collectionName, firstVisible, hasPrevious, createQueryConstraints, extractData, pageSize, currentPage]);

  // Estimer le nombre total d'éléments
  const estimateTotalItems = useCallback(async (): Promise<void> => {
    try {
      const collectionRef = collection(firestore, collectionName);
      
      // Créer une requête filtrée, mais sans limite ni tri pour compter approximativement
      const constraints: QueryConstraint[] = [];
      if (filterField && filterOperator && filterValue !== undefined) {
        constraints.push(where(filterField, filterOperator, filterValue));
      }
      
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      setTotalItems(querySnapshot.size);
    } catch (err) {
      console.error("Erreur lors de l'estimation du nombre total d'éléments:", err);
    }
  }, [collectionName, filterField, filterOperator, filterValue]);

  // Charger une page spécifique (si possible)
  const goToPage = useCallback(async (page: number): Promise<void> => {
    if (page < 1) {
      return;
    }

    if (page === 1) {
      return loadFirstPage();
    }

    if (page === currentPage + 1 && hasMore) {
      return loadNextPage();
    }

    if (page === currentPage - 1 && hasPrevious) {
      return loadPreviousPage();
    }

    // Si la page demandée est trop éloignée, revenir à la première page et afficher un avertissement
    if (Math.abs(page - currentPage) > 1) {
      console.warn("Navigation directe vers une page non adjacente non supportée. Retour à la première page.");
      return loadFirstPage();
    }
  }, [currentPage, hasMore, hasPrevious, loadFirstPage, loadNextPage, loadPreviousPage]);

  // Rafraîchir les données
  const refresh = useCallback(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // Charger les données initiales
  useEffect(() => {
    if (enabled) {
      loadFirstPage();
      estimateTotalItems();
    }
  }, [enabled, loadFirstPage, estimateTotalItems]);

  // Charger à nouveau les données si les paramètres de filtre changent
  useEffect(() => {
    if (enabled && !isRefreshing) {
      loadFirstPage();
      estimateTotalItems();
    }
  }, [filterField, filterOperator, filterValue, orderByField, orderDirection, pageSize, enabled, loadFirstPage, estimateTotalItems, isRefreshing]);

  return {
    // États
    data,
    status,
    error,
    currentPage,
    totalItems,
    hasMore,
    hasPrevious,
    isLoading: status === "loading",
    isEmpty: status === "empty",
    isError: status === "error",
    
    // Pagination
    loadNextPage,
    loadPreviousPage,
    loadFirstPage,
    goToPage,
    refresh,
    
    // Métadonnées
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
  };
} 