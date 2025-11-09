"use client";

import React from "react";
import { CalendarIcon, MapPinIcon, Clock10Icon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useServiceInfo } from "@/lib/providers/service-info-provider";

interface FixedServiceInfoProps {
  day?: string;
  time?: string;
  location?: string;
  address?: string;
  postalCode?: string;
  city?: string;
}

export function FixedServiceInfo({
  day,
  time,
  location,
  address,
  postalCode,
  city,
}: FixedServiceInfoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Utilise les valeurs du contexte si aucune prop n'est fournie
  const serviceInfoContext = useServiceInfo();
  
  const serviceDay = day || serviceInfoContext.day;
  const serviceTime = time || serviceInfoContext.time;
  const serviceLocation = location || serviceInfoContext.location;
  const serviceAddress = address || serviceInfoContext.address;
  const servicePostalCode = postalCode || serviceInfoContext.postalCode;
  const serviceCity = city || serviceInfoContext.city;

  // Vérifie si l'utilisateur a déjà fermé l'info
  useEffect(() => {
    const dismissed = localStorage.getItem('serviceInfoDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('serviceInfoDismissed', 'true');
  };

  // Ne rien afficher si déjà fermé
  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
        <div className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-semibold mb-2">Culte {serviceDay} à {serviceTime}</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CalendarIcon className="h-4 w-4 mt-1 text-primary" />
              <div className="text-sm">
                <p className="text-foreground dark:text-gray-200">{serviceDay}</p>
                <div className="flex items-center text-muted-foreground dark:text-gray-300">
                  <Clock10Icon className="mr-1 h-3 w-3" />
                  {serviceTime}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-4 w-4 mt-1 text-primary" />
              <div className="text-sm">
                <p className="text-foreground dark:text-gray-200">{serviceLocation}</p>
                <p className="text-muted-foreground dark:text-gray-300">{serviceAddress}</p>
                <p className="text-muted-foreground dark:text-gray-300">{servicePostalCode} {serviceCity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 