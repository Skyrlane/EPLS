import { Message, MessageExtended, MessageFilterOptions } from "@/types";
import { compareDesc, parseISO } from 'date-fns';

/**
 * Récupère le dernier message
 * @returns Le dernier message
 */
export async function getLatestMessage(): Promise<Message> {
  // Dans un environnement réel, ceci appellerait une API ou Firestore
  // Ici, nous retournons une donnée statique pour la démonstration
  
  return {
    id: "msg-2023-12-24",
    title: "La naissance de Jésus et son importance aujourd'hui",
    date: new Date(2023, 11, 24), // 24 décembre 2023
    speaker: "Pasteur Jean Martin",
    description: "Dans ce message de Noël, nous explorons le récit de la naissance de Jésus et sa signification pour notre vie contemporaine. Comment cet événement historique peut-il transformer notre vision du monde et notre quotidien ?",
    audioUrl: "/audio/message-noel-2023.mp3",
    thumbnailUrl: undefined,
    tags: ["Noël", "Incarnation", "Espérance"]
  };
}

/**
 * Liste des messages récents
 */
const messages: Message[] = [
  {
    id: "message-1",
    title: "La grâce qui transforme",
    date: new Date(2023, 4, 21), // 21 mai 2023
    speaker: "Pasteur Jean Martin",
    audioUrl: "/audios/message-1.mp3",
    scripture: "Éphésiens 2:8-10",
    description: "Une exploration profonde de comment la grâce de Dieu transforme nos vies quand nous l'acceptons pleinement.",
    tags: ["grâce", "salut", "transformation"]
  },
  {
    id: "message-2",
    title: "L'amour inconditionnel de Christ",
    date: new Date(2023, 4, 14), // 14 mai 2023
    speaker: "Pasteur Jean Martin",
    audioUrl: "/audios/message-2.mp3",
    scripture: "1 Corinthiens 13:4-7",
    description: "Découvrez comment l'amour de Christ peut nous permettre d'aimer les autres inconditionnellement.",
    tags: ["amour", "relations", "christ"]
  },
  {
    id: "message-3",
    title: "La foi qui déplace les montagnes",
    date: new Date(2023, 4, 7), // 7 mai 2023
    speaker: "Anne Dupont",
    audioUrl: "/audios/message-3.mp3",
    scripture: "Matthieu 17:20",
    description: "Comment développer une foi qui peut surmonter tous les obstacles de la vie.",
    tags: ["foi", "confiance", "obstacles"]
  },
  {
    id: "message-4",
    title: "Les fruits de l'Esprit",
    date: new Date(2023, 3, 30), // 30 avril 2023
    speaker: "Marie Durand",
    audioUrl: "/audios/message-4.mp3",
    scripture: "Galates 5:22-23",
    description: "Une étude approfondie des neuf fruits de l'Esprit et comment les cultiver dans notre vie quotidienne.",
    tags: ["saint-esprit", "caractère", "croissance"]
  },
  {
    id: "message-5",
    title: "Le royaume de Dieu parmi nous",
    date: new Date(2023, 3, 23), // 23 avril 2023
    speaker: "Pasteur Jean Martin",
    audioUrl: "/audios/message-5.mp3",
    scripture: "Luc 17:20-21",
    description: "Comment reconnaître et participer au royaume de Dieu déjà présent dans notre monde.",
    tags: ["royaume", "présence", "mission"]
  },
  {
    id: "message-6",
    title: "Le combat spirituel",
    date: new Date(2023, 3, 16), // 16 avril 2023
    speaker: "Philippe Moreau",
    audioUrl: "/audios/message-6.mp3",
    scripture: "Éphésiens 6:10-18",
    description: "Comprendre la réalité du combat spirituel et s'équiper de l'armure de Dieu.",
    tags: ["combat", "victoire", "armure"]
  },
  {
    id: "message-7",
    title: "La prière qui change tout",
    date: new Date(2023, 3, 9), // 9 avril 2023
    speaker: "Pasteur Jean Martin",
    audioUrl: "/audios/message-7.mp3",
    scripture: "Jacques 5:16-18",
    description: "Découvrez le pouvoir transformateur de la prière fervente dans votre vie quotidienne.",
    tags: ["prière", "intercession", "puissance"]
  },
  {
    id: "message-8",
    title: "Vivre selon l'Esprit",
    date: new Date(2023, 3, 2), // 2 avril 2023
    speaker: "Anne Dupont",
    audioUrl: "/audios/message-8.mp3",
    scripture: "Romains 8:1-17",
    description: "Comment permettre à l'Esprit Saint de diriger notre vie pour une marche victorieuse.",
    tags: ["saint-esprit", "liberté", "vie"]
  }
];

