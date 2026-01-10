import { BlogPageClient } from "@/components/blog/blog-page-client";
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

// Forcer le rendu dynamique (pas de pré-génération statique)
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalider toutes les 60 secondes

export const metadata = {
  title: "Blog - Église Protestante Libre de Strasbourg",
  description: "Actualités et articles de l'Église Protestante Libre de Strasbourg",
};

export default async function Blog() {
  // Charger les articles depuis Firestore (côté serveur)
  const { collection: firestoreCollection, getDocs, query: firestoreQuery, where, orderBy: firestoreOrderBy } = await import('firebase/firestore');
  const { firestore } = await import('@/lib/firebase');
  
  const articlesRef = firestoreCollection(firestore, 'articles');
  const q = firestoreQuery(
    articlesRef,
    where('status', '==', 'published'),
    where('isActive', '==', true),
    firestoreOrderBy('publishedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const articles = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      publishedAt: data.publishedAt?.toDate().toISOString(),
      scheduledFor: data.scheduledFor?.toDate().toISOString(),
    };
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Blog", href: "/blog", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Blog"
        description="Découvrez nos articles, réflexions et témoignages sur la foi, la grâce et l'amour de Dieu"
        breadcrumbs={breadcrumbItems}
      />

      <div className="container py-12 max-w-7xl">
        <BlogArticlesGrid articles={articles} />
      </div>
    </>
  );
}

// Composant client pour la grid avec filtres
import { BlogArticlesGrid } from '@/components/blog/BlogArticlesGrid'; 