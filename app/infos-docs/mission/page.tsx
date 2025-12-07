import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Users, Globe, BookOpen, Video } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { DynamicImageBlock } from "@/components/ui/dynamic-image-block"
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { Missionary } from '@/types'

export const metadata: Metadata = {
  title: "La Mission | Église Protestante Libre de Strasbourg",
  description: "Découvrez les projets missionnaires de l'Union des Églises Évangéliques Libres : SEPPF, missions au Congo, Madagascar, Réunion, Algérie, Océanie et en France",
  keywords: ["mission", "SEPPF", "missionnaire", "Congo", "Madagascar", "Algérie", "Réunion", "Nouvelle-Calédonie", "UEEL"]
}

// 🎥 URL de la vidéo Firebase Storage - Journée de la Mission 2021
const MISSION_VIDEO_URL = "https://firebasestorage.googleapis.com/v0/b/epls-production.firebasestorage.app/o/videos%2FLa%20Mission%202021.mp4?alt=media&token=289b01ba-5c36-4f00-b087-2c3cd3c232ab"

export default async function MissionPage() {
  // Charger les missionnaires publiés
  let missionaries: Missionary[] = [];
  try {
    const missionariesRef = collection(firestore, 'missionaries');
    const q = query(
      missionariesRef,
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    missionaries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      newsletters: doc.data().newsletters?.map((n: any) => ({
        ...n,
        uploadedAt: n.uploadedAt?.toDate() || new Date()
      })) || []
    })) as Missionary[];
    
    // Trier par nom côté client
    missionaries.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Erreur chargement missionnaires:', error);
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">La Mission</h1>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-primary hover:text-primary/80">
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/infos-docs" className="text-primary hover:text-primary/80">
                    Infos & Docs
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">La Mission</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <Sidebar />
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3">
                <div className="max-w-4xl mx-auto">
                  {/* Intro */}
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Les projets missionnaires de l&apos;UEEL</h2>
                    <p className="text-lg text-muted-foreground">
                      L&apos;Union des Églises évangéliques libres soutient plusieurs projets missionnaires portés par des Églises. L&apos;idée principal d&apos;action déroulant dans le cadre de partenariat avec des Églises sœurs. L&apos;Union n&apos;a pas d&apos;organisme missionnaire spécifique.
                    </p>
                  </div>

                  {/* Section 1 : SEPPF */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Soutien à l&apos;Enseignement Protestant en Pays Francophones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="md:w-1/4">
                          <div className="relative w-32 h-32 mx-auto">
                            <DynamicImageBlock
                              zone="seppf-logo"
                              fallbackSrc="/placeholder.svg?height=200&width=200"
                              alt="Logo SEPPF"
                              type="avatar"
                              width={200}
                              height={200}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="md:w-3/4">
                          <p className="mb-4">
                            La SEPPF est une association d&apos;intérêt général qui œuvre à la reprise Nouvelle enseignement au moins l&apos;étranger, dans le mouvement des établissements au Wimbulu.
                          </p>
                          <p className="mb-4">
                            L&apos;Association ont partenaire de l&apos;UEELF et travaille en étroite collaboration avec le DEFAP, service protestant de mission.
                          </p>
                          <Button asChild variant="outline">
                            <a
                              href="http://www.sepf.fr/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2"
                            >
                              Pour en savoir plus...
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 2 : Vidéo mission */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Vidéo mission
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Journée de la Mission 2021
                      </p>
                      <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <video
                          className="w-full h-full object-contain"
                          controls
                          preload="auto"
                        >
                          <source src={MISSION_VIDEO_URL} type="video/mp4" />
                          <source src={MISSION_VIDEO_URL.replace('.mp4', '.webm')} type="video/webm" />
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 3 : Les champs de mission */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Les champs de mission
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-lg mb-2">Au Congo-Brazzaville</h4>
                          <p>
                            Le soutien du programme de l&apos;Église dans le lutte contre le SIDA ; l&apos;aite action à la Faculté de théologie protestante. Discours d&apos;études, discussion pour oeuvres développement communautaire Makanji dans la région de Kindamba ainsi qu&apos;une association créée en 2016 figure (UEEL).
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg mb-2">À Madagascar</h4>
                          <p>
                            L&apos;accompagnement de l&apos;Institut supérieur de théologie évangélique (soutenu du pasteur Raymond Onawari pour dispenser des cours, aida financiers)
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg mb-2">À la Réunion</h4>
                          <p>
                            Maintien de biens fraternels, réflexe et de programme American Formation est en ce moment un peu au ralenti de fois
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg mb-2">En Algérie</h4>
                          <p>
                            Soutien d&apos;une missionnaire (l&apos;Algérie membre des pays EPA), et poursutte des contacts avec l&apos;EPA, missive et soutenue à travers plus tendu et des priorités du moule ne pouvons plutôt intervenir.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg mb-2">En Océanie</h4>
                          <p>
                            Enseignement dans les écoles protestantes versouriennes par la base un la SEPPF, et peut et de réparation de relations avec l&apos;Église libre de Nouvelle-Calédonie qui maintenue une unité permanent des échanges clairs.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg mb-2">En France, un vrai tour Aventure Formation</h4>
                          <p>
                            Le cycle de parcours AF ses lands, avec 16 groupes d&apos;inventions, environ 150 étudiants et adultes - il qui réside associations partie de baptêmes ! Et d&apos;une eux du groupe vient accompagneurs : l&apos;enjeu est d&apos;un et deux Église nouvelles.
                          </p>
                        </div>
                      </div>

                      <div className="my-8 relative h-64 rounded-lg overflow-hidden">
                        <DynamicImageBlock
                          zone="mission-world"
                          fallbackSrc="/placeholder.svg?height=400&width=800"
                          alt="Carte des missions dans le monde"
                          type="section"
                          width={800}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 4 : Nos missionnaires */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Nos missionnaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {missionaries.length === 0 ? (
                        <p className="text-muted-foreground">
                          Aucun missionnaire pour le moment.
                        </p>
                      ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {missionaries.map(missionary => (
                            <Card key={missionary.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">{missionary.name}</h3>
                                <p className="text-primary font-medium mb-3">{missionary.location}</p>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                  {missionary.description}
                                </p>
                                <Button asChild className="w-full">
                                  <Link href={`/infos-docs/mission/${missionary.slug}`}>
                                    En savoir plus
                                  </Link>
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Section 5 : Documents PDF */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents PDF
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline">
                        <a
                          href="/documents/journee-ueel-2021.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Journée de l&apos;UEEL 2021
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Boutons d'action */}
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-12">
                    <Button asChild size="lg" className="shadow-md">
                      <Link href="/infos-docs/union-eglise">Découvrir l&apos;Union</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/infos-docs/histoire-union">Histoire de l&apos;Union</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
