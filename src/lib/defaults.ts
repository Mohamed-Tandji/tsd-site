// Réseaux et valeurs par défaut des réglages (partagés par le site et le script de seed)

export const SOCIALS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "x", label: "X" },
  { key: "youtube", label: "YouTube" },
  { key: "whatsapp", label: "WhatsApp" },
] as const;
export type SocialKey = (typeof SOCIALS)[number]["key"];

// Valeurs par défaut des réglages (si la base n'a pas encore la clé)
export const DEFAULT_SETTINGS: Record<string, string> = {
  "contact.email": "contact@tsdsystems.net",
  "contact.phone1": "+1 438 887 0332",
  "contact.phone2": "+223 72 33 03 03",
  "image.logo": "/brand/logo-tsd.svg",
  "image.logoWhite": "/brand/logo-tsd-blanc.svg",
  "image.hero": "", // vide : photo fournie avec le site
  "image.about": "",
  ...Object.fromEntries(SOCIALS.flatMap(({ key }) => [[`social.${key}.handle`, `tsdsystems_${key}`], [`social.${key}.url`, ""]])),
};
