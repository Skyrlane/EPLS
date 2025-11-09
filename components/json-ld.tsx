import Script from 'next/script';

interface ChurchJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours?: string[];
  telephone?: string;
  email?: string;
}

export function ChurchJsonLd({
  name = "Église Protestante Libre de Strasbourg",
  description = "Église chrétienne protestante implantée à Strasbourg, ouverte et accueillante.",
  url = "https://www.eglise-protestante-libre-strasbourg.fr",
  logo = "https://www.eglise-protestante-libre-strasbourg.fr/images/logo.png",
  address = {
    streetAddress: "1 Rue du Faubourg de Saverne",
    addressLocality: "Strasbourg",
    postalCode: "67000",
    addressCountry: "FR"
  },
  openingHours = ["Su 10:30-12:00"],
  telephone = "+33388000000",
  email = "contact@eglise-protestante-libre-strasbourg.fr"
}: ChurchJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "openingHours": openingHours,
    "telephone": telephone,
    "email": email
  };

  return (
    <Script
      id="church-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 