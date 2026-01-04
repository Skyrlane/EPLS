export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-10 w-56 bg-slate-200 rounded mb-4"></div>
              <div className="h-5 w-32 bg-slate-200 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Carte de bienvenue */}
          <div className="mb-8">
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="h-7 w-72 bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-slate-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="h-5 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-2 mb-8">
              <div className="h-10 bg-slate-200 rounded flex items-center justify-center">
                <div className="h-4 w-24 bg-slate-300 rounded"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded flex items-center justify-center">
                <div className="h-4 w-24 bg-slate-300 rounded"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded flex items-center justify-center">
                <div className="h-4 w-24 bg-slate-300 rounded"></div>
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="h-7 w-64 bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-full md:w-2/3 bg-slate-200 rounded"></div>
              </div>
              <div className="p-6">
                {/* Champ de recherche */}
                <div className="mb-6">
                  <div className="h-5 w-40 bg-slate-200 rounded mb-2"></div>
                  <div className="h-10 w-full bg-slate-200 rounded"></div>
                </div>

                {/* Table des membres */}
                <div className="overflow-x-auto">
                  <div className="w-full">
                    <div className="h-10 w-full bg-muted rounded mb-2"></div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-14 w-full bg-muted/50 rounded mb-2 border-b border-slate-200"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 