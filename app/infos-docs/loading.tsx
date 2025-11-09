export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-40 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b">
                    <div className="h-6 w-28 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="h-5 w-full bg-slate-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b">
                    <div className="h-7 w-72 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-6 w-full bg-slate-200 rounded mb-8"></div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg shadow-sm">
                          <div className="p-4 border-b">
                            <div className="h-6 w-32 bg-slate-200 rounded"></div>
                          </div>
                          <div className="p-4">
                            <div className="h-4 w-full bg-slate-200 rounded mb-3"></div>
                            <div className="h-4 w-28 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Union card */}
                    <div className="bg-slate-50 rounded-lg shadow-sm">
                      <div className="p-4 border-b">
                        <div className="h-6 w-64 bg-slate-200 rounded"></div>
                      </div>
                      <div className="p-4">
                        <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-slate-200 rounded mb-3"></div>
                        <div className="h-4 w-40 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 