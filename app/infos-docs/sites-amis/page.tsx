import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchJsonLd } from "@/components/json-ld"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"
import { ExternalLink } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block"

export const metadata: Metadata = {
  title: "Sites amis | Église Protestante Libérale de Strasbourg",
  description: "Découvrez les sites de nos partenaires et d'organisations avec lesquelles nous partageons des valeurs communes.",
  keywords: ["sites amis", "liens", "ressources", "églises", "partenaires", "EPLS", "Église Protestante Libérale", "Strasbourg"]
}

export default async function SitesAmisPage() {
  // Charger les sites actifs depuis Firestore
  let sites: any[] = [];
  try {
    const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore');
    const { firestore } = await import('@/lib/firebase');
    
    const sitesRef = collection(firestore, 'partner_sites');
    const q = query(
      sitesRef,
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    sites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    }));
    
    // Trier par catégorie puis par sortOrder côté client
    sites.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.sortOrder - b.sortOrder;
    });
  } catch (error) {
    console.error('Erreur chargement sites:', error);
  }

  // Grouper par catégorie
  const sitesByCategory = sites.reduce((acc: any, site: any) => {
    if (!acc[site.category]) {
      acc[site.category] = [];
    }
    acc[site.category].push(site);
    return acc;
  }, {} as Record<string, any[]>);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Infos & Docs", href: "/infos-docs" },
    { label: "Sites amis", href: "/infos-docs/sites-amis", isCurrent: true },
  ];

  return (
    <>
      <ChurchJsonLd />
      <PageHeader
        title="Sites amis"
        description="Découvrez les sites de nos partenaires et d'organisations avec lesquelles nous partageons des valeurs communes."
        breadcrumbs={breadcrumbItems}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <Sidebar />
              </div>
              <div className="md:col-span-3">
                <div className="max-w-4xl mx-auto mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">Nos partenaires et sites de référence</h2>
                  <p className="text-slate-600">
                    Nous collaborons avec diverses organisations et souhaitons partager ces ressources qui peuvent vous être utiles.
                    Ces sites reflètent des valeurs que nous partageons et offrent des perspectives enrichissantes sur la foi, la théologie et l'engagement social.
                  </p>
                </div>

                {/* Affichage par catégorie */}
                {sites.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    Aucun site partenaire pour le moment.
                  </div>
                ) : (
                  <div className="space-y-12">
                    {Object.entries(sitesByCategory).map(([category, categorySites]: [string, any[]]) => (
                      <div key={category}>
                        <h3 className="text-2xl font-semibold mb-6 text-primary">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categorySites.map((site: any) => (
                            <Card key={site.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                              <CardHeader className="text-center pb-2">
                                {site.logoZone && (
                                  <div className="flex justify-center mb-4">
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                      <DynamicImageBlock
                                        zone={site.logoZone}
                                        fallbackSrc="/placeholder.svg?height=96&width=96"
                                        alt={`Logo ${site.name}`}
                                        type="avatar"
                                        width={96}
                                        height={96}
                                        className="object-contain"
                                      />
                                    </div>
                                  </div>
                                )}
                                <CardTitle className="text-xl">{site.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <p className="text-slate-700 text-sm">{site.description}</p>
                              </CardContent>
                              <CardFooter>
                                <Button asChild className="w-full">
                                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                    Visiter le site 
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                  </a>
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-16 max-w-2xl mx-auto text-center">
                  <h3 className="text-2xl font-bold mb-4">Vous avez un site à nous recommander ?</h3>
                  <p className="text-slate-600 mb-6">
                    Si vous connaissez un site qui pourrait enrichir cette liste et correspondre à nos valeurs,
                    n'hésitez pas à nous en faire part via notre formulaire de contact.
                  </p>
                  <Button asChild>
                    <Link href="/contact">Nous contacter</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
