export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-slate-200 rounded mb-4"></div>
          <div className="h-5 w-60 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Carte d'accès réservé */}
            <div className="rounded-lg bg-white shadow-md p-6 mb-8">
              <div className="h-7 w-40 bg-slate-200 rounded mb-4"></div>
              <div className="h-5 w-full bg-slate-200 rounded mb-4"></div>
              <div className="flex justify-center">
                <div className="h-10 w-32 bg-slate-200 rounded"></div>
              </div>
            </div>

            {/* Titre conseil d'église */}
            <div className="h-8 w-56 bg-slate-200 rounded mb-4"></div>
            <div className="h-5 w-full bg-slate-200 rounded mb-8"></div>

            {/* Membres du conseil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg bg-white shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-slate-200 mb-4"></div>
                    <div className="h-6 w-40 bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded mb-1"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded mb-1"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Titre responsables ministères */}
            <div className="h-8 w-80 bg-slate-200 rounded mb-4"></div>
            <div className="h-5 w-full bg-slate-200 rounded mb-8"></div>

            {/* Responsables ministères */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg bg-white shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-slate-200 mb-3"></div>
                    <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-28 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section devenir membre */}
            <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-5 w-full bg-slate-200 rounded mb-3"></div>
            <div className="space-y-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 w-full bg-slate-200 rounded"></div>
              ))}
            </div>

            {/* Carte contact */}
            <div className="rounded-lg bg-white shadow-md p-6">
              <div className="h-7 w-32 bg-slate-200 rounded mb-4"></div>
              <div className="h-5 w-full bg-slate-200 rounded mb-4"></div>
              <div className="flex justify-center">
                <div className="h-10 w-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 