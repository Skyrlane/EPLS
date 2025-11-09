"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ArticleFilterProps {
  categories: string[];
}

export function ArticleFilter({ categories }: ArticleFilterProps) {
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
        <Badge 
          variant={currentCategory === "Tous" ? "secondary" : "outline"} 
          className="cursor-pointer"
          onClick={() => handleCategoryClick("Tous")}
        >
          Tous
        </Badge>
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={currentCategory === category ? "secondary" : "outline"} 
            className="cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
} 