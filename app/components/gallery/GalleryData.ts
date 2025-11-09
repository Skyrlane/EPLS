export interface GalleryImageProps {
  id: number
  src: string
  alt: string
  description: string
}

export interface GalleryCategoryProps {
  id: string
  name: string
  images: GalleryImageProps[]
}

export const galleryCategories: GalleryCategoryProps[] = [
  {
    id: "cultes",
    name: "Cultes",
    images: [
      { id: 1, src: "/images/culte-1.jpg", alt: "Culte du dimanche", description: "Moment de louange lors d'un culte dominical" },
      { id: 2, src: "/images/culte-2.jpg", alt: "Prédication", description: "Le pasteur partageant la Parole" },
      { id: 3, src: "/images/culte-3.jpg", alt: "Communion", description: "Partage de la Sainte Cène" },
      { id: 4, src: "/images/culte-4.jpg", alt: "Baptême", description: "Cérémonie de baptême" },
      { id: 5, src: "/images/culte-5.jpg", alt: "Chorale", description: "La chorale pendant un service" },
      { id: 6, src: "/images/culte-6.jpg", alt: "Instruments", description: "Les musiciens en action" }
    ]
  },
  {
    id: "evenements",
    name: "Événements",
    images: [
      { id: 7, src: "/images/event-1.jpg", alt: "Fête de Noël", description: "Célébration de Noël avec la communauté" },
      { id: 8, src: "/images/event-2.jpg", alt: "Pâques", description: "Service spécial de Pâques" },
      { id: 9, src: "/images/event-3.jpg", alt: "Conférence", description: "Conférence sur la vie chrétienne" },
      { id: 10, src: "/images/event-4.jpg", alt: "Repas communautaire", description: "Partage d'un repas après le culte" },
      { id: 11, src: "/images/event-5.jpg", alt: "Mariage", description: "Cérémonie de mariage" },
      { id: 12, src: "/images/event-6.jpg", alt: "Pentecôte", description: "Célébration de la Pentecôte" }
    ]
  },
  {
    id: "jeunesse",
    name: "Jeunesse",
    images: [
      { id: 13, src: "/images/youth-1.jpg", alt: "Groupe de jeunes", description: "Rencontre du groupe de jeunes" },
      { id: 14, src: "/images/youth-2.jpg", alt: "Camp d'été", description: "Activités pendant le camp d'été" },
      { id: 15, src: "/images/youth-3.jpg", alt: "École du dimanche", description: "Les enfants pendant l'école du dimanche" },
      { id: 16, src: "/images/youth-4.jpg", alt: "Activité sportive", description: "Tournoi de football organisé par la jeunesse" },
      { id: 17, src: "/images/youth-5.jpg", alt: "Soirée louange", description: "Soirée de louange avec les jeunes" },
      { id: 18, src: "/images/youth-6.jpg", alt: "Projet caritatif", description: "Jeunes participant à un projet d'entraide" }
    ]
  },
  {
    id: "batiment",
    name: "Notre bâtiment",
    images: [
      { id: 19, src: "/images/building-1.jpg", alt: "Façade", description: "Vue extérieure de notre église" },
      { id: 20, src: "/images/building-2.jpg", alt: "Sanctuaire", description: "L'intérieur du sanctuaire" },
      { id: 21, src: "/images/building-3.jpg", alt: "Salle communautaire", description: "Notre salle pour les activités communautaires" },
      { id: 22, src: "/images/building-4.jpg", alt: "Jardin", description: "Le jardin de l'église" },
      { id: 23, src: "/images/building-5.jpg", alt: "Rénovations", description: "Travaux de rénovation récents" },
      { id: 24, src: "/images/building-6.jpg", alt: "Bibliothèque", description: "Notre bibliothèque communautaire" }
    ]
  }
]; 