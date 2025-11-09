"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationClientProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationClient({ totalPages, currentPage }: PaginationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const buttonBaseClass = "px-4 py-2 text-sm font-medium border border-gray-300 bg-white";
  const activeButtonClass = "px-4 py-2 text-sm font-medium border border-gray-300 bg-primary text-white";
  const disabledButtonClass = "px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-400 cursor-not-allowed";

  return (
    <div className="flex justify-center mt-12">
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        <button
          className={`${buttonBaseClass} rounded-l-md ${currentPage <= 1 ? disabledButtonClass : "hover:bg-gray-100"}`}
          disabled={currentPage <= 1}
          onClick={() => navigateToPage(currentPage - 1)}
        >
          Précédent
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              className={`${pageNumber === currentPage ? activeButtonClass : buttonBaseClass} rounded-none border-l-0`}
              onClick={() => navigateToPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        
        <button
          className={`${buttonBaseClass} rounded-r-md border-l-0 ${currentPage >= totalPages ? disabledButtonClass : "hover:bg-gray-100"}`}
          disabled={currentPage >= totalPages}
          onClick={() => navigateToPage(currentPage + 1)}
        >
          Suivant
        </button>
      </nav>
    </div>
  );
} 