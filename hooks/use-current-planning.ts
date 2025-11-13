"use client";

import { where, limit } from "firebase/firestore";
import { useRealtimeCollection } from "./use-realtime-collection";
import type { Planning } from "@/types";

/**
 * Hook pour récupérer le planning du mois en cours
 */
export function useCurrentPlanning() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data, loading, error } = useRealtimeCollection<Planning>({
    collectionName: "plannings",
    queryConstraints: [
      where("month", "==", currentMonth),
      where("year", "==", currentYear),
      where("isActive", "==", true),
      limit(1),
    ],
  });

  return {
    planning: data && data.length > 0 ? data[0] : null,
    loading,
    error,
  };
}
