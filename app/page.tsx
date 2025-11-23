import React from 'react';

// Forcer le rendu dynamique pour la section blog
export const dynamic = 'force-dynamic';
export const revalidate = 60;
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
import { CurrentMonthEchoSafe } from "@/components/echo/current-month-echo-safe"
import { LatestMessageCard } from "@/components/home/latest-message-card"
import { VisioconferenceLink } from "@/components/visioconference/qr-code-link"
import { ServiceInfoCard } from "@/components/home/service-info-card"
import { ImportantAnnouncementsSection } from "@/components/announcements/important-announcements-section"
import { UpcomingEventsSection } from "@/components/announcements/upcoming-events-section"
import NextDynamic from 'next/dynamic'
import { LatestBlogArticle } from '@/components/home/latest-blog-article'

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

// Dernier message chargé depuis Firebase (voir export default async function Home())

// Les données de l'Echo sont maintenant gérées par Firebase

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

export default async function Home() {
  // Charger les données Firebase (dernier message + dernier article)
  let latestMessageData = null;
  let latestBlogArticle = null;
  
  try {
    const { collection: firestoreCollection, getDocs, query: firestoreQuery, where, orderBy: firestoreOrderBy, limit } = await import('firebase/firestore');
    const { firestore } = await import('@/lib/firebase');
    
    // Charger le dernier message
    console.log('🎥 === CHARGEMENT DERNIER MESSAGE (Page d\'accueil) ===');
    
    const messagesRef = firestoreCollection(firestore, 'messages');
    const messagesQ = firestoreQuery(
      messagesRef,
      where('status', '==', 'published'),
      where('isActive', '==', true),
      firestoreOrderBy('date', 'desc'),
      limit(1)
    );
    
    const messagesSnapshot = await getDocs(messagesQ);
    
    if (!messagesSnapshot.empty) {
      const doc = messagesSnapshot.docs[0];
      const data = doc.data();
      
      console.log('✅ Dernier message trouvé:', {
        id: doc.id,
        title: data.title,
        pastor: data.pastor,
        date: data.date?.toDate ? data.date.toDate().toLocaleDateString('fr-FR') : 'Date invalide'
      });
      
      latestMessageData = {
        id: doc.id,
        title: data.title,
        description: data.description || '',
        coverImage: data.coverImageUrl || data.thumbnailUrl,
        date: data.date?.toDate ? data.date.toDate().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : '',
        series: data.tag || '',
        speaker: {
          name: data.pastor,
          image: '/images/team/pasteur.webp'
        }
      };
    } else {
      console.log('⚠️ Aucun message publié trouvé');
    }
    
    // Charger le dernier article du blog
    const articlesRef = firestoreCollection(firestore, 'articles');
    const articlesQ = firestoreQuery(
      articlesRef,
      where('status', '==', 'published'),
      where('isActive', '==', true),
      firestoreOrderBy('publishedAt', 'desc'),
      limit(1)
    );
    
    const articlesSnapshot = await getDocs(articlesQ);
    if (!articlesSnapshot.empty) {
      const doc = articlesSnapshot.docs[0];
      const data = doc.data();
      latestBlogArticle = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        publishedAt: data.publishedAt?.toDate(),
      };
    }
  } catch (error) {
    console.error('❌ Erreur chargement données Firebase:', error);
  }

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
          <ImportantAnnouncementsSection className="shadow-md" maxAnnouncements={3} />
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
              {latestMessageData ? (
                <LatestMessageCard message={latestMessageData} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucun message disponible pour le moment</p>
                </div>
              )}
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
          <UpcomingEventsSection maxEvents={3} />
        </div>
      </SectionContainer>

      {/* Dernier Echo mensuel */}
      <CurrentMonthEchoSafe />

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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Dernier article</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre dernier article de blog
          </p>
        </div>
        
        {latestBlogArticle ? (
          <div className="max-w-md mx-auto">
            <LatestBlogArticle article={latestBlogArticle} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun article publié pour le moment</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="/blog">
              Voir tous les articles
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </main>
  );
} 