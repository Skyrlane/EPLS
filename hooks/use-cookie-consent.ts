"use client";

import { useState, useEffect } from "react";

/**
 * Hook pour gérer le consentement aux cookies
 * @returns Un objet contenant l'état de consentement et une fonction pour l'accepter
 */
export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Vérifier si le consentement existe déjà dans localStorage
  useEffect(() => {
    // Éviter d'exécuter pendant SSR
    if (typeof window !== "undefined") {
      const storedConsent = localStorage.getItem("cookie-consent");
      setHasConsented(storedConsent === "true");
      setIsLoaded(true);
    }
  }, []);

  // Fonction pour accepter les cookies
  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setHasConsented(true);
  };

  return {
    hasConsented,
    acceptCookies,
    isLoaded
  };
} 