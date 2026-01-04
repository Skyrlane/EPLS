export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full sm:w-auto">
                <div className="h-5 w-28 bg-slate-200 rounded mb-1"></div>
                <div className="h-10 w-full sm:w-[180px] bg-slate-200 rounded"></div>
              </div>
            ))}
            <div className="w-full sm:w-auto ml-auto">
              <div className="h-5 w-28 bg-slate-200 rounded mb-1"></div>
              <div className="h-10 w-full sm:w-[180px] bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="overflow-hidden bg-card rounded-lg shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-slate-200 h-48 md:h-auto"></div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-6 w-24 bg-slate-200 rounded"></div>
                      <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-7 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                      <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-40 bg-slate-200 rounded"></div>
                      <div className="h-4 w-16 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <div className="h-10 w-24 bg-slate-200 rounded-l-md"></div>
              <div className="h-10 w-10 bg-slate-300 rounded-none"></div>
              <div className="h-10 w-10 bg-slate-200 rounded-none"></div>
              <div className="h-10 w-10 bg-slate-200 rounded-none"></div>
              <div className="h-10 w-24 bg-slate-200 rounded-r-md"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 