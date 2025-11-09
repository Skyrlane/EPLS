import { Skeleton } from "@/components/ui/skeleton";

export default function ConfessionFoiLoading() {
  return (
    <>
      {/* Page Header Skeleton */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-5 w-96 mb-2" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border rounded-lg p-6 mb-8">
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-8" />

              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-8" />
              
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-1/2 mb-8" />
              
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-8" />
              
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-1/2 mb-8" />
              
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            
            <div className="flex justify-center">
              <Skeleton className="h-10 w-56" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 