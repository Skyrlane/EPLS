export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-40 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-64 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Image */}
            <div className="w-full h-80 bg-slate-200 rounded-lg mb-8"></div>

            {/* Contenu */}
            <div className="space-y-6">
              <div className="h-8 w-64 bg-slate-200 rounded mb-6"></div>
              
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>

              {/* Valeurs */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 mt-8">
                  <div className="h-6 w-48 bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                    <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                    <div className="h-4 w-3/6 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg shadow-md p-6">
                <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-4/5 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
              </div>
              
              <div className="bg-card rounded-lg shadow-md p-6">
                <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-4/5 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-36 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 