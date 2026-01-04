export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-3/4 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-60 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Présentation */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="md:w-1/3">
                <div className="w-64 h-64 mx-auto bg-slate-200 rounded"></div>
              </div>
              <div className="md:w-2/3">
                <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
                <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
              </div>
            </div>

            {/* Première card */}
            <div className="bg-card rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b">
                <div className="h-7 w-48 bg-slate-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="h-5 w-full bg-slate-200 rounded"></div>
                  
                  {/* Section identité */}
                  <div className="space-y-4 mt-6">
                    <div className="h-6 w-64 bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-1"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-1"></div>
                    <div className="h-5 w-4/5 bg-slate-200 rounded"></div>
                  </div>
                  
                  {/* Section ecclésiologie */}
                  <div className="space-y-4 mt-6">
                    <div className="h-6 w-72 bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex">
                          <div className="h-5 w-5 bg-slate-200 rounded-full mr-2"></div>
                          <div className="h-5 w-full bg-slate-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div className="h-64 w-full bg-slate-200 rounded my-8"></div>
                  
                  {/* Section organisation */}
                  <div className="space-y-4">
                    <div className="h-6 w-72 bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex">
                          <div className="h-5 w-5 bg-slate-200 rounded-full mr-2"></div>
                          <div className="h-5 w-full bg-slate-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Deuxième card */}
            <div className="bg-card rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b">
                <div className="h-7 w-64 bg-slate-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Section engagements */}
                  <div className="space-y-4">
                    <div className="h-6 w-40 bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex">
                          <div className="h-5 w-5 bg-slate-200 rounded-full mr-2"></div>
                          <div className="h-5 w-full bg-slate-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Section partenariats */}
                  <div className="space-y-4 mt-6">
                    <div className="h-6 w-48 bg-slate-200 rounded"></div>
                    <div className="h-5 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex">
                          <div className="h-5 w-5 bg-slate-200 rounded-full mr-2"></div>
                          <div className="h-5 w-full bg-slate-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="h-12 w-64 bg-slate-200 rounded"></div>
              <div className="h-12 w-64 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 