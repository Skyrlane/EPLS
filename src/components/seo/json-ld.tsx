import Script from "next/script";

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
    name,
    description,
    url,
    logo,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    telephone,
    email,
    openingHours,
  };

  return (
    <Script
      id="church-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 