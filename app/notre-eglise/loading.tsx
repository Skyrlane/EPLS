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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Placeholder */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <div className="h-6 w-36 bg-slate-200 rounded"></div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 w-full bg-slate-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-card rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="h-6 w-40 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded mt-2"></div>
                    <div className="h-4 w-40 bg-slate-200 rounded mt-1"></div>
                    <div className="h-10 w-full bg-slate-200 rounded-md mt-4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Placeholder */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                </div>
                <div className="p-6">
                  <div className="w-full h-64 bg-slate-200 rounded-md mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                      <div className="h-6 w-40 bg-slate-200 rounded"></div>
                    </div>
                    <div className="p-6">
                      <div className="h-16 w-full bg-slate-200 rounded"></div>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="h-10 w-full bg-slate-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 