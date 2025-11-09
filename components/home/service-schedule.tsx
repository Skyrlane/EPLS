import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface ServiceEvent {
  date: string;
  time: string;
  title: string;
  speaker?: string;
  special?: string;
}

interface ServiceScheduleProps {
  title?: string;
  description?: string;
  events: ServiceEvent[];
}

export function ServiceSchedule({
  title = "Horaires des cultes",
  description = "Rejoignez-nous pour nos prochains cultes",
  events,
}: ServiceScheduleProps) {
  return (
    <SectionContainer background="white">
      <SectionHeader 
        title={title} 
        description={description}
      />
      
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        {events.map((event, index) => (
          <div 
            key={index}
            className="flex flex-col md:flex-row md:items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="md:w-1/4 flex items-center space-x-3 mb-4 md:mb-0">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{formatDate(event.date)}</p>
                <p className="text-sm text-slate-500">{event.time}</p>
              </div>
            </div>
            
            <div className="md:w-2/4 mb-4 md:mb-0">
              <h3 className="font-medium">{event.title}</h3>
              {event.speaker && (
                <p className="text-sm text-slate-600">Prédicateur: {event.speaker}</p>
              )}
            </div>
            
            <div className="md:w-1/4 flex justify-start md:justify-end">
              {event.special && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {event.special}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <Button asChild>
          <Link href="/culte">
            Plus d'informations
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
} 