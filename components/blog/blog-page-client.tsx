"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleFilterClient } from "@/components/blog/article-filter-client";
import { PaginationClient } from "@/components/blog/pagination-client";
import { ArticleCardClient } from "@/components/blog/article-card-client";
import { FeaturedArticleClient } from "@/components/blog/featured-article-client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { articles, Article } from "@/lib/blog-data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// Extraire les catégories uniques
const uniqueCategories = Array.from(new Set(articles.map(article => article.category)));

// Fonction pour filtrer et paginer les articles
function filterAndPaginateArticles(
  allArticles: Article[],
  search?: string,
  category?: string,
  page: number = 1,
  articlesPerPage: number = 6
): { filteredArticles: Article[], totalPages: number } {
  // Étape 1: Filtrer les articles
  let filtered = [...allArticles];
  
  // Filtrer par recherche
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower)
    );
  }
  
  // Filtrer par catégorie
  if (category) {
    filtered = filtered.filter(article => article.category === category);
  }
  
  // Étape 2: Calculer la pagination
  const totalPages = Math.ceil(filtered.length / articlesPerPage);
  const startIndex = (page - 1) * articlesPerPage;
  const paginatedArticles = filtered.slice(startIndex, startIndex + articlesPerPage);
  
  return {
    filteredArticles: paginatedArticles,
    totalPages
  };
}

export function BlogPageClient() {
  const searchParams = useSearchParams();
  
  // État local pour les paramètres de recherche
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [pageNum, setPageNum] = useState<number>(1);
  
  // Mettre à jour les paramètres d'après l'URL
  useEffect(() => {
    setSearch(searchParams.get("search") || undefined);
    setCategory(searchParams.get("category") || undefined);
    setPageNum(searchParams.get("page") ? parseInt(searchParams.get("page") || "1") : 1);
  }, [searchParams]);
  
  // Extraire l'article à la une
  const featuredArticle = articles.find((article) => article.featured);
  
  // Filtrer et paginer les articles (exclure l'article à la une)
  const regularArticles = articles.filter((article) => !article.featured);
  const { filteredArticles, totalPages } = filterAndPaginateArticles(
    regularArticles,
    search,
    category,
    pageNum
  );

  // Variable pour suivre si des filtres sont actifs
  const isFiltering = search || category;

  return (
    <>
      {/* Page Header */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>

          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: "Blog", href: "/blog", isCurrent: true }
            ]} 
          />
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search and Categories */}
            <ArticleFilterClient categories={uniqueCategories} />

            {/* Featured Article - Only shown when not filtering */}
            {!isFiltering && featuredArticle && (
              <div className="mb-12">
                <FeaturedArticleClient
                  title={featuredArticle.title}
                  slug={featuredArticle.slug}
                  excerpt={featuredArticle.excerpt}
                  author={featuredArticle.author}
                  date={featuredArticle.date}
                  image={featuredArticle.image || "/placeholder.svg"}
                  category={featuredArticle.category}
                />
              </div>
            )}

            {/* Aucun résultat */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Aucun article trouvé</h3>
                <p className="text-muted-foreground mb-4">Essayez d'autres critères de recherche</p>
                <Link href="/blog" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Afficher tous les articles
                </Link>
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCardClient
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    author={article.author}
                    date={article.date}
                    image={article.image || "/placeholder.svg"}
                    category={article.category}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredArticles.length > 0 && totalPages > 1 && (
              <PaginationClient currentPage={pageNum} totalPages={totalPages} />
            )}
          </div>
        </div>
      </section>
    </>
  );
} 