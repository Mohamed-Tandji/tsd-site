// Coordonnées, réseaux et solutions affichés dans le gabarit.
// Valeurs provisoires : elles seront lues en base et modifiables depuis /admin à l'étape 10.

export const contact = {
  email: "contact@tsdsystems.net",
  phones: [
    { label: "+1 438 887 0332", tel: "+14388870332" },
    { label: "+223 72 33 03 03", tel: "+22372330303" },
  ],
};

export type SocialKey = "linkedin" | "facebook" | "instagram" | "x" | "youtube" | "whatsapp";

// url vide tant que le compte n'existe pas : le réseau s'affiche sans lien
export const socials: { key: SocialKey; label: string; handle: string; url: string }[] = [
  { key: "linkedin", label: "LinkedIn", handle: "tsdsystems_linkedin", url: "" },
  { key: "facebook", label: "Facebook", handle: "tsdsystems_facebook", url: "" },
  { key: "instagram", label: "Instagram", handle: "tsdsystems_instagram", url: "" },
  { key: "x", label: "X", handle: "tsdsystems_x", url: "" },
  { key: "youtube", label: "YouTube", handle: "tsdsystems_youtube", url: "" },
  { key: "whatsapp", label: "WhatsApp", handle: "tsdsystems_whatsapp", url: "" },
];

export type SolutionInfo = { slug: string; name: string; status: "AVAILABLE" | "COMING_SOON"; logo: string };

// Textes FR/EN (catégorie, résumé) : messages/*.json, clé catalog.items.<slug>
export const solutions: SolutionInfo[] = [
  { slug: "kalanso-kunafoni", name: "Kalanso Kunafoni", status: "AVAILABLE", logo: "/solutions/kalanso-kunafoni.svg" },
  { slug: "stockautoplus", name: "StockAutoPlus", status: "AVAILABLE", logo: "/solutions/stockautoplus.svg" },
  { slug: "fasolink", name: "FasoLink", status: "COMING_SOON", logo: "/solutions/fasolink.svg" },
];
