import React from 'react';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  HeartIcon,
  PlayCircleIcon,
  FileTextIcon,
  ArrowRightIcon,
  Clock10Icon,
  ChevronRightIcon,
  BookIcon,
  NewspaperIcon,
  FileIcon
} from "lucide-react"
import { FirebaseStatus } from "@/components/firebase-status"
import { Metadata } from "next"
import { SectionContainer } from '@/components/ui/section-container'
import { ImageBlock } from '@/components/ui/image-block'
import { CallToAction } from '@/components/home/call-to-action'
import { FeatureCard } from '@/components/home/feature-card'
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageLikeButton } from "../components/home/message-like-button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CalendarCombined } from "../components/calendar/calendar-combined"
import { LatestEchoSection } from "@/components/home/latest-echo-section"
import { LatestMessageCard } from "@/components/home/latest-message-card"
import { VisioconferenceLink } from "@/components/visioconference/qr-code-link"
import { ServiceInfoCard } from "@/components/home/service-info-card"
import { importantNotices } from "@/lib/data/notices"
import dynamic from 'next/dynamic'

// Import dynamique du composant client
const ImportantNotices = dynamic(
  () => import('@/components/home/important-notices').then(mod => mod.ImportantNotices),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Accueil | Église Protestante Libre de Strasbourg",
  description: "Bienvenue à l'Église Protestante Libre de Strasbourg - Une communauté chrétienne vivante, accueillante et engagée au cœur de Strasbourg",
}

// Données simulées pour les événements à venir
const upcomingEvents = [
  {
    id: "evt1",
    title: "Culte dominical",
    date: "Dimanche, 21 avril 2024",
    time: "10h30",
    location: "Temple EPL",
    description: "Culte hebdomadaire avec prédication sur le thème de la grâce.",
    imageUrl: "/images/events/culte.jpg",
    isRecurring: true,
  },
  {
    id: "evt2",
    title: "Étude biblique",
    date: "Mercredi, 24 avril 2024",
    time: "19h00",
    location: "Temple EPL",
    description: "Étude du livre des Actes, chapitre 8.",
    imageUrl: "/images/events/etude-biblique.jpg",
    isRecurring: true,
  },
  {
    id: "evt3",
    title: "Groupe de prière",
    date: "Vendredi, 26 avril 2024",
    time: "18h30",
    location: "Temple EPL",
    description: "Temps de prière communautaire pour l'église et ses missions.",
    imageUrl: "/images/events/priere.jpg",
    isRecurring: false,
  },
]

// Données simulées pour le dernier message
const latestMessage = {
  id: "grace-suffisante",
  title: "La grâce suffisante",
  date: "14 avril 2024",
  description: "Dans ce message, nous explorons comment la grâce de Dieu se manifeste pleinement dans nos faiblesses et comment elle est suffisante pour toutes les circonstances de notre vie.",
  coverImage: "/images/messages/grace.jpg",
  series: "Grâce",
  speaker: {
    name: "Pasteur Jean Dupont",
    image: "/images/team/pasteur.webp"
  }
}

// Données simulées pour le dernier Echo mensuel
const latestEcho = {
  id: "echo-2024-04",
  title: "L'Echo de l'EPLS",
  edition: "Avril 2024",
  description:
    "Retrouvez dans ce numéro les dernières nouvelles de notre communauté, le calendrier des activités du mois, des témoignages inspirants et une méditation sur le thème de Pâques.",
  coverUrl: "/images/echo/echo-avril.jpg",
  pdfUrl: "#",
  year: "2024",
}

// Type pour le message
interface Message {
  id: string
  title: string
  description: string
  coverImage: string
  date: string
  series: string
  likes: number
  speaker: {
    name: string
    image: string
  }
}

