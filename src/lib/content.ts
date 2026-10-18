import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, SOCIALS } from "@/lib/defaults";

// Tout le contenu public est mis en cache sous ce tag ; chaque enregistrement dans /admin l’invalide.
// Filet de sécurité : 5 minutes au plus (modifications faites directement en base, seed…)
export const CONTENT_TAG = "content";

export type Locale = "fr" | "en";
export type Feature = { title: string; text: string };

// Une traduction EN vide affiche le français
export const pick = (locale: string, fr: string, en: string) => (locale === "en" && en.trim() ? en : fr);

const loadSettings = unstable_cache(
  async () => {
    const rows = await db.setting.findMany();
    return rows.map(({ key, valueFr, valueEn }) => ({ key, valueFr, valueEn }));
  },
  ["settings"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export async function getSiteSettings() {
  const rows = await loadSettings();
  const value = (key: string) => rows.find((r) => r.key === key)?.valueFr ?? DEFAULT_SETTINGS[key] ?? "";
  const phone = (label: string) => ({ label, tel: label.replace(/[^\d+]/g, "") });

  return {
    email: value("contact.email"),
    phones: [value("contact.phone1"), value("contact.phone2")].filter(Boolean).map(phone),
    socials: SOCIALS.map(({ key, label }) => ({ key, label, handle: value(`social.${key}.handle`), url: value(`social.${key}.url`) })),
    images: {
      logo: value("image.logo"),
      logoWhite: value("image.logoWhite"),
      hero: value("image.hero"),
      about: value("image.about"),
    },
  };
}

// Textes des pages modifiés dans /admin : { "home.title": { fr, en } }
export async function getMessageOverrides() {
  const rows = await loadSettings();
  return rows
    .filter((r) => r.key.startsWith("msg."))
    .map((r) => ({ key: r.key.slice(4), fr: r.valueFr, en: r.valueEn }));
}

const loadSolutions = unstable_cache(
  () => db.solution.findMany({ where: { published: true }, orderBy: [{ position: "asc" }, { id: "asc" }] }),
  ["solutions"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

function toFeatures(value: unknown): Feature[] {
  return Array.isArray(value)
    ? value.filter((f): f is Feature => typeof f?.title === "string" && typeof f?.text === "string" && f.title.trim() !== "")
    : [];
}

export async function getSolutions(locale: string) {
  const rows = await loadSolutions();
  return rows.map((s) => {
    const featuresEn = toFeatures(s.featuresEn);
    return {
      slug: s.slug,
      name: s.name,
      status: s.status,
      logo: s.logoUrl || "",
      image: s.imageUrl || "",
      appUrl: s.appUrl || "",
      category: pick(locale, s.taglineFr, s.taglineEn),
      summary: pick(locale, s.summaryFr, s.summaryEn),
      description: pick(locale, s.descriptionFr, s.descriptionEn),
      features: locale === "en" && featuresEn.length ? featuresEn : toFeatures(s.featuresFr),
    };
  });
}

export type SolutionView = Awaited<ReturnType<typeof getSolutions>>[number];

const loadTeam = unstable_cache(
  () => db.teamMember.findMany({ where: { published: true }, orderBy: [{ position: "asc" }, { id: "asc" }] }),
  ["team"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export async function getTeam(locale: string) {
  const rows = await loadTeam();
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    role: pick(locale, m.roleFr, m.roleEn),
    bio: pick(locale, m.bioFr, m.bioEn),
    photo: m.photoUrl || "",
  }));
}
