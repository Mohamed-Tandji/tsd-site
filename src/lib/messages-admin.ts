import "server-only";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

// Textes modifiables : toutes les chaînes de messages/*.json, regroupées par section

type Tree = { [key: string]: string | Tree };

export const SECTIONS: { key: string; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "solutionsPage", label: "Page Solutions" },
  { key: "solutionPage", label: "Fiche solution" },
  { key: "catalog", label: "Libellés des solutions" },
  { key: "about", label: "À propos" },
  { key: "team", label: "Équipe" },
  { key: "contact", label: "Contact et formulaire" },
  { key: "cta", label: "Bandeau « Un projet en tête ? »" },
  { key: "nav", label: "Menu" },
  { key: "header", label: "En-tête" },
  { key: "footer", label: "Pied de page" },
  { key: "meta", label: "Titre et description du site" },
  { key: "legalPage", label: "Mentions légales" },
  { key: "privacyPage", label: "Confidentialité" },
  { key: "notFound", label: "Page introuvable" },
];

function flatten(tree: Tree, prefix = ""): [string, string][] {
  return Object.entries(tree).flatMap(([k, v]) => (typeof v === "string" ? [[`${prefix}${k}`, v]] : flatten(v, `${prefix}${k}.`)));
}

const FR = new Map(flatten(fr as Tree));
const EN = new Map(flatten(en as Tree));

export function sectionKeys(section: string) {
  return [...FR.keys()].filter((k) => k.startsWith(`${section}.`));
}

export function defaultText(key: string, locale: "fr" | "en") {
  return (locale === "en" ? EN.get(key) : undefined) ?? FR.get(key) ?? "";
}

export function isKnownKey(key: string) {
  return FR.has(key);
}
