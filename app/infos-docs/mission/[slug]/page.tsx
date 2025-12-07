import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Missionary } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, Activity, ExternalLink, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { DynamicImageBlock } from '@/components/ui/dynamic-image-block';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';

interface PageProps {
  params: {
    slug: string;
  };
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const missionary = await getMissionary(params.slug);

  if (!missionary) {
    return {
      title: 'Missionnaire non trouvé | Église Protestante Libre de Strasbourg'
    };
  }

  return {
    title: `${missionary.name} - ${missionary.location} | Église Protestante Libre de Strasbourg`,
    description: missionary.description.substring(0, 160),
    keywords: ['mission', 'missionnaire', missionary.name, missionary.location, 'UEEL', 'EPLS']
  };
}

// Charger le missionnaire depuis Firestore
async function getMissionary(slug: string): Promise<Missionary | null> {
  try {
    const missionariesRef = collection(firestore, 'missionaries');
    const q = query(
      missionariesRef,
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      newsletters: doc.data().newsletters?.map((n: any) => ({
        ...n,
        uploadedAt: n.uploadedAt?.toDate() || new Date()
      })) || []
    } as Missionary;
  } catch (error) {
    console.error('Erreur chargement missionnaire:', error);
    return null;
  }
}

export default async function MissionaryDetailPage({ params }: PageProps) {
  const missionary = await getMissionary(params.slug);

  if (!missionary) {
    notFound();
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 dark:bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/infos-docs/mission" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux missions
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-2">{missionary.name}</h1>
          <div className="flex items-center gap-2 text-lg text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>{missionary.location}</span>
          </div>

          {/* Breadcrumbs */}
          <nav className="flex mt-6" aria-label="Breadcrumb">
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
                  <Link href="/infos-docs/mission" className="text-primary hover:text-primary/80">
                    La Mission
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 dark:text-gray-300">{missionary.name}</span>
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
                <div className="space-y-8">
                  {/* Image de la famille */}
                  {missionary.imageZone && (
                    <div className="relative w-full h-96 rounded-lg overflow-hidden">
                      <DynamicImageBlock
                        zone={missionary.imageZone}
                        fallbackSrc="/placeholder.svg?height=600&width=800"
                        alt={missionary.name}
                        type="section"
                        width={800}
                        height={600}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none dark:prose-invert">
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">{missionary.description}</p>
                    </CardContent>
                  </Card>

                  {/* Activités */}
                  {missionary.activities && missionary.activities.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Activités
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {missionary.activities.map((activity, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Vidéo YouTube */}
                  {missionary.youtubeUrl && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Vidéo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <YouTubeEmbed url={missionary.youtubeUrl} title={`Vidéo ${missionary.name}`} />
                      </CardContent>
                    </Card>
                  )}

                  {/* Lettres de nouvelles (PDFs) */}
                  {missionary.newsletters && missionary.newsletters.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Lettres de nouvelles
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {missionary.newsletters.map(newsletter => (
                            <a
                              key={newsletter.id}
                              href={newsletter.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="font-medium">{newsletter.title}</span>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Bouton retour */}
                  <div className="flex justify-center mt-12">
                    <Button asChild size="lg">
                      <Link href="/infos-docs/mission" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour à la page Mission
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
