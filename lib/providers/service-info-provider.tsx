"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface ServiceInfoContextType {
  day: string;
  time: string;
  location: string;
  address: string;
  postalCode: string;
  city: string;
}

// Valeurs par défaut pour les informations de culte
const defaultServiceInfo: ServiceInfoContextType = {
  day: "le dimanche",
  time: "10h",
  location: "À l'église Saint Marc",
  address: "18 rue de Franche-Comté",
  postalCode: "67380",
  city: "Lingolsheim",
};

const ServiceInfoContext = createContext<ServiceInfoContextType>(defaultServiceInfo);

interface ServiceInfoProviderProps {
  children: ReactNode;
  customServiceInfo?: Partial<ServiceInfoContextType>;
}

export function ServiceInfoProvider({ 
  children, 
  customServiceInfo 
}: ServiceInfoProviderProps) {
  // Combine les informations par défaut avec les informations personnalisées si fournies
  const serviceInfo = {
    ...defaultServiceInfo,
    ...customServiceInfo,
  };

  return (
    <ServiceInfoContext.Provider value={serviceInfo}>
      {children}
    </ServiceInfoContext.Provider>
  );
}

export function useServiceInfo() {
  return useContext(ServiceInfoContext);
} 