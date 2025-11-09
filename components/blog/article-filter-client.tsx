"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ArticleFilterClientProps {
  categories: string[];
}

export function ArticleFilterClient({ categories }: ArticleFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const currentCategory = searchParams.get("category") || "Tous";

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === "Tous") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    if (currentCategory !== "Tous") {
      params.set("category", currentCategory);
    }
    
    router.push(`/blog?${params.toString()}`);
  };

  const getButtonClasses = (category: string) => {
    const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none cursor-pointer";
    
    if ((category === "Tous" && currentCategory === "Tous") || 
        (category !== "Tous" && currentCategory === category)) {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/80`;
    }
    
    return `${baseClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
      <div className="flex-1 w-full md:max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            type="search" 
            placeholder="Rechercher un article..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-2">
        <button 
          type="button"
          className={getButtonClasses("Tous")}
          onClick={() => handleCategoryClick("Tous")}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button 
            key={category} 
            type="button"
            className={getButtonClasses(category)}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
} 