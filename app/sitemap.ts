import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.epls.fr";

  // Pages principales
  const mainRoutes = [
    "",
    "/notre-eglise",
    "/notre-eglise/qui-sommes-nous",
    "/notre-eglise/nos-valeurs",
    "/notre-eglise/ou-sommes-nous",
    "/notre-eglise/histoire",
    "/culte",
    "/culte/programme",
    "/culte/calendrier",
    "/messages",
    "/blog",
    "/galerie",
    "/echo",
    "/infos-docs",
    "/infos-docs/offrandes",
    "/infos-docs/temoignages",
    "/infos-docs/eve",
    "/infos-docs/union-eglise",
    "/infos-docs/histoire-union",
    "/infos-docs/sites-amis",
    "/infos-docs/mentions-legales",
    "/infos-docs/politique-confidentialite",
    "/infos-docs/confession-foi",
    "/contact",
  ];

  return mainRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
} 