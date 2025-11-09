import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Breadcrumb, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchJsonLd } from "@/components/json-ld"
import { PageHeader } from "@/components/ui/page-header"
import { SectionContainer } from "@/components/ui/section-container"
import { ExternalLink } from "lucide-react"
import Sidebar from "../components/Sidebar"

export const metadata: Metadata = {
  title: "Sites amis | Église Protestante Libérale de Strasbourg",
  description: "Découvrez les sites de nos partenaires et d'organisations avec lesquelles nous partageons des valeurs communes.",
  keywords: ["sites amis", "liens", "ressources", "églises", "partenaires", "EPLS", "Église Protestante Libérale", "Strasbourg"]
}

type FriendlySite = {
  id: string
  name: string
  description: string
  url: string
  logo: string
  category: "dénomination" | "églises" | "formation" | "mission" | "organisation" | "ressources"
}

export default function SitesAmisPage() {
  const friendlySites: FriendlySite[] = [
    {
      id: "uepal",
      name: "Union des Églises Protestantes d'Alsace et de Lorraine",
      description: "Notre église est membre de l'UEPAL, qui regroupe des églises luthériennes et réformées en Alsace et en Moselle.",
      url: "https://www.uepal.fr/",
      logo: "/images/partners/uepal-logo.png",
      category: "dénomination"
    },
    {
      id: "protestants",
      name: "Protestants.org",
      description: "Le portail de la Fédération Protestante de France, représentant la diversité du protestantisme français.",
      url: "https://www.protestants.org/",
      logo: "/images/partners/protestants-logo.png",
      category: "organisation"
    },
    {
      id: "evangile-liberte",
      name: "Évangile et Liberté",
      description: "Mensuel protestant de réflexion et d'engagement qui promeut une foi ouverte au dialogue avec la modernité.",
      url: "https://www.evangile-et-liberte.net/",
      logo: "/images/partners/evangile-liberte-logo.png",
      category: "ressources"
    },
    {
      id: "fondation-diaconat",
      name: "Fondation du Diaconat",
      description: "Organisation caritative protestante engagée dans des actions sociales et médicales en Alsace.",
      url: "https://www.fondation-diaconat.fr/",
      logo: "/images/partners/diaconat-logo.png",
      category: "organisation"
    },
    {
      id: "flt-strasbourg",
      name: "Faculté de Théologie Protestante de Strasbourg",
      description: "Établissement universitaire de formation théologique et de recherche scientifique.",
      url: "https://theopro.unistra.fr/",
      logo: "/images/partners/flt-strasbourg-logo.png",
      category: "formation"
    },
    {
      id: "defap",
      name: "Défap - Service Protestant de Mission",
      description: "Organisation missionnaire des Églises protestantes françaises qui soutient des projets à l'international.",
      url: "https://www.defap.fr/",
      logo: "/images/partners/defap-logo.png",
      category: "mission"
    },
    {
      id: "ceeefe",
      name: "CEEEFE - Églises Protestantes Francophones à l'Étranger",
      description: "Réseau des communautés protestantes francophones dans le monde entier.",
      url: "https://www.eglisesfrancaises.org/",
      logo: "/images/partners/ceeefe-logo.png",
      category: "églises"
    },
    {
      id: "musee-protestant",
      name: "Musée Virtuel du Protestantisme",
      description: "Ressource en ligne sur l'histoire et le patrimoine protestant depuis le XVIe siècle.",
      url: "https://www.museeprotestant.org/",
      logo: "/images/partners/musee-protestant-logo.png",
      category: "ressources"
    },
    {
      id: "acat",
      name: "ACAT - Action des Chrétiens pour l'Abolition de la Torture",
      description: "ONG chrétienne œcuménique qui lutte contre la torture et la peine de mort dans le monde.",
      url: "https://www.acatfrance.fr/",
      logo: "/images/partners/acat-logo.png",
      category: "organisation"
    }
  ]

  return (
    <>
      <ChurchJsonLd />
      <PageHeader
        title="Sites amis"
        description="Découvrez les sites de nos partenaires et d'organisations avec lesquelles nous partageons des valeurs communes."
      >
        <Breadcrumb
          segments={[
            { href: "/infos-docs", label: "Infos & Documents" }
          ]}
          currentPage="Sites amis"
        />
      </PageHeader>

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {friendlySites.map((site) => (
                    <Card key={site.id} className="h-full flex flex-col">
                      <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                            <Image
                              src={site.logo}
                              alt={`Logo ${site.name}`}
                              width={96}
                              height={96}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <CardTitle className="text-xl">{site.name}</CardTitle>
                        <CardDescription className="text-sm font-medium text-indigo-600 uppercase">
                          {site.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-slate-700">{site.description}</p>
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