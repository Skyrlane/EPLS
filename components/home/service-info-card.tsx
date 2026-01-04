"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon, CalendarIcon, Clock10Icon } from "lucide-react";
import { useServiceInfo } from "@/lib/providers/service-info-provider";

interface ServiceInfoProps {
  day?: string;
  time?: string;
  location?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  className?: string;
}

export function ServiceInfoCard({
  day,
  time,
  location,
  address,
  postalCode,
  city,
  className,
}: ServiceInfoProps) {
  // Utilise les valeurs du contexte si aucune prop n'est fournie
  const serviceInfoContext = useServiceInfo();

  const serviceDay = day || serviceInfoContext.day;
  const serviceTime = time || serviceInfoContext.time;
  const serviceLocation = location || serviceInfoContext.location;
  const serviceAddress = address || serviceInfoContext.address;
  const servicePostalCode = postalCode || serviceInfoContext.postalCode;
  const serviceCity = city || serviceInfoContext.city;

  return (
    <Card className={`overflow-hidden backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Culte {serviceDay} a {serviceTime}</h3>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-4 w-4 mt-1 text-primary" />
            <div className="text-sm">
              <p className="text-foreground">{serviceDay}</p>
              <div className="flex items-center text-muted-foreground">
                <Clock10Icon className="mr-1 h-3 w-3" />
                {serviceTime}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 mt-1 text-primary" />
            <div className="text-sm">
              <p className="text-foreground">{serviceLocation}</p>
              <p className="text-muted-foreground">{serviceAddress}</p>
              <p className="text-muted-foreground">{servicePostalCode} {serviceCity}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
