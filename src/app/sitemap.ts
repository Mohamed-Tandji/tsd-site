import type { MetadataRoute } from "next";
import { routing, type Pathname } from "@/i18n/routing";
import { getSolutions } from "@/lib/content";
import { localizedUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGES: Exclude<Pathname, "/solutions/[slug]">[] = ["/", "/solutions", "/a-propos", "/equipe", "/contact", "/mentions-legales", "/confidentialite"];

type Href = Parameters<typeof localizedUrl>[1];

// Une entrée par page et par langue, avec ses équivalents (hreflang)
function entries(href: Href, priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, href)]));
  return routing.locales.map((locale) => ({ url: localizedUrl(locale, href), alternates: { languages }, priority }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const solutions = await getSolutions("fr").catch(() => []);
  return [
    ...PAGES.flatMap((p) => entries(p, p === "/" ? 1 : p.startsWith("/mentions") || p.startsWith("/confid") ? 0.3 : 0.8)),
    ...solutions
      .filter((s) => s.status === "AVAILABLE")
      .flatMap((s) => entries({ pathname: "/solutions/[slug]", params: { slug: s.slug } }, 0.7)),
  ];
}
