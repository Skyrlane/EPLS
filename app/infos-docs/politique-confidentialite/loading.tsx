export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-72 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-60 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg bg-white shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b">
                <div className="h-7 w-64 bg-slate-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="h-5 w-full bg-slate-200 rounded"></div>
                  
                  {/* Sections - répétition de modèles de chargement */}
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="h-7 w-56 bg-slate-200 rounded"></div>
                      <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                      <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-5 w-full bg-slate-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Section Contact */}
                  <div className="space-y-4">
                    <div className="h-7 w-32 bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-4/5 bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-3/5 bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-2/5 bg-slate-200 rounded"></div>
                  </div>
                  
                  {/* Date mise à jour */}
                  <div className="h-5 w-48 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 