/**
 * Récupère les messages récents
 * @param limit - Nombre maximum de messages à récupérer
 * @returns Une promesse qui résout avec un tableau de messages
 */
export async function getRecentMessages(limit?: number): Promise<Message[]> {
  // Simule une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trie les messages par date (du plus récent au plus ancien)
      const sortedMessages = [...messages].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      
      // Limite le nombre de messages si spécifié
      const result = limit ? sortedMessages.slice(0, limit) : sortedMessages;
      
      resolve(result);
    }, 300); // Délai simulé de 300ms
  });
}

/**
 * Récupère tous les messages
 * @returns Liste de tous les messages
 */
export function getMessages(): MessageExtended[] {
  // Dans un environnement réel, ceci appellerait une API ou Firestore
  // Ici, nous retournons des données statiques pour la démonstration
  
  const messages: MessageExtended[] = [
    {
      id: "msg-2023-12-24",
      title: "La naissance de Jésus et son importance aujourd'hui",
      date: new Date(2023, 11, 24), // 24 décembre 2023
      speaker: "Pasteur Samuel Dupont",
      description: "Dans ce message de Noël, nous explorons le récit de la naissance de Jésus et sa signification pour notre vie contemporaine. Comment cet événement historique peut-il transformer notre vision du monde et notre quotidien ?",
      audioUrl: "/audio/message-noel-2023.mp3",
      thumbnailUrl: "/images/messages/noel-2023.jpg",
      scripture: "Luc 2:1-20",
      tags: ["Noël", "Incarnation", "Espérance"],
      videoUrl: "/video/message-noel-2023.mp4",
      contentHtml: "<p>Contenu du message...</p>",
      downloadUrl: "/downloads/message-noel-2023.pdf"
    },
    {
      id: "msg-2023-12-17",
      title: "Vivre l'attente avec espérance",
      date: new Date(2023, 11, 17), // 17 décembre 2023
      speaker: "Pasteur Samuel Dupont",
      description: "Comment vivre les temps d'attente dans notre vie ? L'Avent nous enseigne à attendre avec espérance et à nous préparer à la venue du Seigneur.",
      audioUrl: "/audio/message-avent-2023.mp3",
      thumbnailUrl: "/images/messages/avent-2023.jpg",
      scripture: "Romains 8:18-25",
      tags: ["Avent", "Espérance", "Attente"],
      downloadUrl: "/downloads/message-avent-2023.pdf"
    },
    {
      id: "msg-2023-12-10",
      title: "Les prophéties messianiques accomplies",
      date: new Date(2023, 11, 10), // 10 décembre 2023
      speaker: "Pasteur Thomas Leroux",
      description: "Étude approfondie des prophéties de l'Ancien Testament concernant le Messie et leur accomplissement en Jésus-Christ. Une confirmation puissante de la fidélité de Dieu à ses promesses.",
      audioUrl: "/audio/message-propheties-2023.mp3",
      thumbnailUrl: "/images/messages/propheties-2023.jpg",
      scripture: "Ésaïe 53",
      tags: ["Prophéties", "Ancien Testament", "Messie"]
    },
    {
      id: "msg-2023-12-03",
      title: "La puissance de la reconnaissance",
      date: new Date(2023, 11, 3), // 3 décembre 2023
      speaker: "Pasteur Samuel Dupont",
      description: "Exploration biblique de l'attitude de reconnaissance et de gratitude, et comment elle peut transformer notre relation avec Dieu et avec les autres.",
      audioUrl: "/audio/message-gratitude-2023.mp3",
      thumbnailUrl: "/images/messages/gratitude-2023.jpg",
      scripture: "Psaume 103",
      tags: ["Gratitude", "Reconnaissance", "Prière"]
    },
    {
      id: "msg-2023-11-26",
      title: "Le sermon sur la montagne",
      date: new Date(2023, 10, 26), // 26 novembre 2023
      speaker: "Pasteur Samuel Dupont",
      description: "Premier message d'une série sur le Sermon sur la montagne. Comment ces enseignements de Jésus révolutionnent-ils notre compréhension de la vie spirituelle et morale ?",
      audioUrl: "/audio/message-sermon-montagne-1.mp3",
      thumbnailUrl: "/images/messages/sermon-montagne-1.jpg",
      scripture: "Matthieu 5:1-12",
      tags: ["Jésus", "Enseignement", "Béatitudes"]
    },
    {
      id: "msg-2023-11-19",
      title: "L'Église, corps du Christ",
      date: new Date(2023, 10, 19), // 19 novembre 2023
      speaker: "Ancien Pierre Martin",
      description: "Une étude sur la nature de l'Église comme corps du Christ, et l'importance de l'unité dans la diversité pour l'accomplissement de la mission de Dieu.",
      audioUrl: "/audio/message-eglise-corps-christ.mp3",
      thumbnailUrl: "/images/messages/eglise-corps-christ.jpg",
      scripture: "1 Corinthiens 12:12-31",
      tags: ["Église", "Unité", "Corps du Christ"]
    },
    {
      id: "msg-2023-11-12",
      title: "La prière d'intercession",
      date: new Date(2023, 10, 12), // 12 novembre 2023
      speaker: "Pasteur Samuel Dupont",
      description: "L'importance et le pouvoir de la prière d'intercession dans la vie chrétienne et pour l'avancement du Royaume de Dieu.",
      audioUrl: "/audio/message-priere-intercession.mp3",
      thumbnailUrl: "/images/messages/priere-intercession.jpg",
      scripture: "Éphésiens 6:18-20",
      tags: ["Prière", "Intercession", "Combat spirituel"]
    },
    {
      id: "msg-2023-11-05",
      title: "Les fruits de l'Esprit",
      date: new Date(2023, 10, 5), // 5 novembre 2023
      speaker: "Pasteur Thomas Leroux",
      description: "Comment l'Esprit Saint produit-il son fruit dans la vie du croyant ? Une exploration des neuf aspects du fruit de l'Esprit et de leur développement dans notre vie.",
      audioUrl: "/audio/message-fruits-esprit.mp3",
      thumbnailUrl: "/images/messages/fruits-esprit.jpg",
      scripture: "Galates 5:22-23",
      tags: ["Saint-Esprit", "Fruit", "Caractère"]
    }
  ];

  return messages;
}