// Messages récents pour la page d'accueil
const latestMessages = [
  {
    id: "msg1",
    title: "L'évangile, puissance de Dieu",
    date: "2023-10-15",
    speaker: "Pasteur Jean Dupont",
    imageUrl: "/images/messages/message-1.jpg",
    videoUrl: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
    likes: 24,
  },
  {
    id: "msg2",
    title: "La grâce qui nous sauve",
    date: "2023-10-08",
    speaker: "Pasteur Jean Dupont",
    imageUrl: "/images/messages/message-2.jpg",
    videoUrl: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
    likes: 18,
  },
  {
    id: "msg3",
    title: "Vivre par la foi",
    date: "2023-10-01",
    speaker: "Ancien Pierre Martin",
    imageUrl: "/images/messages/message-3.jpg",
    videoUrl: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
    likes: 32,
  },
]

// Nouvelles récentes pour la page d'accueil
const latestNews = [
  {
    id: "news1",
    title: "Conférence sur la réforme",
    date: "2023-10-28T18:30:00",
    excerpt: "Venez découvrir l'impact de la Réforme protestante sur notre société actuelle.",
    imageUrl: "/images/blog/news-1.jpg",
  },
  {
    id: "news2",
    title: "Collecte alimentaire",
    date: "2023-11-05",
    excerpt: "Notre église organise une collecte alimentaire pour les plus démunis.",
    imageUrl: "/images/blog/news-2.jpg",
  },
]

/**
 * Section héro pour la page d'accueil
 */
function HeroSection() {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <ImageBlock
        src="/images/hero/church-hero.png"
        alt="Église Protestante Libre de Strasbourg"
        type="hero"
        priority={true}
        width={1920}
        height={780}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 md:bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-md">
          Église Protestante Libre de Strasbourg
        </h1>
        <p className="mt-4 max-w-lg text-lg md:text-xl drop-shadow-md font-medium">
          Une communauté chrétienne vivante, enracinée dans la Bible et tournée vers les autres
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="/notre-eglise">Découvrir notre église</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-full text-base bg-white text-primary hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 shadow-md">
            <Link href="/culte/calendrier">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Nos activités
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <Card className="overflow-hidden dark:bg-slate-900 dark:border-slate-800 card-hover">
      <div className="relative h-40">
        <ImageBlock
          src={event.imageUrl || "/images/placeholder.jpg"}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        {event.isRecurring && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-primary/90 text-white">
            Récurrent
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="flex items-start gap-2">
          <CalendarIcon className="mt-0.5 h-4 w-4 text-muted-foreground dark:text-gray-300" />
          <div>
            <p className="text-sm text-foreground dark:text-gray-200">{event.date}</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              <Clock10Icon className="mr-1 inline-block h-3 w-3" />
              {event.time}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground dark:text-gray-300" />
          <p className="text-sm text-muted-foreground dark:text-gray-300">{event.location}</p>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground dark:text-gray-300 mb-3">{event.description}</p>
      </CardFooter>
    </Card>
  )
}

