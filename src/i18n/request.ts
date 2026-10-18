import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { getMessageOverrides } from "@/lib/content";
import { routing } from "./routing";

type Messages = { [key: string]: string | Messages };

function deepMerge(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] = typeof v === "object" && typeof b === "object" ? deepMerge(b, v) : v;
  }
  return out;
}

function getPath(obj: Messages, path: string) {
  return path.split(".").reduce<string | Messages | undefined>((o, k) => (typeof o === "object" ? o[k] : undefined), obj);
}

function setPath(obj: Messages, path: string, value: string) {
  const keys = path.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof o[k] !== "object") return; // clé inconnue : ignorée
    o[k] = { ...(o[k] as Messages) };
    o = o[k] as Messages;
  }
  if (typeof o[keys.at(-1)!] === "string") o[keys.at(-1)!] = value;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const fr = (await import("../../messages/fr.json")).default as Messages;
  // EN : tout texte absent de en.json s'affiche en français
  const messages = locale === "en" ? deepMerge(fr, (await import("../../messages/en.json")).default as Messages) : { ...fr };

  // Textes modifiés dans /admin (si la base est indisponible, les textes par défaut s'affichent)
  const overrides = await getMessageOverrides().catch(() => []);
  for (const o of overrides) {
    const frValue = o.fr.trim() ? o.fr : (getPath(fr, o.key) as string | undefined);
    const value = locale === "en" ? (o.en.trim() ? o.en : frValue) : frValue;
    if (value) setPath(messages, o.key, value);
  }

  return { locale, messages };
});
