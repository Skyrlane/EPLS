'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Planning } from '@/types';

interface ProtectedPlanningWrapperProps {
  planning: Planning | null;
  children: React.ReactNode;
}

const CACHE_KEY = 'epls_planning_cache';
const CACHE_TIMESTAMP_KEY = 'epls_planning_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

/**
 * Wrapper client pour gérer l'authentification et le cache localStorage
 * Les données sont déjà pré-fetchées côté serveur
 */
export function ProtectedPlanningWrapper({
  planning,
  children
}: ProtectedPlanningWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Sauvegarder le planning dans localStorage pour cache offline
  useEffect(() => {
    if (planning && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(planning));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du cache:', error);
      }
    }
  }, [planning]);

  // Redirect si non authentifié
  useEffect(() => {
    if (!loading && !user) {
      router.push('/connexion?redirect=/infos-docs/planning-cultes');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Vérification...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié (ne devrait jamais arriver grâce au useEffect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
