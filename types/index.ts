/**
 * Interfaces des membres de l'église
 */
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate?: Date;
  joinDate?: Date;
  role?: string;
  imageUrl?: string;
  isActive: boolean;
  ministry?: string[];
}

/**
 * Interface pour les documents partagés
 */
export interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'other';
  category: 'echo' | 'bulletin' | 'resource' | 'other';
  description?: string;
  uploadDate: Date;
  author?: string;
  thumbnailUrl?: string;
  isPublic: boolean;
}

/**
 * Interface pour les événements du calendrier
 */
export interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  organizer?: string;
  category?: string;
  isHighlighted?: boolean;
}

/**
 * Interface représentant un message (prédication)
 */
export interface Message {
  id: string;
  title: string;
  preacher: string;
  date: Date;
  audioUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  description?: string;
  scripture?: string;
  series?: string;
  tags?: string[];
  thumbnailUrl?: string;
}

/**
 * Interface représentant un message complet avec détails additionnels
 */
export interface MessageExtended extends Message {
  contentHtml?: string;
  downloadUrl?: string;
  relatedMessages?: string[];
}

/**
 * Options de filtrage des messages
 */
export interface MessageFilterOptions {
  speaker?: string;
  tag?: string;
  dateStart?: Date | string;
  dateEnd?: Date | string;
  sortBy?: 'date' | 'title' | 'speaker';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interface pour les utilisateurs (authentification)
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  roles: string[];
  isAdmin?: boolean;
  isEmailVerified?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  memberInfo?: Member;
}

/**
 * Interface pour les groupes/ministères
 */
export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  members: string[];
  meetingTime?: string;
  meetingDay?: string;
  meetingLocation?: string;
  imageUrl?: string;
}

/**
 * Interface pour les filtres génériques
 */
export interface FilterOption {
  id: string;
  name: string;
  value: string;
  count?: number;
}

/**
 * Interface pour les échos de l'église (bulletin mensuel PDF)
 */
export interface Echo {
  id: string;
  title: string;              // Ex: "L'Écho - Janvier 2025"
  description?: string;        // (optionnel) Court résumé
  month: number;              // 1-12
  year: number;               // 2025
  edition?: string;           // Ex: "Janvier 2025" (pour compatibilité)
  pdfUrl: string;             // URL Firebase Storage
  pdfFileName?: string;       // Nom du fichier PDF
  coverUrl?: string;          // (optionnel) Image de couverture (alias)
  coverImageUrl?: string;     // (optionnel) Image de couverture
  fileSize?: number;          // Taille du PDF en bytes
  isActive?: boolean;         // true = visible sur le site
  publishedAt: Date;          // Date de publication
  createdAt?: Date;           // Date de création
  updatedAt?: Date;           // Date de mise à jour
  status: "published" | "draft";
}

/**
 * Tag de blog avec couleur
 */
export interface BlogTag {
  id: string;
  label: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Article importé depuis Airtable
 */
export interface AirtableArticle {
  id: string;
  titre: string;
  contenu: string;
  resume: string;
  imageUrl: string;
  dateRedaction: string;
  biblicalReference?: string;
}

/**
 * Article de blog complet
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  coverImageUrl: string;
  coverImageMobile?: string;
  coverImageDesktop?: string;
  author: string;
  tag: string;
  biblicalReference?: string;
  readingTime: number;
  status: "draft" | "published" | "scheduled";
  scheduledFor?: Date;
  publishedAt?: Date;
  isActive: boolean;
  
  // Tracking Airtable
  airtableSourceId?: string;
  airtablePublishedId?: string;
  syncedToAirtable: boolean;
  lastSyncedAt?: Date;
  
  // Stats
  views: number;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour les items de breadcrumb
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * Interface pour les membres de l'équipe
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
}

export interface Church {
  name: string;
  description: string;
  url: string;
  logo: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email: string;
  openingHours: string[];
}

/**
 * Interface pour les annonces importantes et événements
 */
export interface Announcement {
  id: string;
  title: string;              // "L'Idégé de Mi : Les trois yeux de Minéloïda"
  date: Date;                 // Date complète de l'événement
  time: string;               // "20h00"

  location: {
    name: string;             // "Centre Culturel de Brumath"
    address: string;          // "29 Rue André Malraux, 67380 Brumath"
  };

  content?: string;           // Description longue (optionnel)
  details?: string[];         // Liste à puces ["Chants", "Prédication", etc.]

  pricing?: {                 // Optionnel, pour événements payants
    free?: string;            // "Gratuit jusqu'à 8 ans"
    child?: string;           // "9-17 ans : 5 €"
    student?: string;         // "Étudiants : 10 €"
    adult?: string;           // "Adultes : 15 €"
  };

  type: "concert" | "culte" | "spectacle" | "reunion" | "formation" | "autre";
  tag: string;                // "Concert", "Culte", "Spectacle"
  tagColor: string;           // Couleur du tag (#3B82F6, #10B981, etc.)

  isPinned: boolean;          // Épinglé en haut ?
  priority: number;           // Ordre d'affichage (1 = en haut)
  isActive: boolean;          // Visible ou non
  expiresAt?: Date;           // Auto-expire après l'événement

  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
} 

/**
 * Interface pour une ligne du planning des cultes
 */
export interface PlanningRow {
  date: string;
  presidence: string;
  musique: string;
  predicateur: string;
  groupeEDD: string;
  accueil: string;
  projection: string;
  zoom: string;
  menage: string;
  observations: string;
}

/**
 * Interface pour le planning mensuel des cultes
 */
export interface Planning {
  id: string;
  month: number;        // 1-12
  year: number;         // 2025
  title: string;        // "Novembre 2025"
  rows: PlanningRow[];  // Lignes du tableau
  isActive: boolean;    // true = visible
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour un message/prédication YouTube
 */
export interface MessageItem {
  id: string;
  title: string;                    // "Le message de la semaine dernière"
  description: string;              // Description courte
  youtubeUrl: string;               // "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  youtubeId: string;                // "dQw4w9WgXcQ"
  embedUrl: string;                 // "https://www.youtube.com/embed/dQw4w9WgXcQ"
  thumbnailUrl: string;             // Thumbnail YouTube (auto)
  coverImageUrl?: string;           // Image custom uploadée (optionnel, prioritaire)
  duration?: string;                // "45:20" format MM:SS
  date: Date;                       // Date de la prédication
  pastor: string;                   // "Pasteur Robert"
  tag: string;                      // "Foi", "Grâce", "Évangile", etc.
  tagColor: string;                 // Code couleur hexa
  isActive: boolean;                // true = visible
  status: "published" | "draft";
  views?: number;                   // Nombre de vues (optionnel)
  createdAt: Date;
  updatedAt: Date;
}
