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
 * Interface pour les échos de l'église
 */
export interface Echo {
  id: string;
  title: string;
  date: Date;
  content: string;
  imageUrl?: string;
  pdfUrl?: string;
}

/**
 * Types représentant les articles du blog
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  authorImage?: string;
  category: string;
  date: string;
  readTime: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
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