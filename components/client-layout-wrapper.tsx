'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { SkipToContent } from "@/components/skip-to-content";
import Navigation from "@/components/navigation";
import { ServiceInfoProvider } from "@/lib/providers/service-info-provider";
import { FixedServiceInfo } from "@/components/home/fixed-service-info";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ErrorBoundary } from "@/components/error-boundary";

interface ClientLayoutWrapperProps {
  children: ReactNode;
  showFixedServiceInfo?: boolean;
}

export function ClientLayoutWrapper({ children, showFixedServiceInfo = false }: ClientLayoutWrapperProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <ServiceInfoProvider>
            <SkipToContent />
            <Navigation />
            <main id="content" className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <Toaster />
            {showFixedServiceInfo && <FixedServiceInfo />}
            <CookieBanner />
          </ServiceInfoProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
