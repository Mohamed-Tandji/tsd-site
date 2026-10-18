import { defineRouting } from "next-intl/routing";

// Chemins internes (FR) et leur traduction en EN : /fr/a-propos ↔ /en/about
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/solutions": "/solutions",
    "/solutions/[slug]": "/solutions/[slug]",
    "/a-propos": { fr: "/a-propos", en: "/about" },
    "/equipe": { fr: "/equipe", en: "/team" },
    "/contact": "/contact",
    "/mentions-legales": { fr: "/mentions-legales", en: "/legal-notice" },
    "/confidentialite": { fr: "/confidentialite", en: "/privacy" },
  },
});

export type Pathname = keyof typeof routing.pathnames;
