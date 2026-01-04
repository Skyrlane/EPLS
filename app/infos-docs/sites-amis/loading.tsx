export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
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
            <div className="h-8 w-60 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-5 w-full md:w-3/4 bg-slate-200 rounded mx-auto"></div>
          </div>

          {/* Grille de cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-md p-6 flex flex-col">
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-6 w-4/5 bg-slate-200 rounded mx-auto mb-2"></div>
                <div className="h-4 w-2/5 bg-slate-200 rounded mx-auto mb-4"></div>
                <div className="flex-grow">
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-4/5 bg-slate-200 rounded mb-6"></div>
                </div>
                <div className="h-10 w-full bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Section finale */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <div className="h-8 w-80 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-5 w-full bg-slate-200 rounded mx-auto mb-2"></div>
            <div className="h-5 w-4/5 bg-slate-200 rounded mx-auto mb-6"></div>
            <div className="h-10 w-32 bg-slate-200 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    </div>
  )
} 