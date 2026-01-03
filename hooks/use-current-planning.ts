"use client";

import { useState, useEffect } from "react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { Planning } from "@/types";

/**
 * Hook pour récupérer le planning du mois en cours
 * Optimisé : utilise getDocs (lecture unique) au lieu de onSnapshot (temps réel)
 */
export function useCurrentPlanning() {
  const [planning, setPlanning] = useState<Planning | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        setLoading(true);
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const q = query(
          collection(firestore, "plannings"),
          where("month", "==", currentMonth),
          where("year", "==", currentYear),
          where("isActive", "==", true),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPlanning({ id: doc.id, ...doc.data() } as Planning);
        } else {
          setPlanning(null);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du planning:", err);
        setError(err instanceof Error ? err : new Error("Erreur inconnue"));
      } finally {
        setLoading(false);
      }
    };

    fetchPlanning();
  }, []); // Pas de dépendances : charge une seule fois au mount

  return {
    planning,
    loading,
    error,
  };
}
