"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * Fournisseur de thème avec transitions fluides entre les modes clair et sombre
 * Compatible avec les préférences système et les choix utilisateur
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Évite le problème d'hydratation
  React.useEffect(() => {
    setMounted(true);
    // Ajoute une classe pour les transitions fluides après le chargement initial
    document.documentElement.classList.add("theme-transition");
  }, []);

  if (!mounted) {
    // Masque les éléments jusqu'à ce que le thème soit correctement détecté
    return (
      <div style={{ visibility: "hidden" }}>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
      </div>
    );
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 