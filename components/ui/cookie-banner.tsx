"use client";

import { useCookieConsent } from "@/lib/hooks/use-cookie-consent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface CookieBannerProps {
  policyLink?: string;
  className?: string;
}

export function CookieBanner({
  policyLink = "/infos-docs/mentions-legales",
  className,
}: CookieBannerProps) {
  const { hasConsented, acceptCookies, isLoaded } = useCookieConsent();

  // Ne rien afficher pendant le chargement initial ou si l'utilisateur a déjà consenti
  if (!isLoaded || hasConsented) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6",
          "bg-background/95 backdrop-blur-sm border-t shadow-lg",
          "dark:bg-background/95",
          className
        )}
      >
        <div className="container flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            En poursuivant votre navigation, vous acceptez l'utilisation de cookies pour améliorer votre expérience.
            {policyLink && (
              <span className="ml-1">
                <a
                  href={policyLink}
                  className="underline underline-offset-4 hover:text-primary font-medium"
                >
                  En savoir plus
                </a>
              </span>
            )}
          </div>
          <Button 
            onClick={acceptCookies}
            className="shrink-0"
            size="sm"
          >
            J'accepte
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 