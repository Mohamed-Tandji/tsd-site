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

// Informations légales : vides tant que TSD ne les a pas fournies (affichées « [À compléter] »)
export const LEGAL_FIELDS = [
  { key: "legal.company", label: "Raison sociale" },
  { key: "legal.form", label: "Forme juridique" },
  { key: "legal.registration", label: "Numéro d’enregistrement" },
  { key: "legal.address", label: "Adresse du siège" },
  { key: "legal.publisher", label: "Directeur ou directrice de la publication" },
  { key: "legal.host", label: "Hébergeur (nom, adresse, site)" },
  { key: "legal.retention", label: "Durée de conservation des messages (ex. : 12 mois)" },
] as const;
export type LegalKey = (typeof LEGAL_FIELDS)[number]["key"];

// Valeurs par défaut des réglages (si la base n'a pas encore la clé)
export const DEFAULT_SETTINGS: Record<string, string> = {
  "contact.email": "contact@tsdsystems.net",
  "contact.phone1": "+1 438 887 0332",
  "contact.phone2": "+223 72 33 03 03",
  "image.logo": "/brand/logo-tsd.svg",
  "image.logoWhite": "/brand/logo-tsd-blanc.svg",
  "image.hero": "", // vide : photo fournie avec le site
  "image.about": "",
  ...Object.fromEntries(LEGAL_FIELDS.map(({ key }) => [key, ""])),
  ...Object.fromEntries(SOCIALS.flatMap(({ key }) => [[`social.${key}.handle`, `tsdsystems_${key}`], [`social.${key}.url`, ""]])),
};
