export interface Echo {
  id: string;
  title: string;
  date: string;
  month: string;
  year: string;
  pdfUrl: string;
  previewImage?: string;
  highlights?: string[];
}

// Organiser les échos par année
export const echosByYear: Record<string, Echo[]> = {
  "2025": [
    {
      id: "2025-01",
      title: "Echos EPLS Janvier 2025",
      date: "2025-01-01",
      month: "Janvier",
      year: "2025",
      pdfUrl: "/echoes/echo-epls-janvier-2025.pdf",
      highlights: [
        "La méditation du pasteur sur l'espérance",
        "Le programme des activités du mois",
        "Le retour sur le culte de Noël",
        "Les projets pour la nouvelle année"
      ]
    },
    {
      id: "2025-02",
      title: "Echos EPLS Février 2025",
      date: "2025-02-01",
      month: "Février",
      year: "2025",
      pdfUrl: "/echoes/echo-epls-fevrier-2025.pdf"
    },
    {
      id: "2025-03",
      title: "Echos EPLS Mars 2025",
      date: "2025-03-01",
      month: "Mars",
      year: "2025",
      pdfUrl: "/echoes/echo-epls-mars-2025.pdf"
    },
    {
      id: "2025-04",
      title: "Echos EPLS Avril 2025",
      date: "2025-04-01",
      month: "Avril",
      year: "2025",
      pdfUrl: "/echoes/echo-epls-avril-2025.pdf"
    },
    {
      id: "2025-05",
      title: "Echos EPLS Mai 2025",
      date: "2025-05-01",
      month: "Mai",
      year: "2025",
      pdfUrl: "/echoes/echo-epls-mai-2025.pdf"
    },
    {
      id: "2025-06",
      title: "Echos EPLS Juin 2025",
      date: "2025-06-01",
      month: "Juin",
      year: "2025",
      pdfUrl: "/echoes/echo-epls-juin-2025.pdf"
    }
  ],
  "2024": [
    {
      id: "2024-01",
      title: "Echos EPLS Janvier 2024",
      date: "2024-01-01",
      month: "Janvier",
      year: "2024",
      pdfUrl: "/echoes/echo-epls-janvier-2024.pdf"
    },
    {
      id: "2024-02",
      title: "Echos EPLS Février 2024",
      date: "2024-02-01",
      month: "Février",
      year: "2024",
      pdfUrl: "/echoes/echo-epls-fevrier-2024.pdf"
    },
    {
      id: "2024-03",
      title: "Echos EPLS Mars 2024",
      date: "2024-03-01",
      month: "Mars",
      year: "2024",
      pdfUrl: "/echoes/echo-epls-mars-2024.pdf"
    },
    {
      id: "2024-04",
      title: "Echos EPLS Avril 2024",
      date: "2024-04-01",
      month: "Avril",
      year: "2024",
      pdfUrl: "/echoes/echo-epls-avril-2024.pdf"
    },
    {
      id: "2024-05",
      title: "Echos EPLS Mai 2024",
      date: "2024-05-01",
      month: "Mai",
      year: "2024",
      pdfUrl: "/echoes/echo-epls-mai-2024.pdf"
    },
    {
      id: "2024-06",
      title: "Echos EPLS Juin 2024",
      date: "2024-06-01",
      month: "Juin",
      year: "2024",
      pdfUrl: "/echoes/echo-epls-juin-2024.pdf"
    }
  ]
};

// Fonction pour obtenir tous les échos dans un tableau plat
export function getAllEchos(): Echo[] {
  return Object.values(echosByYear).flat();
}

// Fonction pour obtenir le dernier écho
export function getLatestEcho(): Echo {
  const currentYear = new Date().getFullYear().toString();
  const allYears = Object.keys(echosByYear).sort().reverse();
  
  // Trouver l'année la plus récente qui a des échos
  const latestYear = allYears[0];
  const echosForYear = echosByYear[latestYear];
  
  // Trier les échos par date et prendre le plus récent
  return echosForYear.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

// Fonction pour obtenir les années disponibles
export function getAvailableYears(): string[] {
  return Object.keys(echosByYear).sort().reverse();
} 