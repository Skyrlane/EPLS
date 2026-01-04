import { Loader2 } from "lucide-react";

// Skeleton pour la page d'accueil
function HomePageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-muted/50">
        <div className="container mx-auto px-4 pt-32 text-center">
          <div className="h-16 bg-slate-200 max-w-3xl mx-auto rounded-md mb-8"></div>
          <div className="h-8 bg-slate-200 max-w-2xl mx-auto rounded-md mb-8"></div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="h-12 w-48 bg-slate-200 rounded-md"></div>
            <div className="h-12 w-48 bg-slate-200 rounded-md"></div>
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted w-64 mx-auto rounded-md mb-4"></div>
            <div className="h-6 bg-muted w-96 mx-auto rounded-md"></div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="h-64 bg-muted rounded-l"></div>
                <div className="p-6">
                  <div className="h-8 bg-muted w-2/3 rounded-md mb-4"></div>
                  <div className="h-4 bg-muted w-1/2 rounded-md mb-4"></div>
                  <div className="h-4 bg-muted w-1/3 rounded-md mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted w-full rounded-md"></div>
                    <div className="h-4 bg-muted w-full rounded-md"></div>
                    <div className="h-4 bg-muted w-2/3 rounded-md"></div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <div className="h-10 bg-muted w-full rounded-md"></div>
                    <div className="h-10 bg-muted w-full rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prochains événements */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted w-64 mx-auto rounded-md mb-4"></div>
            <div className="h-6 bg-muted w-96 mx-auto rounded-md"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-sm p-6">
                <div className="h-6 bg-muted w-3/4 rounded-md mb-3"></div>
                <div className="h-4 bg-muted w-1/2 rounded-md mb-3"></div>
                <div className="h-4 bg-muted w-full rounded-md mb-3"></div>
                <div className="h-4 bg-muted w-5/6 rounded-md mb-6"></div>
                <div className="h-10 bg-muted w-full rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Composant de chargement principal
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Overlay initial de chargement */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="relative h-20 w-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
          <span className="text-xl font-bold text-primary">EPLS</span>
        </div>
        <div className="flex items-center mt-6 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p>Chargement...</p>
        </div>
      </div>
      
      {/* Squelette de la page en arrière-plan */}
      <div className="opacity-60">
        <HomePageSkeleton />
      </div>
    </div>
  );
} 