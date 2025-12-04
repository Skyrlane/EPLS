import { Event } from "@/types";

/**
 * Liste des événements à venir
 */
const events: Event[] = [
  {
    id: "1",
    title: "Culte dominical",
    date: new Date(2024, 3, 21), // 21 avril 2024
    time: "10h00",
    location: "Temple de Saint-Maur",
    description: "Culte hebdomadaire avec prédication sur le thème de la grâce.",
    type: "culte"
  },
  {
    id: "2",
    title: "Étude biblique",
    date: new Date(2024, 3, 24), // 24 avril 2024
    time: "19h00",
    location: "Salle paroissiale",
    description: "Étude du livre des Actes, chapitre 8.",
    type: "étude"
  },
  {
    id: "3",
    title: "Groupe de prière",
    date: new Date(2024, 3, 26), // 26 avril 2024
    time: "18h30",
    location: "Temple de Saint-Maur",
    description: "Temps de prière communautaire pour l'église et ses missions.",
    type: "prière"
  },
  {
    id: "4",
    title: "Rencontre des jeunes",
    date: new Date(2024, 3, 27), // 27 avril 2024
    time: "19h00",
    location: "Salle des jeunes",
    description: "Soirée de louange et d'échange pour les 15-25 ans.",
    type: "jeunesse"
  },
  {
    id: "5",
    title: "Café-rencontre",
    date: new Date(2024, 3, 28), // 28 avril 2024
    time: "14h30",
    location: "Café de l'église",
    description: "Moment de partage et de convivialité ouvert à tous.",
    type: "autre"
  }
];

/**
 * Récupère les événements à venir
 * @param limit Nombre maximal d'événements à récupérer
 * @returns Liste des événements à venir
 */
export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = limit ? events.slice(0, limit) : events;
      resolve(result);
    }, 100);
  });
}

/**
 * Récupère un événement par son ID
 * @param id L'identifiant de l'événement
 * @returns L'événement correspondant ou undefined si non trouvé
 */
export async function getEventById(id: string): Promise<Event | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = events.find((e) => e.id === id);
      resolve(event);
    }, 100);
  });
}

/**
 * Récupère les événements par type
 * @param type Le type d'événement à filtrer
 * @returns Liste des événements correspondant au type spécifié
 */
export async function getEventsByType(type: string): Promise<Event[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredEvents = events.filter((event) => event.type === type);
      resolve(filteredEvents);
    }, 100);
  });
} 