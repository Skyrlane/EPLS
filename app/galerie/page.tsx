import Link from "next/link"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Metadata } from "next"
import { ImageBlock } from "@/components/ui/image-block"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Galerie Photos - Église Protestante Libre de Strasbourg",
  description: "Découvrez notre communauté à travers notre galerie de photos",
}

// Images de démonstration 
const galleryCategories = [
  {
    id: "cultes",
    name: "Cultes",
    images: [
      {
        id: 1,
        src: "/images/messages/grace.jpg",
        alt: "Culte dominical",
        description: "Notre assemblée lors d'un culte dominical",
        category: "Cultes",
        credit: "EPLS"
      },
      {
        id: 2,
        src: "/images/messages/foi.jpg",
        alt: "Louange pendant le culte",
        description: "Moment de louange pendant notre service",
        category: "Cultes",
        credit: "EPLS"
      },
      {
        id: 3,
        src: "/images/messages/evangile.jpg",
        alt: "Prédication du pasteur",
        description: "Notre pasteur lors d'une prédication",
        category: "Cultes",
        credit: "EPLS"
      },
    ],
  },
  {
    id: "evenements",
    name: "Événements",
    images: [
      {
        id: 4,
        src: "/images/messages/grace.jpg",
        alt: "Fête de Noël",
        description: "Célébration de Noël avec la communauté",
        category: "Événements",
        credit: "EPLS"
      },
      {
        id: 5,
        src: "/images/messages/foi.jpg",
        alt: "Repas communautaire",
        description: "Partage d'un repas après le culte",
        category: "Événements",
        credit: "EPLS"
      },
      {
        id: 6,
        src: "/images/messages/evangile.jpg",
        alt: "Étude biblique",
        description: "Groupe d'étude biblique hebdomadaire",
        category: "Événements",
        credit: "EPLS"
      },
    ],
  },
  {
    id: "jeunesse",
    name: "Jeunesse",
    images: [
      {
        id: 7,
        src: "/images/messages/esperance.jpg",
        alt: "Groupe de jeunes",
        description: "Rencontre du groupe de jeunes",
        category: "Jeunesse",
        credit: "EPLS"
      },
      {
        id: 8,
        src: "/images/messages/foi.jpg",
        alt: "Camp d'été",
        description: "Activités lors du camp d'été",
        category: "Jeunesse",
        credit: "EPLS"
      },
      {
        id: 9,
        src: "/images/messages/grace.jpg",
        alt: "École du dimanche",
        description: "Moment d'apprentissage à l'école du dimanche",
        category: "Jeunesse",
        credit: "EPLS"
      },
    ],
  },
  {
    id: "batiment",
    name: "Notre bâtiment",
    images: [
      {
        id: 10,
        src: "/images/hero/church-hero.png",
        alt: "Façade de l'église",
        description: "Vue extérieure de notre bâtiment",
        category: "Notre bâtiment",
        credit: "EPLS"
      },
      {
        id: 11,
        src: "/images/histoire/eglise-histoire.jpg",
        alt: "Salle principale",
        description: "Notre salle de culte",
        category: "Notre bâtiment",
        credit: "EPLS"
      },
      {
        id: 12,
        src: "/images/hero/culte-hero.png",
        alt: "Salle de réunion",
        description: "Espace pour les rencontres et études",
        category: "Notre bâtiment",
        credit: "EPLS"
      },
    ],
  },
]

export default function GaleriePhotos() {
  return (
    <div className="container mx-auto py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Galerie Photos</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span>Galerie Photos</span>
        </div>
      </header>

      <section>
        <Tabs defaultValue="cultes" className="w-full">
          <TabsList className="w-full justify-start mb-8 overflow-x-auto">
            {galleryCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {galleryCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.images.map((image) => (
                  <div key={image.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow rounded-md dark:bg-slate-800">
                    <div className="relative h-60 w-full group">
                      <ImageBlock
                        src={image.src}
                        alt={image.alt}
                        type="gallery"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        containerClassName="h-full"
                        rounded="none"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60 dark:bg-black/70 dark:text-white">
                          {image.category || category.name}
                        </Badge>
                      </div>
                      
                      {/* Arrière-plan semi-transparent qui apparaît au survol */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Description qui monte depuis le bas au survol */}
                      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/85 dark:bg-slate-900/90 backdrop-blur-sm p-3">
                        <p className="text-gray-800 dark:text-gray-100 font-medium">{image.alt}</p>
                        <CardDescription className="text-gray-800 dark:text-gray-200">{image.description}</CardDescription>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
} 