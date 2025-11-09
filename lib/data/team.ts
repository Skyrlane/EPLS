import { TeamMember } from "@/types";

/**
 * Liste des membres de l'équipe pastorale et des responsables
 */
const teamMembers: TeamMember[] = [
  {
    id: "pasteur-jean",
    name: "Jean Martin",
    role: "Pasteur principal",
    bio: "Pasteur de l'Église Protestante Libre de Saint-Maur depuis 2015, Jean est diplômé de la Faculté de Théologie Évangélique de Vaux-sur-Seine. Passionné par l'enseignement biblique et l'accompagnement pastoral, il a à cœur de voir chaque personne grandir dans sa foi et développer une relation authentique avec Dieu.",
    imageUrl: "/images/team/pasteur-jean.jpg"
  },
  {
    id: "marie-durand",
    name: "Marie Durand",
    role: "Responsable jeunesse",
    bio: "Responsable du ministère jeunesse depuis 2019, Marie coordonne les activités pour les enfants, adolescents et jeunes adultes. Avec une formation en éducation et animation, elle accompagne les jeunes dans leur parcours spirituel avec créativité et dynamisme.",
    imageUrl: "/images/team/marie-durand.jpg"
  },
  {
    id: "robert-leclerc",
    name: "Robert Leclerc",
    role: "Ancien & Trésorier",
    bio: "Membre de l'église depuis sa fondation, Robert apporte sa sagesse et son expérience au conseil des anciens. En tant que trésorier, il veille sur les finances de l'église avec intégrité et rigueur, s'assurant que les ressources sont utilisées fidèlement pour la mission de l'église.",
    imageUrl: "/images/team/robert-leclerc.jpg"
  },
  {
    id: "sophie-bernard",
    name: "Sophie Bernard",
    role: "Responsable de louange",
    bio: "Musicienne accomplie, Sophie coordonne les équipes de louange de notre église depuis 2017. Elle s'investit pour que les moments de culte soient des temps de rencontre authentique avec Dieu à travers la musique et l'adoration communautaire.",
    imageUrl: "/images/team/sophie-bernard.jpg"
  },
  {
    id: "philippe-moreau",
    name: "Philippe Moreau",
    role: "Ancien & Responsable mission",
    bio: "En charge des relations avec nos partenaires missionnaires, Philippe coordonne les projets de soutien aux missions locales et internationales. Son expérience en tant qu'ancien missionnaire en Afrique enrichit sa vision pour l'engagement de l'église dans le monde.",
    imageUrl: "/images/team/philippe-moreau.jpg"
  },
  {
    id: "anne-dupont",
    name: "Anne Dupont",
    role: "Diaconesse & Coordinatrice d'accueil",
    bio: "Avec un don particulier pour l'hospitalité, Anne veille à ce que chaque personne qui franchit la porte de notre église se sente accueillie et valorisée. Elle coordonne également les actions diaconales auprès des personnes dans le besoin.",
    imageUrl: "/images/team/anne-dupont.jpg"
  }
];

/**
 * Récupère l'ensemble de l'équipe
 * @returns Une promesse qui résout avec tous les membres de l'équipe
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(teamMembers);
    }, 200);
  });
}

/**
 * Récupère un membre de l'équipe par son ID
 * @param id L'identifiant du membre
 * @returns Une promesse qui résout avec le membre correspondant ou null s'il n'est pas trouvé
 */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = teamMembers.find(m => m.id === id) || null;
      resolve(member);
    }, 150);
  });
}

/**
 * Récupère les membres de l'équipe par rôle
 * @param role Le rôle recherché (ex: "Pasteur", "Ancien")
 * @returns Une promesse qui résout avec les membres correspondant au rôle
 */
export async function getTeamMembersByRole(role: string): Promise<TeamMember[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMembers = teamMembers.filter(
        member => member.role.toLowerCase().includes(role.toLowerCase())
      );
      resolve(filteredMembers);
    }, 200);
  });
}

/**
 * Récupère l'équipe pastorale (pasteurs)
 * @returns Une promesse qui résout avec les membres de l'équipe pastorale
 */
export async function getPastoralTeam(): Promise<TeamMember[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const pastoralMembers = teamMembers.filter(
        member => member.role.toLowerCase().includes("pasteur")
      );
      resolve(pastoralMembers);
    }, 200);
  });
}

/**
 * Récupère le conseil des anciens
 * @returns Une promesse qui résout avec les membres du conseil des anciens
 */
export async function getElders(): Promise<TeamMember[]> {
  // Simuler une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const elders = teamMembers.filter(
        member => member.role.toLowerCase().includes("ancien")
      );
      resolve(elders);
    }, 200);
  });
} 