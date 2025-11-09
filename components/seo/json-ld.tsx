import React from "react";

interface ChurchJsonLdProps {
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

export function ChurchJsonLd({
  name,
  description,
  url,
  logo,
  address,
  telephone,
  email,
  openingHours,
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
    "telephone": telephone,
    "email": email,
    "openingHours": openingHours
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 