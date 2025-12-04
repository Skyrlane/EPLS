import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { CalendarWithEvents } from "@/components/calendar/calendar-with-events";
import { SectionContainer } from "@/components/ui/section-container";

export const metadata: Metadata = {
  title: "Calendrier des événements | Église Protestante Libre de Saint-Maur",
  description: "Consultez le calendrier des événements, cultes et activités de l'Église Protestante Libre de Saint-Maur",
};

// Fonction pour créer une date avec l'année et le mois courants
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

// Exemples d'événements (à remplacer par des données réelles)
const eventsData = [
  {
    id: "1",
    title: "Culte du dimanche",
    date: new Date(currentYear, currentMonth, 7), // Premier dimanche du mois
    time: "10:30",
    location: "Temple de Saint-Maur",
    category: "Culte",
    description: "Culte dominical suivi d'un moment de partage fraternel"
  },
  {
    id: "2",
    title: "Étude biblique",
    date: new Date(currentYear, currentMonth, 10), // Mercredi du mois
    time: "19:30",
    location: "Salle communautaire",
    category: "Formation",
    description: "Étude du livre des Actes des Apôtres"
  },
  {
    id: "3",
    title: "Groupe de jeunes",
    date: new Date(currentYear, currentMonth, 14), // Deuxième dimanche du mois
    time: "18:00",
    location: "Salle jeunesse",
    category: "Jeunesse",
    description: "Soirée louange et partage pour les 15-25 ans"
  },
  {
    id: "4",
    title: "Réunion de prière",
    date: new Date(currentYear, currentMonth, 17), // Mercredi suivant
    time: "19:00",
    location: "Temple de Saint-Maur",
    category: "Prière",
    description: "Temps de prière communautaire pour l'église et les besoins du monde"
  },
  {
    id: "5",
    title: "Repas communautaire",
    date: new Date(currentYear, currentMonth, 21), // Troisième dimanche
    time: "12:30",
    location: "Salle communautaire",
    category: "Communion fraternelle",
    description: "Repas partagé après le culte - Chacun apporte un plat"
  },
  {
    id: "6",
    title: "Atelier chant et louange",
    date: new Date(currentYear, currentMonth, 24), // Mercredi suivant
    time: "20:00",
    location: "Temple de Saint-Maur",
    category: "Louange",
    description: "Répétition des chants pour le culte et apprentissage de nouveaux cantiques"
  },
  {
    id: "7",
    title: "Culte spécial témoignages",
    date: new Date(currentYear, currentMonth, 28), // Quatrième dimanche
    time: "10:30",
    location: "Temple de Saint-Maur",
    category: "Culte",
    description: "Culte avec témoignages des membres de la communauté"
  },
  {
    id: "8",
    title: "Réunion des responsables",
    date: new Date(currentYear, currentMonth, 3), // Jeudi début de mois
    time: "19:00",
    location: "Bureau pastoral",
    category: "Administration",
    description: "Réunion mensuelle des responsables d'équipes et du conseil"
  },
  {
    id: "9",
    title: "Étude biblique approfondie",
    date: new Date(currentYear, currentMonth, 11), // Jeudi milieu de mois
    time: "19:30",
    location: "Salle communautaire",
    category: "Formation",
    description: "Étude exégétique et herméneutique approfondie des textes bibliques"
  },
  {
    id: "10",
    title: "Week-end d'église",
    date: new Date(currentYear, currentMonth + 1, 5), // Début du mois prochain
    time: "9:00",
    location: "Centre de retraite 'Les Cèdres'",
    category: "Retraite",
    description: "Week-end annuel de l'église : enseignements, communion fraternelle et activités de groupe"
  }
];

export default function CalendarPage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Calendrier", href: "/calendrier", isCurrent: true }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Calendrier des cultes et événements" 
        breadcrumbs={breadcrumbItems}
      >
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
          Consultez les cultes et activités prévus dans notre église
        </p>
      </PageHeader>

      <SectionContainer>
        <CalendarWithEvents events={eventsData} />
      </SectionContainer>

      <SectionContainer className="bg-muted/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Informations pratiques</h2>
          <div className="space-y-4">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Horaires réguliers</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="font-medium mr-2">Dimanche :</span>
                  <span>Culte à 10h00</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">Mercredi :</span>
                  <span>Étude biblique à 19h30</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">Vendredi :</span>
                  <span>Groupe de jeunes (15-25 ans) à 19h00 (bimensuel)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Localisation</h3>
              <p className="mb-4">
                Tous nos événements se déroulent au temple, sauf indication contraire.
              </p>
              <p>
                <strong>Adresse :</strong> 123 Rue Exemple, 94100 Saint-Maur-des-Fossés
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
} 