"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserIcon, Loader2Icon } from "lucide-react";

export function FirebaseStatus() {
  const { user, isLoading, isConfigured } = useAuth();
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");

  useEffect(() => {
    // Si Firebase n'est pas configuré, on ne devrait pas rester en état de chargement
    if (!isConfigured) {
      setStatus("disconnected");
      return;
    }
    
    // Définir un timeout pour éviter une animation infinie
    const timer = setTimeout(() => {
      if (status === "loading") {
        setStatus("disconnected");
      }
    }, 5000); // 5 secondes maximum pour le chargement
    
    // Mise à jour normale du statut
    if (!isLoading) {
      setStatus(user ? "connected" : "disconnected");
    }
    
    return () => clearTimeout(timer);
  }, [user, isLoading, isConfigured, status]);

  const statusConfig = {
    loading: {
      color: "bg-yellow-500",
      label: "Connexion en cours...",
      icon: Loader2Icon,
      className: "animate-spin",
    },
    connected: {
      color: "bg-green-500",
      label: `Connecté: ${user?.displayName || user?.email || ""}`,
      icon: UserIcon,
      className: "",
    },
    disconnected: {
      color: "bg-gray-400",
      label: "Non connecté",
      icon: UserIcon,
      className: "opacity-50",
    },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 shadow-md backdrop-blur transition-all hover:bg-background/90 border border-border/50"
            role="status"
            aria-live="polite"
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${statusConfig[status].color}`}
              aria-hidden="true"
            />
            <StatusIcon 
              className={cn("h-4 w-4", statusConfig[status].className)} 
              aria-hidden="true" 
            />
            <span className="text-xs font-medium sr-only md:not-sr-only">
              {statusConfig[status].label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{statusConfig[status].label}</p>
          {status === "connected" && user?.email && (
            <p className="text-xs text-muted-foreground">{user.email}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 