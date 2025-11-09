import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  calendarLink: string;
}

export function EventCard({ event, calendarLink }: EventCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {event.title}
        </CardTitle>
        <CardDescription>
          {event.date} à {event.time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full border-2 border-primary text-primary hover:bg-primary/10"
        >
          <Link href={calendarLink}>Voir le calendrier complet</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 