import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// SITE_URL est lu au démarrage du serveur, pas au moment du build
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
