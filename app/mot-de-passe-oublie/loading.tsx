export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="h-7 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-slate-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-5 w-16 bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="p-6 border-t">
                <div className="h-5 w-48 bg-slate-200 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 