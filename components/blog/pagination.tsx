"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-12">
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        <Button 
          variant="outline" 
          className="rounded-l-md"
          disabled={currentPage <= 1}
          onClick={() => navigateToPage(currentPage - 1)}
        >
          Précédent
        </Button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <Button
              key={pageNumber}
              variant="outline"
              className={`rounded-none border-l-0 ${
                pageNumber === currentPage
                  ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                  : ""
              }`}
              onClick={() => navigateToPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        
        <Button 
          variant="outline" 
          className="rounded-r-md border-l-0"
          disabled={currentPage >= totalPages}
          onClick={() => navigateToPage(currentPage + 1)}
        >
          Suivant
        </Button>
      </nav>
    </div>
  );
} 