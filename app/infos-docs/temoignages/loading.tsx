export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-60 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Titre principal */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="h-8 w-3/4 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-5 w-full md:w-3/4 bg-slate-200 rounded mx-auto"></div>
          </div>

          {/* Grille de témoignages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-slate-200 rounded-full"></div>
                  <div>
                    <div className="h-5 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="flex-grow pt-2">
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Section finale */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-5 w-full bg-slate-200 rounded mx-auto mb-2"></div>
            <div className="h-5 w-4/5 bg-slate-200 rounded mx-auto mb-6"></div>
            <div className="h-10 w-32 bg-slate-200 rounded mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Citation biblique */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="h-12 w-12 bg-white/20 rounded-full mx-auto mb-6"></div>
            <div className="h-6 w-3/4 bg-white/20 rounded mx-auto mb-2"></div>
            <div className="h-6 w-2/3 bg-white/20 rounded mx-auto mb-6"></div>
            <div className="h-5 w-32 bg-white/20 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    </div>
  )
} 