import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  slug: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <SectionContainer background="white">
      <SectionHeader 
        title="Nos prochains événements" 
        description="Rejoignez-nous pour ces moments de communion fraternelle"
      />
      
      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  <Link href={`/culte/calendrier`} className="hover:text-primary transition-colors">
                    {event.title}
                  </Link>
                </h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{event.time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                
                <Button asChild variant="outline" size="sm">
                  <Link href={`/culte/calendrier`}>
                    Voir les détails
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg mt-8">
          <p className="text-gray-600">Aucun événement à venir pour le moment.</p>
          <p className="text-sm mt-2">Consultez notre page d'événements ou revenez plus tard.</p>
        </div>
      )}
      
      <div className="text-center mt-10">
        <Button asChild>
          <Link href="/culte/calendrier">
            Voir tous les événements
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
} 