/**
 * Récupère un message par son ID
 * @param id - L'identifiant du message
 * @returns Une promesse qui résout avec le message ou null s'il n'est pas trouvé
 */
export async function getMessageById(id: string): Promise<Message | null> {
  // Simule une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const message = messages.find(msg => msg.id === id) || null;
      resolve(message);
    }, 200);
  });
}

/**
 * Récupère les messages par prédicateur
 * @param speaker - Le nom du prédicateur
 * @returns Une promesse qui résout avec un tableau de messages
 */
export async function getMessagesBySpeaker(speaker: string): Promise<Message[]> {
  // Simule une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMessages = messages.filter(
        msg => msg.speaker.toLowerCase().includes(speaker.toLowerCase())
      );
      
      // Trie les messages par date (du plus récent au plus ancien)
      const sortedMessages = [...filteredMessages].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      
      resolve(sortedMessages);
    }, 300);
  });
}

/**
 * Récupère les messages par tag
 * @param tag - Le tag à rechercher
 * @returns Une promesse qui résout avec un tableau de messages
 */
export async function getMessagesByTag(tag: string): Promise<Message[]> {
  // Simule une requête asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMessages = messages.filter(
        msg => msg.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      
      // Trie les messages par date (du plus récent au plus ancien)
      const sortedMessages = [...filteredMessages].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      
      resolve(sortedMessages);
    }, 300);
  });
}

/**
 * Filtre les messages selon plusieurs critères
 * @param options - Les options de filtrage
 * @returns Une promesse qui résout avec un tableau de messages filtrés
 */
export const filterMessages = (messages: Message[], options: MessageFilterOptions = {}): Message[] => {
  const { speaker, tag, dateStart, dateEnd, sortBy = 'date', sortOrder = 'desc' } = options;

  let filtered = [...messages];

  if (speaker) {
    filtered = filtered.filter(message => message.speaker === speaker);
  }

  if (tag) {
    filtered = filtered.filter(message => message.tags && message.tags.includes(tag));
  }

  if (dateStart) {
    const startDate = dateStart instanceof Date ? dateStart : parseISO(String(dateStart));
    filtered = filtered.filter(message => {
      return message.date >= startDate;
    });
  }

  if (dateEnd) {
    const endDate = dateEnd instanceof Date ? dateEnd : parseISO(String(dateEnd));
    filtered = filtered.filter(message => {
      return message.date <= endDate;
    });
  }

  // Tri
  filtered.sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }
    
    if (sortBy === 'title' || sortBy === 'speaker') {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      return sortOrder === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }

    return 0;
  });

  return filtered;
}; 