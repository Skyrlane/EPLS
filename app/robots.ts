import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/membres", "/connexion", "/mot-de-passe-oublie"],
    },
    sitemap: "https://www.epls.fr/sitemap.xml",
  };
} 