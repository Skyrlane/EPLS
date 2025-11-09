import Script from "next/script";
import { Event } from "@/types";

interface EventJsonLdProps {
  event: Event;
  organizationName: string;
  organizationUrl: string;
  locationName: string;
  locationAddress: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
}

export function EventJsonLd({
  event,
  organizationName,
  organizationUrl,
  locationName,
  locationAddress,
}: EventJsonLdProps) {
  // Convertir la date et l'heure au format ISO
  const dateTimeString = `${event.date.toISOString().split('T')[0]} ${event.time?.split('-')[0]?.trim()}`;
  const eventDate = new Date(dateTimeString);
  const startDate = eventDate.toISOString();
  
  // Estimer l'heure de fin (ajouter 1h30 par défaut)
  const endDate = new Date(eventDate.getTime() + 90 * 60000).toISOString();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || `${event.title} à l'Église Protestante Libre de Saint-Maur`,
    startDate,
    endDate,
    location: {
      "@type": "Place",
      name: locationName,
      address: {
        "@type": "PostalAddress",
        ...locationAddress,
      },
    },
    organizer: {
      "@type": "Organization",
      name: organizationName,
      url: organizationUrl,
    },
    image: event.imageUrl || `${organizationUrl}/og-image.jpg`,
    url: `${organizationUrl}/events/${event.id}`,
  };

  return (
    <Script
      id={`event-jsonld-${event.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 