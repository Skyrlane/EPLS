export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-80 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map Card */}
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="h-7 w-40 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    {/* Map Placeholder */}
                    <div className="aspect-square w-full bg-slate-200 rounded-md mb-6"></div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="h-5 w-5 bg-slate-200 rounded mt-0.5"></div>
                          <div className="space-y-2">
                            <div className="h-5 w-24 bg-slate-200 rounded"></div>
                            <div className="h-4 w-40 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Information */}
              <div className="space-y-6">
                {/* Access Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="h-7 w-56 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-6 w-48 bg-slate-200 rounded"></div>
                          <div className="ml-7 space-y-2">
                            <div className="h-4 w-full bg-slate-200 rounded"></div>
                            <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Building Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="h-7 w-40 bg-slate-200 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-48 w-full bg-slate-200 rounded-md mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                      <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Card */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <div className="h-7 w-44 bg-slate-200 rounded"></div>
                </div>
                <div className="p-6">
                  <div className="h-4 w-full bg-slate-200 rounded mb-6"></div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-lg">
                        <div className="h-5 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-5/6 bg-slate-200 rounded mt-1"></div>
                      </div>
                    ))}
                  </div>

                  <div className="h-5 w-64 bg-slate-200 rounded mx-auto mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 