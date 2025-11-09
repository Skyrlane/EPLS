import { Echo } from "@/types";

/**
 * Liste des échos (bulletins) de l'église
 */
const echos: Echo[] = [
  {
    id: "echo-2024-04",
    title: "L'Echo de l'EPLS",
    date: new Date(2024, 3, 15), // 15 avril 2024
    content: "Retrouvez dans ce numéro les dernières nouvelles de notre communauté, le calendrier des activités du mois, des témoignages inspirants et une méditation sur le thème de Pâques.",
    imageUrl: "/images/echos/echo-avril-2024.jpg",
    pdfUrl: "/documents/echo-avril-2024.pdf"
  },
  {
    id: "echo-2024-03",
    title: "L'Echo de l'EPLS",
    date: new Date(2024, 2, 15), // 15 mars 2024
    content: "Numéro spécial sur la préparation à Pâques, avec une réflexion sur le carême, les événements à venir, et les projets missionnaires soutenus par notre église.",
    imageUrl: "/images/echos/echo-mars-2024.jpg",
    pdfUrl: "/documents/echo-mars-2024.pdf"
  },
  {
    id: "echo-2024-02",
    title: "L'Echo de l'EPLS",
    date: new Date(2024, 1, 15), // 15 février 2024
    content: "Au sommaire de ce mois : retour sur la journée d'église, focus sur le ministère auprès des jeunes, et annonce des prochains événements et formations.",
    imageUrl: "/images/echos/echo-fevrier-2024.jpg",
    pdfUrl: "/documents/echo-fevrier-2024.pdf"
  },
  {
    id: "echo-2024-01",
    title: "L'Echo de l'EPLS",
    date: new Date(2024, 0, 15), // 15 janvier 2024
    content: "Premier numéro de l'année avec les vœux du conseil, le bilan des activités de Noël, et les perspectives pour cette nouvelle année.",
    imageUrl: "/images/echos/echo-janvier-2024.jpg",
    pdfUrl: "/documents/echo-janvier-2024.pdf"
  },
  {
    id: "echo-2023-12",
    title: "L'Echo de l'EPLS",
    date: new Date(2023, 11, 15), // 15 décembre 2023
    content: "Numéro spécial Noël avec le programme des célébrations, une méditation sur l'incarnation, et les témoignages des membres de l'église.",
    imageUrl: "/images/echos/echo-decembre-2023.jpg",
    pdfUrl: "/documents/echo-decembre-2023.pdf"
  },
  {
    id: "echo-2023-11",
    title: "L'Echo de l'EPLS",
    date: new Date(2023, 10, 15), // 15 novembre 2023
    content: "Découvrez les actions de solidarité en préparation pour l'hiver, le retour sur le weekend de retraite spirituelle, et les nouvelles des groupes de maison.",
    imageUrl: "/images/echos/echo-novembre-2023.jpg",
    pdfUrl: "/documents/echo-novembre-2023.pdf"
  }
];

/**
 * Récupère le dernier écho (bulletin) de l'église
 * @returns Une promesse qui résout avec le dernier écho
 */
export async function getLatestEcho(): Promise<Echo> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trier les échos par date (du plus récent au plus ancien)
      const sortedEchos = [...echos].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      
      // Retourner le premier (le plus récent)
      resolve(sortedEchos[0]);
    }, 200);
  });
}

/**
 * Récupère les échos par année
 * @param year L'année des échos à récupérer (format: "2024")
 * @returns Une promesse qui résout avec les échos de l'année spécifiée
 */
export async function getEchosByYear(year: string): Promise<Echo[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrer les échos par année
      const yearNumber = parseInt(year);
      const filteredEchos = echos.filter(
        echo => echo.date.getFullYear() === yearNumber
      );
      
      // Trier les échos par date (du plus récent au plus ancien)
      const sortedEchos = [...filteredEchos].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      
      resolve(sortedEchos);
    }, 200);
  });
}

/**
 * Récupère tous les échos
 * @param limit Nombre maximal d'échos à récupérer
 * @returns Une promesse qui résout avec tous les échos
 */
export async function getAllEchos(limit?: number): Promise<Echo[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trier les échos par date (du plus récent au plus ancien)
      const sortedEchos = [...echos].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      
      // Limiter le nombre d'échos si spécifié
      const result = limit ? sortedEchos.slice(0, limit) : sortedEchos;
      
      resolve(result);
    }, 200);
  });
}

/**
 * Récupère un écho par son ID
 * @param id L'identifiant de l'écho
 * @returns Une promesse qui résout avec l'écho correspondant ou null s'il n'est pas trouvé
 */
export async function getEchoById(id: string): Promise<Echo | null> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const echo = echos.find(e => e.id === id) || null;
      resolve(echo);
    }, 150);
  });
} 