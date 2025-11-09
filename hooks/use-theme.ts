"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface UseThemeReturn {
  theme: ThemeMode | undefined;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  mounted: boolean;
  resolvedTheme: string | undefined;
}

/**
 * Hook personnalisé pour gérer le thème de l'application
 * Gère les problèmes d'hydratation côté serveur et simplifie l'API
 */
export function useTheme(): UseThemeReturn {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  
  // Gérer le montage pour éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Déterminer si le thème actuel est sombre
  const isDark = mounted && (resolvedTheme === "dark" || (theme === "system" && resolvedTheme === "dark"));
  
  // Déterminer si le thème actuel est clair
  const isLight = mounted && (resolvedTheme === "light" || (theme === "system" && resolvedTheme === "light"));
  
  // Fonction pour basculer entre les thèmes clair et sombre
  const toggleTheme = () => {
    if (!mounted) return;
    
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  
  return {
    theme: mounted ? (theme as ThemeMode) : undefined,
    setTheme: (theme: ThemeMode) => setTheme(theme),
    isDark,
    isLight,
    toggleTheme,
    mounted,
    resolvedTheme,
  };
} 