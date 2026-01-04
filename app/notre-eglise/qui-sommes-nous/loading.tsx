export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-80 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Image Placeholder */}
            <div className="w-full h-80 mb-8 bg-slate-200 rounded-lg"></div>

            {/* Text Content Placeholders */}
            <div className="space-y-6">
              <div className="h-8 w-96 bg-slate-200 rounded mb-6"></div>
              
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              </div>

              <div>
                <div className="h-6 w-72 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                </div>
                
                <div className="ml-6 mt-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-5/6 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-6 w-72 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                </div>
                
                <div className="ml-6 mt-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 w-5/6 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-6 w-72 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                </div>
                
                <div className="ml-6 mt-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 w-5/6 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards Placeholders */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="h-6 w-40 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-4 w-full bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}