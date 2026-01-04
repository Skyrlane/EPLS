export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-60 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Titre principal */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="h-8 w-72 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-5 w-full md:w-3/4 bg-slate-200 rounded mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            {/* Pourquoi soutenir */}
            <div className="rounded-lg bg-card shadow-md p-6 mb-8">
              <div className="h-7 w-48 bg-slate-200 rounded mb-6"></div>
              <div className="h-5 w-full bg-slate-200 rounded mb-3"></div>
              <div className="h-5 w-full bg-slate-200 rounded mb-3"></div>
              <div className="h-5 w-4/5 bg-slate-200 rounded mb-6"></div>
              
              <div className="space-y-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 w-full bg-slate-200 rounded"></div>
                ))}
              </div>
              
              <div className="h-5 w-full bg-slate-200 rounded"></div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-200 rounded"></div>
                ))}
              </div>
              
              <div className="rounded-lg bg-card shadow-md p-6">
                <div className="h-7 w-56 bg-slate-200 rounded mb-2"></div>
                <div className="h-5 w-64 bg-slate-200 rounded mb-6"></div>
                <div className="h-5 w-full bg-slate-200 rounded mb-4"></div>
                <div className="bg-muted p-4 rounded-md mb-4">
                  <div className="h-5 w-64 bg-slate-200 rounded mb-2"></div>
                  <div className="h-5 w-56 bg-slate-200 rounded mb-2"></div>
                  <div className="h-5 w-40 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              </div>
            </div>

            {/* Déduction fiscale */}
            <div className="rounded-lg bg-card shadow-md p-6 mb-8">
              <div className="h-7 w-40 bg-slate-200 rounded mb-6"></div>
              <div className="h-5 w-full bg-slate-200 rounded mb-3"></div>
              <div className="h-5 w-full bg-slate-200 rounded mb-3"></div>
              <div className="h-5 w-4/5 bg-slate-200 rounded mb-3"></div>
              <div className="h-4 w-full bg-slate-200 rounded"></div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-5 w-96 bg-slate-200 rounded mx-auto mb-6"></div>
            <div className="h-10 w-32 bg-slate-200 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    </div>
  )
} 