function EchoCard({ echo }: { echo: any }) {
  return (
    <Card className="overflow-hidden dark:bg-slate-900 dark:border-slate-800 card-hover">
      <div className="relative aspect-[3/4] w-full">
        <ImageBlock
          src={echo.coverUrl}
          alt={`${echo.title} - ${echo.edition}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="mb-1 text-lg font-bold">{echo.title}</h3>
          <p className="text-sm font-medium text-white/90">Édition {echo.edition}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="mb-4 text-sm text-muted-foreground dark:text-gray-300">{echo.description}</p>
        <div className="flex justify-between">
          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-200">
            {echo.year}
          </Badge>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1 dark:border-gray-700 dark:text-gray-200"
          >
            <Link href={echo.pdfUrl}>
              <FileTextIcon className="h-4 w-4" />
              PDF
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CallToActionLocal({
  title,
  description,
  buttonText,
  buttonLink
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <div className="bg-primary dark:bg-primary py-16 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="mx-auto max-w-2xl text-white/90 dark:text-gray-100 mb-8">
          {description}
        </p>
        <Button 
          asChild 
          variant="outline"
          className="bg-white text-primary hover:bg-white/90 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:border-slate-700 px-6 py-3 text-base"
        >
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <main className="vertical-rhythm">
      {/* Bannière d'alerte pour la configuration Firebase */}
      <FirebaseStatus />

      {/* Hero Section */}
      <HeroSection />
      
      {/* Information sur le culte */}
      <div className="container mx-auto px-4 -mt-16 md:-mt-20 z-10 relative">
        <div className="flex justify-center">
          <ServiceInfoCard className="w-full max-w-sm shadow-lg" />
        </div>
      </div>
      
      {/* Section des annonces importantes */}
      <div className="relative z-10 mb-16">
        <div className="container mx-auto px-4">
          <ImportantNotices notices={importantNotices} className="shadow-md" />
        </div>
      </div>

      {/* Section QR Code et dernier message */}
      <SectionContainer background="white" className="section-spacing">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* QR Code Visioconférence */}
            <div className="lg:col-span-1">
              <VisioconferenceLink 
                meetingUrl="https://meet.google.com/cbf-yxbw-rgo" 
                className="dark:bg-slate-900 dark:border-slate-800 h-full"
              />
            </div>
            
            {/* Dernier message du pasteur */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Dernier message</h2>
                <p className="text-muted-foreground">
                  Retrouvez le dernier message apporté dans notre église
                </p>
              </div>
              <LatestMessageCard message={latestMessage} />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Prochains événements */}
      <SectionContainer background="light" className="section-spacing">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Prochains événements</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Rejoignez-nous pour nos prochaines rencontres et activités
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <CalendarCombined 
            events={upcomingEvents} 
            title="" 
            description=""
            showViewAll={true}
          />
        </div>
      </SectionContainer>

      {/* Dernier Echo mensuel */}
      <LatestEchoSection echo={latestEcho} />

      {/* Sections principales */}
      <SectionContainer background="light" className="section-spacing">
        <div className="grid-cols-auto-fit">
          <FeatureCard
            title="Notre Église"
            description="Découvrez qui nous sommes"
            icon={HeartIcon}
            content="L'Église Protestante Libre de Strasbourg est une communauté chrétienne fondée sur l'Évangile, attachée aux principes de la Réforme et ouverte à tous."
            linkText="En savoir plus"
            linkHref="/notre-eglise"
          />
          <FeatureCard
            title="Culte & Vie"
            description="Notre vie spirituelle"
            icon={BookOpenIcon}
            content="Nos cultes sont des moments de louange, de prière et d'enseignement biblique. Nous proposons également des études bibliques et des groupes de partage."
            linkText="En savoir plus"
            linkHref="/culte"
          />
          <FeatureCard
            title="Où sommes-nous"
            description="Venez nous rencontrer"
            icon={MapPinIcon}
            content="Notre église est située à Strasbourg, facilement accessible en transports en commun. Nous vous accueillons chaque dimanche à 10h30."
            linkText="Nous trouver"
            linkHref="/contact"
          />
        </div>
      </SectionContainer>

      {/* Appel à l'action */}
      <SectionContainer background="primary" className="section-spacing">
        <CallToAction
          title="Rejoignez notre communauté"
          description="Que vous soyez en recherche spirituelle ou déjà engagé dans la foi, nous serions heureux de vous accueillir parmi nous."
          primaryButtonText="Contactez-nous"
          primaryButtonLink="/contact"
        />
      </SectionContainer>

      {/* Blog et actualités */}
      <SectionContainer background="light" className="section-spacing">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Blog et méditations</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Découvrez nos derniers articles et méditations bibliques
          </p>
        </div>
        <div className="text-center mt-6">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="/blog">Voir tous les articles</Link>
          </Button>
        </div>
      </SectionContainer>
    </main>
  );
} 