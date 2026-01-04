import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/types";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "À propos | Église Protestante Libre de Saint-Maur",
  description: "Découvrez l'histoire, la vision et les valeurs de l'Église Protestante Libre de Saint-Maur, fondée en 1957.",
};

export default async function AboutPage() {
  const teamMembers: TeamMember[] = await getTeamMembers();
  
  // Définir les items de Breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos", isCurrent: true },
  ];
  
  return (
    <>
      <PageHeader 
        title="À propos" 
        breadcrumbs={breadcrumbItems}
      />

      <main className="pb-16">
        <SectionContainer background="light">
          <div className="container py-12">
            <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">Fondée en 1957, l'Église Protestante Libre de Saint-Maur est née de la volonté de chrétiens convaincus de la nécessité d'implanter une église évangélique dans l'Est parisien.</p>
                <p className="mb-4">Au fil des décennies, notre communauté s'est développée tout en restant fidèle à sa mission : annoncer l'Évangile et accompagner chacun dans sa relation avec Dieu.</p>
                <p>Aujourd'hui, notre église fait partie de l'Union des Églises Protestantes Libres de France, un ensemble d'églises évangéliques qui partagent une même vision de la foi et du service.</p>
              </div>
              <div className="bg-gray-200 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Image historique à venir</p>
                  <p className="text-sm text-muted-foreground">Une photo de notre église sera bientôt disponible</p>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        <SectionContainer>
          <div className="container py-12">
            <h2 className="text-3xl font-bold mb-6">Notre vision et mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1 bg-gray-200 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Image de notre assemblée</p>
                  <p className="text-sm text-muted-foreground">Une photo de notre église en action sera bientôt disponible</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <p className="mb-4">L'Église Protestante Libre de Saint-Maur existe pour :</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><span className="font-semibold">Adorer</span> : Célébrer Dieu ensemble et individuellement</li>
                  <li><span className="font-semibold">Témoigner</span> : Partager l'amour de Dieu autour de nous</li>
                  <li><span className="font-semibold">Former</span> : Grandir dans la foi et la connaissance de la Bible</li>
                  <li><span className="font-semibold">Servir</span> : Mettre nos dons au service des autres</li>
                  <li><span className="font-semibold">Communier</span> : Vivre une véritable fraternité</li>
                </ul>
                <p>Notre vision est de voir des vies transformées par l'Évangile, créant une communauté rayonnante qui impacte positivement notre ville et au-delà.</p>
              </div>
            </div>
          </div>
        </SectionContainer>

        <SectionContainer background="light">
          <div className="container py-12">
            <h2 className="text-3xl font-bold mb-6">Nos convictions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>La Bible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Nous croyons que la Bible est la Parole de Dieu, inspirée et sans erreur. Elle est notre autorité finale en matière de foi et de conduite.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Jésus-Christ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Nous croyons en Jésus-Christ, pleinement Dieu et pleinement homme, en sa naissance virginale, sa vie sans péché, ses miracles, sa mort expiatoire et sa résurrection corporelle.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Le Salut</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Nous croyons que le salut est un don de Dieu, reçu par la foi en Jésus-Christ seul, et non par les œuvres.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </SectionContainer>

        <SectionContainer>
          <div className="container py-12">
            <h2 className="text-3xl font-bold mb-8">Notre équipe</h2>
            
            {teamMembers.length === 0 ? (
              <p className="text-center text-muted-foreground">Information sur l'équipe à venir</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="aspect-[4/3] relative bg-gray-200">
                      {member.imageUrl ? (
                        <Image 
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-muted-foreground">Photo non disponible</p>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </SectionContainer>

        <SectionContainer background="primary" className="text-white">
          <div className="container py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Venez nous rencontrer</h2>
            <p className="max-w-2xl mx-auto mb-8">Nous serions ravis de vous accueillir lors de l'un de nos cultes ou activités. N'hésitez pas à nous contacter pour plus d'informations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary">
                <Link href="/culte">Horaires des cultes <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white hover:bg-white hover:text-primary">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </main>
    </>
  );
} 