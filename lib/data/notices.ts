import { Notice } from "@/components/home/important-notices";

/**
 * Données des annonces importantes de l'église
 * Ces annonces sont affichées sur la page d'accueil et sur la page du calendrier
 */
export const importantNotices: Notice[] = [
  {
    id: "notice1",
    title: "Ce dimanche a-m 16 mars 2025 — vers 16h : Assemblée Générale ordinaire",
    date: "16 mars 2025",
    time: "16h00",
    description: "Tous les membres sont invités à participer à notre Assemblée Générale annuelle pour faire le point sur la vie de l'église.",
    link: "/culte/calendrier?eventId=assemblee-generale-2025",
    isHighPriority: true,
  },
  {
    id: "notice2",
    title: "Formation au partage de la foi",
    date: "5 avril 2025",
    time: "14h30 - 17h00",
    description: "Session de formation pratique pour apprendre à partager sa foi au quotidien.",
    link: "/culte/calendrier?eventId=formation-evangelisation",
    isHighPriority: false,
  },
  {
    id: "notice3",
    title: "Collecte alimentaire pour les étudiants",
    date: "Tout le mois d'avril",
    description: "Apportez des denrées non périssables pour aider les étudiants en difficulté.",
    link: "/culte/calendrier?eventId=collecte-alimentaire",
    isHighPriority: false,
  },
]; 