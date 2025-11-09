import { Metadata } from "next";

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = "website",
  canonical,
  noIndex = false,
}: MetaTagsProps): Metadata {
  // Construire l'URL canonique complète
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.epls.fr";
  const fullCanonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  
  // Construire l'URL de l'image OG complète
  const fullOgImageUrl = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "EPLS" }],
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      type: ogType,
      locale: "fr_FR",
      url: fullCanonicalUrl || baseUrl,
      title,
      description,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "Église Protestante Libre de Saint-Maur",
    },
    alternates: {
      canonical: fullCanonicalUrl,
    },
  };
} 