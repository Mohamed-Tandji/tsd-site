import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Adresse publique du site (production : https://tsdsystems.net)
export const SITE_URL = (process.env.SITE_URL || "https://tsdsystems.net").replace(/\/$/, "");

type Href = Parameters<typeof getPathname>[0]["href"];

export function localizedUrl(locale: string, href: Href) {
  return SITE_URL + getPathname({ locale, href });
}

// Titre, description, adresse canonique, hreflang et balises de partage d'une page
// title absent : titre par défaut du site (accueil), fourni par shareTitle pour les balises de partage
export function pageMetadata({ locale, href, title, description, shareTitle }: { locale: string; href: Href; title?: string; description: string; shareTitle?: string }): Metadata {
  const url = localizedUrl(locale, href);
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, href)]));

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: { ...languages, "x-default": localizedUrl(routing.defaultLocale, href) } },
    openGraph: {
      type: "website",
      siteName: "TSD Systems",
      url,
      title: shareTitle ?? (title ? `${title} – TSD Systems` : "TSD Systems"),
      description,
      locale: locale === "en" ? "en_US" : "fr_FR",
      alternateLocale: locale === "en" ? ["fr_FR"] : ["en_US"],
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "TSD Systems" }],
    },
    twitter: { card: "summary_large_image", description, images: [`${SITE_URL}/og-image.png`] },
  };
}
