import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar } from "lucide-react";

interface WorshipTimesProps {
  title?: string;
  description?: string;
  regularTime?: string;
  location?: string;
  address?: string;
  daysDescription?: string;
  specialNote?: string;
  mapLink?: string;
}

export function WorshipTimes({
  title = "Horaires des cultes",
  description = "Rejoignez-nous pour célébrer ensemble",
  regularTime = "10h00",
  location = "Temple de Saint-Maur",
  address = "123 Avenue de l'Église, 94100 Saint-Maur-des-Fossés",
  daysDescription = "Tous les dimanches",
  specialNote = "Accueil des enfants pour l'école du dimanche pendant le culte",
  mapLink = "https://maps.google.com",
}: WorshipTimesProps) {
  
  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return (
    <SectionContainer background="light">
      <SectionHeader 
        title={title} 
        description={description}
      />
      
      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Horaire habituel</h3>
              <p className="text-slate-600">{daysDescription} à {regularTime}</p>
              {specialNote && (
                <p className="text-sm text-slate-500 mt-2 italic">{specialNote}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Lieu de culte</h3>
              <p className="text-slate-600">{location}</p>
              <p className="text-sm text-slate-500">{address}</p>
              {mapLink && (
                <Link 
                  href={mapLink}
                  className="inline-flex items-center text-primary hover:underline mt-2 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir sur la carte
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <Button asChild>
              <Link href="/culte">
                <Calendar className="h-4 w-4 mr-2" />
                Voir le calendrier complet
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-primary text-white p-4 text-center">
            <h3 className="text-xl font-semibold">Cultes du mois de {currentMonth}</h3>
          </div>
          <div className="divide-y">
            {generateSampleWorshipDates(4).map((date, index) => (
              <div key={index} className="flex items-center p-4 hover:bg-gray-50">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-primary">{date.day}</span>
                </div>
                <div>
                  <p className="font-medium">{date.format}</p>
                  <p className="text-sm text-muted-foreground">{regularTime} - Culte dominical</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

// Fonction pour générer des exemples de dates de culte (les dimanches du mois courant)
function generateSampleWorshipDates(count: number) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const days = [];
  const date = new Date(currentYear, currentMonth, 1);
  
  // Trouver le premier dimanche du mois
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }
  
  // Ajouter les dimanches suivants
  for (let i = 0; i < count; i++) {
    if (date.getMonth() === currentMonth) {
      days.push({
        day: date.getDate(),
        format: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
      });
    }
    
    // Passer au dimanche suivant
    date.setDate(date.getDate() + 7);
  }
  
  return days;
} 